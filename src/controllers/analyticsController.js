const analyticsService = require('../services/analyticsService');

exports.ecoPerformance = async (req, res, next) => {
  try {
    const data = await analyticsService.ecoPerformance();
    res.json({ count: data.length, data });
  } catch (err) { next(err); }
};

exports.tiresHealthMatrix = async (req, res, next) => {
  try {
    const data = await analyticsService.tiresHealthMatrix();
    res.json(data);
  } catch (err) { next(err); }
};