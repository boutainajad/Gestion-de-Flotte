const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ message: 'Token manquant' });

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable' });
    if (user.statut === 'suspendu')
      return res.status(403).json({ message: 'Compte suspendu' });

    req.user = { id: user._id, role: user.role, nom: user.nom };
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Accès refusé' });
  next();
};