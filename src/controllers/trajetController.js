const trajetService = require('../services/trajetService');

exports.getAll = async (req, res, next) => {
  try {
    const trajets = await trajetService.getAll(req.query);
    res.json({ count: trajets.length, data: trajets });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const trajet = await trajetService.getById(req.params.id);
    res.json(trajet);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const trajet = await trajetService.create(req.body);
    res.status(201).json(trajet);
  } catch (err) { next(err); }
};

exports.assigner = async (req, res, next) => {
  try {
    const trajet = await trajetService.assigner(req.params.id, req.body);
    res.json({ message: 'Trajet assigné', trajet });
  } catch (err) { next(err); }
};

exports.getMesTrajets = async (req, res, next) => {
  try {
    const trajets = await trajetService.getMesTrajets(req.user.id);
    res.json({ count: trajets.length, data: trajets });
  } catch (err) { next(err); }
};

exports.saisirKmDepart = async (req, res, next) => {
  try {
    const trajet = await trajetService.saisirKmDepart(
      req.params.id, req.body.kmDepart, req.user.id
    );
    res.json({ message: 'Kilométrage de départ enregistré', trajet });
  } catch (err) { next(err); }
};

exports.saisirKmArrivee = async (req, res, next) => {
  try {
    const trajet = await trajetService.saisirKmArrivee(
      req.params.id, req.body, req.user.id
    );
    res.json({ message: 'Trajet terminé', trajet });
  } catch (err) { next(err); }
};