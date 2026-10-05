const Joi = require('joi');

exports.trajetSchema = Joi.object({
  siteDepart: Joi.string().min(2).max(100).required(),
  siteArrivee: Joi.string().min(2).max(100).required(),
  marchandise: Joi.string().min(2).max(100).required(),
  dateDepartPrevue: Joi.date().iso().required(),
  dateArriveePrevue: Joi.date().iso().greater(Joi.ref('dateDepartPrevue')).required()
});

exports.assignationSchema = Joi.object({
  camionId: Joi.string().required(),
  remorqueId: Joi.string().required(),
  chauffeurId: Joi.string().required()
});

exports.kmDepartSchema = Joi.object({
  kmDepart: Joi.number().min(0).required()
});

exports.kmArriveeSchema = Joi.object({
  kmArrivee: Joi.number().min(0).required(),
  volumeGasoil: Joi.number().min(0).required(),
  remarques: Joi.string().allow('', null)
});

exports.statutSchema = Joi.object({
  statut: Joi.string().valid('en_cours', 'termine').required()
});