const remorqueService = require('../services/remorqueService');

exports.getAll = async (req, res, next) => {
  try {
    const remorques = await remorqueService.getAll(req.query);
    res.json({ count: remorques.length, data: remorques });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const remorque = await remorqueService.getById(req.params.id);
    res.json(remorque);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const remorque = await remorqueService.create(req.body);
    res.status(201).json(remorque);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const remorque = await remorqueService.update(req.params.id, req.body);
    res.json(remorque);
  } catch (err) { next(err); }
};

exports.archive = async (req, res, next) => {
  try {
    const remorque = await remorqueService.archive(req.params.id);
    res.json({ message: 'Remorque archivée', remorque });
  } catch (err) { next(err); }
};