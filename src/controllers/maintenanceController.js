const maintenanceService = require('../services/maintenanceService');

exports.getAlertes = async (req, res, next) => {
  try {
    const alertes = await maintenanceService.getAlertes(req.query);
    res.json({ count: alertes.length, data: alertes });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const m = await maintenanceService.getById(req.params.id);
    res.json(m);
  } catch (err) { next(err); }
};

exports.traiter = async (req, res, next) => {
  try {
    const m = await maintenanceService.traiter(req.params.id, req.body);
    res.json({ message: 'Maintenance traitée', maintenance: m });
  } catch (err) { next(err); }
};

exports.verifier = async (req, res, next) => {
  try {
    const { vehiculeId, typeVehicule } = req.body;
    const alertes = await maintenanceService.verifierMaintenance(vehiculeId, typeVehicule);
    res.json({ count: alertes.length, data: alertes });
  } catch (err) { next(err); }
};