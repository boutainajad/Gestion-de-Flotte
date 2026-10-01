const Joi = require('joi');

exports.camionSchema = Joi.object({
  immatriculation: Joi.string().min(3).max(20).required(),
  marque: Joi.string().min(2).max(50).required(),
  modele: Joi.string().min(1).max(50).required(),
  annee: Joi.number().min(1980).max(new Date().getFullYear() + 1),
  kilometrage: Joi.number().min(0).default(0),
  statut: Joi.string()
    .valid('disponible', 'en_mission', 'maintenance', 'archive')
    .default('disponible')
});

exports.remorqueSchema = Joi.object({
  immatriculation: Joi.string().min(3).max(20).required(),
  capacite: Joi.number().min(1).required(),
  kilometrage: Joi.number().min(0).default(0),
  statut: Joi.string()
    .valid('disponible', 'en_mission', 'maintenance', 'archive')
    .default('disponible')
});


exports.pneuSchema = Joi.object({
  position: Joi.string()
    .valid('avant_gauche', 'avant_droit', 'arriere_gauche', 'arriere_droit',
           'remorque_gauche', 'remorque_droit')
    .required(),
  marque: Joi.string().min(2).max(50).required(),
  kilometrageUsure: Joi.number().min(0).default(0),
  seuilUsure: Joi.number().min(1000).default(50000),
  statut: Joi.string().valid('bon', 'use', 'a_remplacer').default('bon'),
  camion: Joi.string().allow(null, '')
});