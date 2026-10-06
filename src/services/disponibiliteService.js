const Trajet = require('../models/Trajet');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');
const User = require('../models/User');
const maintenanceService = require('./maintenanceService');

const verifierDisponibilite = async ({
  camionId, remorqueId, chauffeurId,
  dateDepart, dateArrivee,
  trajetIdExclu = null
}) => {

  const camion = await Camion.findById(camionId);
  if (!camion) throw { status: 404, message: 'Camion introuvable' };
  if (camion.statut === 'maintenance')
    throw { status: 409, message: 'Camion en maintenance' };
  if (camion.statut === 'archive')
    throw { status: 409, message: 'Camion archivé' };

  const camionBloque = await maintenanceService.verifierVehiculeBloque(camionId, 'Camion');
  if (camionBloque)
    throw { status: 409, message: 'Camion avec maintenance en attente' };

  const remorque = await Remorque.findById(remorqueId);
  if (!remorque) throw { status: 404, message: 'Remorque introuvable' };
  if (remorque.statut === 'maintenance')
    throw { status: 409, message: 'Remorque en maintenance' };

  const remorqueBloquee = await maintenanceService.verifierVehiculeBloque(remorqueId, 'Remorque');
  if (remorqueBloquee)
    throw { status: 409, message: 'Remorque avec maintenance en attente' };

  const chauffeur = await User.findById(chauffeurId);
  if (!chauffeur) throw { status: 404, message: 'Chauffeur introuvable' };
  if (chauffeur.role !== 'chauffeur')
    throw { status: 400, message: 'L\'utilisateur n\'est pas un chauffeur' };
  if (chauffeur.statut === 'suspendu')
    throw { status: 409, message: 'Chauffeur suspendu' };

  const filtre = trajetIdExclu ? { _id: { $ne: trajetIdExclu } } : {};

  const conflitCamion = await Trajet.findOne({
    ...filtre,
    camion: camionId,
    statut: { $in: ['a_faire', 'en_cours'] },
    dateDepartPrevue: { $lte: dateArrivee },
    dateArriveePrevue: { $gte: dateDepart }
  });
  if (conflitCamion)
    throw { status: 409, message: 'Camion déjà occupé sur cette période' };

  const conflitRemorque = await Trajet.findOne({
    ...filtre,
    remorque: remorqueId,
    statut: { $in: ['a_faire', 'en_cours'] },
    dateDepartPrevue: { $lte: dateArrivee },
    dateArriveePrevue: { $gte: dateDepart }
  });
  if (conflitRemorque)
    throw { status: 409, message: 'Remorque déjà occupée sur cette période' };

  const conflitChauffeur = await Trajet.findOne({
    ...filtre,
    chauffeur: chauffeurId,
    statut: { $in: ['a_faire', 'en_cours'] },
    dateDepartPrevue: { $lte: dateArrivee },
    dateArriveePrevue: { $gte: dateDepart }
  });
  if (conflitChauffeur)
    throw { status: 409, message: 'Chauffeur déjà occupé sur cette période' };

  return { camion, remorque, chauffeur };
};

module.exports = { verifierDisponibilite };