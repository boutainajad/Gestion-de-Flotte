const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const tokens = await authService.register(req.body);
    res.status(201).json({ message: 'Compte créé', ...tokens });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const tokens = await authService.login(req.body);
    res.json({ message: 'Connexion réussie', ...tokens });
  } catch (err) { next(err); }
};