const mongoose = require('mongoose');

const camionSchema = new mongoose.Schema({
  immatriculation: { type: String, required: true, unique: true },
  marque: { type: String, required: true },
  modele: { type: String, required: true },
  annee: { type: Number },
  kilometrage: { type: Number, default: 0 },
  statut: {
    type: String,
    enum: ['disponible', 'en_mission', 'maintenance', 'archive'],
    default: 'disponible'
  },
  pneus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pneu' }]
}, { timestamps: true });

module.exports = mongoose.model('Camion', camionSchema);