const mongoose = require('mongoose');

const trajetSchema = new mongoose.Schema({
  siteDepart: { type: String, required: true },
  siteArrivee: { type: String, required: true },
  marchandise: { type: String, required: true },
  dateDepartPrevue: { type: Date, required: true },
  dateArriveePrevue: { type: Date, required: true },
  dateDepartReelle: { type: Date, default: null },
  dateArriveeReelle: { type: Date, default: null },

  statut: {
    type: String,
    enum: ['a_faire', 'en_cours', 'termine'],
    default: 'a_faire'
  },

  kmDepart: { type: Number, default: null },
  kmArrivee: { type: Number, default: null },
  volumeGasoil: { type: Number, default: null },
  consommationMoyenne: { type: Number, default: null },
  remarques: { type: String, default: '' },

  chauffeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  camion: { type: mongoose.Schema.Types.ObjectId, ref: 'Camion', default: null },
  remorque: { type: mongoose.Schema.Types.ObjectId, ref: 'Remorque', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Trajet', trajetSchema);