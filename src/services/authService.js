const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  return { accessToken, refreshToken };
};

const register = async (data) => {
  const exists = await User.findOne({ email: data.email });
  if (exists) throw { status: 409, message: 'Email déjà utilisé' };
  const user = await User.create(data);
  return generateTokens(user);
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) throw { status: 401, message: 'Identifiants invalides' };
  if (user.statut === 'suspendu') throw { status: 403, message: 'Compte suspendu' };
  const ok = await user.comparePassword(password);
  if (!ok) throw { status: 401, message: 'Identifiants invalides' };
  return generateTokens(user);
};

module.exports = { register, login };