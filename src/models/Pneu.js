const mongoose = require('mongoose');

const pneuSchema = new mongoose.Schema({
  position: {
    type: String,
    enum: ['avant_gauche', 'avant_droit', 'arriere_gauche', 'arriere_droit',
           'remorque_gauche', 'remorque_droit'],
    required: true
  },
  marque: { type: String, required: true },
  kilometrageUsure: { type: Number, default: 0 },
  seuilUsure: { type: Number, default: 50000 },
  statut: {
    type: String,
    enum: ['bon', 'use', 'a_remplacer'],
    default: 'bon'
  },
  camion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camion',
    default: null
  }
}, { timestamps: true });

pneuSchema.methods.estUse = function () {
  return this.kilometrageUsure >= this.seuilUsure;
};

module.exports = mongoose.model('Pneu', pneuSchema);