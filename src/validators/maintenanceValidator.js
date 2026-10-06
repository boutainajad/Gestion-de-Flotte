const Joi = require('joi');

exports.regleSchema = Joi.object({
  typeVehicule: Joi.string().valid('Camion', 'Remorque').required(),
  typeMaintenance: Joi.string().valid('vidange', 'revision', 'pneus').required(),
  periodiciteKm: Joi.number().min(100).required(),
  actif: Joi.boolean().default(true)
});

exports.traiterSchema = Joi.object({
  description: Joi.string().allow('', null),
  cout: Joi.number().min(0).allow(null)
});