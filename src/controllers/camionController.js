const camionService = require('../services/camionService');

exports.getAll = async (req, res, next) => {
  try {
    const camions = await camionService.getAll(req.query);
    res.json({ count: camions.length, data: camions });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const camion = await camionService.getById(req.params.id);
    res.json(camion);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const camion = await camionService.create(req.body);
    res.status(201).json(camion);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const camion = await camionService.update(req.params.id, req.body);
    res.json(camion);
  } catch (err) { next(err); }
};

exports.archive = async (req, res, next) => {
  try {
    const camion = await camionService.archive(req.params.id);
    res.json({ message: 'Camion archivé', camion });
  } catch (err) { next(err); }
};