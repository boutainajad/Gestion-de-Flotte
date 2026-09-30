const Joi = require('joi');

exports.registerSchema = Joi.object({
  nom: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'chauffeur').default('chauffeur'),
  telephone: Joi.string().allow('', null)
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});