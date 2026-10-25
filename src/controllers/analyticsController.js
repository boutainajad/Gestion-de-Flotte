const analyticsService = require('../services/analyticsService');

exports.ecoPerformance = async (req, res, next) => {
  try {
    const data = await analyticsService.ecoPerformance();
    res.json({ success: true, count: data.length, data });
  } catch (err) { next(err); }
};

exports.tiresHealthMatrix = async (req, res, next) => {
  try {
    const data = await analyticsService.tiresHealthMatrix();
    const totalCost = data.reduce((sum, item) => sum + item.estimatedCost, 0);
    res.json({ success: true, globalEstimatedCost: totalCost, data });
  } catch (err) { next(err); }
};

exports.financialEsg = async (req, res, next) => {
  try {
    const data = await analyticsService.financialEsg(req.query);
    const globalCo2 = data.reduce((sum, item) => sum + item.co2EmissionsTonnes, 0);
    const globalMarge = data.reduce((sum, item) => sum + item.margeBruteDh, 0);
    res.json({ success: true, globalCo2Tonnes: Number(globalCo2.toFixed(3)), globalMargeDh: Number(globalMarge.toFixed(2)), data });
  } catch (err) { next(err); }
};

exports.getFleetUtilization = async (req, res, next) => {
  try {
    const data = await analyticsService.getFleetUtilization();
    res.json({ success: true, data });
  } catch (err) { next(err); }
};