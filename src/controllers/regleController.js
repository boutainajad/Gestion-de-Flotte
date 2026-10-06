const regleService = require('../services/regleService');

exports.getAll = async (req, res, next) => {
  try {
    const regles = await regleService.getAll();
    res.json({ count: regles.length, data: regles });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const regle = await regleService.create(req.body);
    res.status(201).json(regle);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const regle = await regleService.update(req.params.id, req.body);
    res.json(regle);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await regleService.remove(req.params.id);
    res.json({ message: 'Règle supprimée' });
  } catch (err) { next(err); }
};