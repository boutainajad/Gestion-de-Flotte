const mongoose = require('mongoose');

const remorqueSchema = new mongoose.Schema({
  immatriculation: { type: String, required: true, unique: true },
  capacite: { type: Number, required: true },
  kilometrage: { type: Number, default: 0 },
  statut: {
    type: String,
    enum: ['disponible', 'en_mission', 'maintenance', 'archive'],
    default: 'disponible'
  }
}, { timestamps: true });

module.exports = mongoose.model('Remorque', remorqueSchema);