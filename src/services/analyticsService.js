const Trajet = require('../models/Trajet');
const Pneu = require('../models/Pneu');
const Camion = require('../models/Camion');

const ecoPerformance = async () => {
  const result = await Trajet.aggregate([
    { $match: { statut: 'termine', volumeGasoil: { $ne: null }, kmDepart: { $ne: null }, kmArrivee: { $ne: null }, chauffeur: { $ne: null } } },
    { $group: { _id: '$chauffeur', totalLitres: { $sum: '$volumeGasoil' }, totalKm: { $sum: { $subtract: ['$kmArrivee', '$kmDepart'] } }, nbTrajets: { $sum: 1 } } },
    { $match: { totalKm: { $gt: 0 } } },
    { $project: { _id: 0, chauffeurId: '$_id', totalLitres: 1, totalKm: 1, nbTrajets: 1, consommationMoyenne: { $round: [{ $multiply: [{ $divide: ['$totalLitres', '$totalKm'] }, 100] }, 2] } } },
    { $addFields: { scoreEco: { $round: [{ $max: [0, { $min: [100, { $subtract: [100, { $multiply: [{ $subtract: ['$consommationMoyenne', 30] }, 2.5] }] }] }] }, 2] } } },
    { $lookup: { from: 'users', localField: 'chauffeurId', foreignField: '_id', as: 'chauffeurInfo' } },
    { $unwind: '$chauffeurInfo' },
    { $project: { chauffeur: { id: '$chauffeurInfo._id', nom: '$chauffeurInfo.nom', email: '$chauffeurInfo.email' }, totalLitres: 1, totalKm: 1, nbTrajets: 1, consommationMoyenne: 1, scoreEco: 1 } },
    { $sort: { scoreEco: -1 } }
  ]);
  return result;
};

const tiresHealthMatrix = async () => {
  const result = await Pneu.aggregate([
    { $lookup: { from: 'camions', localField: 'camion', foreignField: '_id', as: 'camionInfo' } },
    { $unwind: { path: '$camionInfo', preserveNullAndEmptyArrays: true } },
    { $group: { _id: { position: '$position', statut: '$statut' }, count: { $sum: 1 }, totalUsure: { $sum: '$kilometrageUsure' }, avgUsure: { $avg: '$kilometrageUsure' } } },
    { $addFields: { estimatedCost: { $cond: [{ $eq: ['$_id.statut', 'a_remplacer'] }, { $multiply: ['$count', 1500] }, 0] } } },
    { $project: { _id: 0, position: '$_id.position', statut: '$_id.statut', count: 1, avgUsure: { $round: ['$avgUsure', 0] }, estimatedCost: 1 } },
    { $sort: { position: 1, statut: 1 } }
  ]);
  return result;
};

const financialEsg = async (filters = {}) => {
  const matchStage = { statut: 'termine', volumeGasoil: { $ne: null }, kmDepart: { $ne: null }, kmArrivee: { $ne: null } };
  if (filters.startDate || filters.endDate) {
    matchStage.dateDepartReelle = {};
    if (filters.startDate) matchStage.dateDepartReelle.$gte = new Date(filters.startDate);
    if (filters.endDate) matchStage.dateDepartReelle.$lte = new Date(filters.endDate);
  }
  const result = await Trajet.aggregate([
    { $match: matchStage },
    { $group: { _id: { siteDepart: '$siteDepart', siteArrivee: '$siteArrivee' }, totalLitres: { $sum: '$volumeGasoil' }, totalKm: { $sum: { $subtract: ['$kmArrivee', '$kmDepart'] } }, nbTrajets: { $sum: 1 } } },
    { $project: { _id: 0, corridor: { $concat: ['$_id.siteDepart', ' → ', '$_id.siteArrivee'] }, totalLitres: 1, totalKm: 1, nbTrajets: 1, co2EmissionsTonnes: { $round: [{ $divide: [{ $multiply: ['$totalLitres', 2.68] }, 1000] }, 3] }, margeBruteDh: { $round: [{ $multiply: ['$totalKm', 3.5] }, 2] } } },
    { $sort: { margeBruteDh: -1 } }
  ]);
  return result;
};

const getFleetUtilization = async () => {
  const totalCamions = await Camion.countDocuments({ statut: { $ne: 'archive' } });
  const result = await Trajet.aggregate([{ $group: { _id: '$statut', count: { $sum: 1 } } }, { $project: { _id: 0, statut: '$_id', count: 1 } }]);
  const stats = { a_faire: 0, en_cours: 0, termine: 0 };
  result.forEach(item => { if (stats[item.statut] !== undefined) stats[item.statut] = item.count; });
  const totalTrajets = stats.a_faire + stats.en_cours + stats.termine;
  const tauxUtilisation = totalTrajets > 0 ? ((stats.termine / totalTrajets) * 100).toFixed(2) : 0;
  return { totalCamions, totalTrajets, trajetsParStatut: stats, tauxUtilisationPourcent: Number(tauxUtilisation) };
};

module.exports = { ecoPerformance, tiresHealthMatrix, financialEsg, getFleetUtilization };