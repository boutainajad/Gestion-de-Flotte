const mongoose = require('mongoose');

const regleSchema = new mongoose.Schema({
  typeVehicule: {
    type: String,
    enum: ['Camion', 'Remorque'],
    required: true
  },
  typeMaintenance: {
    type: String,
    enum: ['vidange', 'revision', 'pneus'],
    required: true
  },
  periodiciteKm: { type: Number, required: true },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

regleSchema.index({ typeVehicule: 1, typeMaintenance: 1 }, { unique: true });

module.exports = mongoose.model('RegleMaintenance', regleSchema);