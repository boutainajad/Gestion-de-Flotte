const pneuService = require('../services/pneuService');

exports.getAll = async (req, res, next) => {
  try {
    const pneus = await pneuService.getAll(req.query);
    res.json({ count: pneus.length, data: pneus });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const pneu = await pneuService.getById(req.params.id);
    res.json(pneu);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const pneu = await pneuService.create(req.body);
    res.status(201).json(pneu);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const pneu = await pneuService.update(req.params.id, req.body);
    res.json(pneu);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await pneuService.remove(req.params.id);
    res.json({ message: 'Pneu supprimé' });
  } catch (err) { next(err); }
};

exports.associerCamion = async (req, res, next) => {
  try {
    const { camionId } = req.body;
    const pneu = await pneuService.associerCamion(req.params.id, camionId);
    res.json({ message: 'Pneu associé', pneu });
  } catch (err) { next(err); }
};