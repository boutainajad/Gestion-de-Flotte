const Trajet = require('../models/Trajet');
const Pneu = require('../models/Pneu');

// ====== Eco-Performance (J2) ======
const ecoPerformance = async () => {
  const result = await Trajet.aggregate([
    {
      $match: {
        statut: 'termine',
        volumeGasoil: { $ne: null },
        kmDepart: { $ne: null },
        kmArrivee: { $ne: null },
        chauffeur: { $ne: null }
      }
    },
    {
      $group: {
        _id: '$chauffeur',
        totalL: { $sum: '$volumeGasoil' },
        totalKm: { $sum: { $subtract: ['$kmArrivee', '$kmDepart'] } },
        nbTrajets: { $sum: 1 }
      }
    },
    { $match: { totalKm: { $gt: 0 } } },
    {
      $project: {
        _id: 0,
        chauffeurId: '$_id',
        totalL: 1,
        totalKm: 1,
        nbTrajets: 1,
        consommation: {
          $round: [{ $multiply: [{ $divide: ['$totalL', '$totalKm'] }, 100] }, 2]
        }
      }
    },
    {
      $addFields: {
        score: {
          $max: [
            0,
            {
              $min: [
                100,
                { $subtract: [100, { $multiply: [{ $subtract: ['$consommation', 30] }, 2.5] }] }
              ]
            }
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'chauffeurId',
        foreignField: '_id',
        as: 'chauffeurInfo'
      }
    },
    { $unwind: '$chauffeurInfo' },
    {
      $project: {
        chauffeur: {
          id: '$chauffeurInfo._id',
          nom: '$chauffeurInfo.nom',
          email: '$chauffeurInfo.email'
        },
        totalL: 1,
        totalKm: 1,
        nbTrajets: 1,
        consommation: 1,
        score: { $round: ['$score', 2] }
      }
    },
    { $sort: { score: -1 } }
  ]);

  return result;
};

const tiresHealthMatrix = async () => {
  const result = await Pneu.aggregate([
    {
      $group: {
        _id: { position: '$position', statut: '$statut' },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.position',
        details: {
          $push: { statut: '$_id.statut', count: '$count' }
        },
        totalParPosition: { $sum: '$count' }
      }
    },
    {
      $project: {
        position: '$_id',
        details: 1,
        totalParPosition: 1,
        aRemplacer: {
          $let: {
            vars: {
              statusARemplacer: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$details',
                      as: 'detail',
                      cond: { $eq: ['$$detail.statut', 'a_remplacer'] }
                    }
                  },
                  0
                ]
              }
            },
            in: { $ifNull: ['$$statusARemplacer.count', 0] }
          }
        }
      }
    },
    {
      $addFields: {
        budgetEstimeDH: { $multiply: ['$aRemplacer', 1500] }
      }
    },
    { $sort: { position: 1 } }
  ]);

  const budgetTotalGlobal = result.reduce((sum, item) => sum + item.budgetEstimeDH, 0);

  return {
    matrix: result,
    budgetTotalGlobal
  };
};

module.exports = { ecoPerformance, tiresHealthMatrix };