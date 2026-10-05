const Trajet = require('../models/Trajet');
const disponibiliteService = require('./disponibiliteService');
const calculService = require('./calculService');

const getAll = async (filters = {}) => {
  const query = {};
  if (filters.statut) query.statut = filters.statut;
  if (filters.chauffeur) query.chauffeur = filters.chauffeur;
  return await Trajet.find(query)
    .populate('chauffeur', 'nom email')
    .populate('camion', 'immatriculation marque')
    .populate('remorque', 'immatriculation capacite');
};

const getById = async (id) => {
  const trajet = await Trajet.findById(id)
    .populate('chauffeur', 'nom email')
    .populate('camion')
    .populate('remorque');
  if (!trajet) throw { status: 404, message: 'Trajet introuvable' };
  return trajet;
};

const create = async (data) => {
  if (new Date(data.dateArriveePrevue) <= new Date(data.dateDepartPrevue)) {
    throw { status: 400, message: 'La date d\'arrivée doit être après la date de départ' };
  }
  return await Trajet.create(data);
};

const assigner = async (trajetId, { camionId, remorqueId, chauffeurId }) => {
  const trajet = await Trajet.findById(trajetId);
  if (!trajet) throw { status: 404, message: 'Trajet introuvable' };

  await disponibiliteService.verifierDisponibilite({
    camionId, remorqueId, chauffeurId,
    dateDepart: trajet.dateDepartPrevue,
    dateArrivee: trajet.dateArriveePrevue,
    trajetIdExclu: trajetId
  });

  trajet.camion = camionId;
  trajet.remorque = remorqueId;
  trajet.chauffeur = chauffeurId;
  await trajet.save();
  return trajet;
};

const getMesTrajets = async (chauffeurId) => {
  return await Trajet.find({ chauffeur: chauffeurId })
    .populate('camion', 'immatriculation marque')
    .populate('remorque', 'immatriculation');
};

const saisirKmDepart = async (trajetId, kmDepart, chauffeurId) => {
  const trajet = await Trajet.findById(trajetId);
  if (!trajet) throw { status: 404, message: 'Trajet introuvable' };

  if (trajet.chauffeur.toString() !== chauffeurId.toString()) {
    throw { status: 403, message: 'Ce trajet ne vous appartient pas' };
  }

  if (trajet.statut !== 'a_faire') {
    throw { status: 400, message: 'Le trajet doit être au statut "à faire"' };
  }

  trajet.kmDepart = kmDepart;
  trajet.dateDepartReelle = new Date();
  trajet.statut = 'en_cours';
  await trajet.save();
  return trajet;
};

const saisirKmArrivee = async (trajetId, { kmArrivee, volumeGasoil, remarques }, chauffeurId) => {
  const trajet = await Trajet.findById(trajetId);
  if (!trajet) throw { status: 404, message: 'Trajet introuvable' };

  if (trajet.chauffeur.toString() !== chauffeurId.toString()) {
    throw { status: 403, message: 'Ce trajet ne vous appartient pas' };
  }

  if (trajet.statut !== 'en_cours') {
    throw { status: 400, message: 'Le trajet doit être en cours' };
  }

  if (trajet.kmDepart === null) {
    throw { status: 400, message: 'Le kilométrage de départ n\'a pas été saisi' };
  }

  const kmParcourus = calculService.calculerKilometrage(trajet.kmDepart, kmArrivee);
  const consommationMoyenne = calculService.calculerConsommation(kmParcourus, volumeGasoil);

  trajet.kmArrivee = kmArrivee;
  trajet.volumeGasoil = volumeGasoil;
  trajet.consommationMoyenne = consommationMoyenne;
  trajet.remarques = remarques || '';
  trajet.dateArriveeReelle = new Date();
  trajet.statut = 'termine';

  await trajet.save();

  await require('../models/Camion').findByIdAndUpdate(
    trajet.camion,
    { $inc: { kilometrage: kmParcourus } }
  );

  if (trajet.remorque) {
    await require('../models/Remorque').findByIdAndUpdate(
      trajet.remorque,
      { $inc: { kilometrage: kmParcourus } }
    );
  }

  return trajet;
};

module.exports = {
  getAll, getById, create, assigner, getMesTrajets,
  saisirKmDepart, saisirKmArrivee
};