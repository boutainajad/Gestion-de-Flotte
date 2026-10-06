const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  vehicule: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'typeVehicule'
  },
  typeVehicule: {
    type: String,
    enum: ['Camion', 'Remorque'],
    required: true
  },
  typeMaintenance: {
    type: String,
    enum: ['vidange', 'revision', 'pneus', 'autre'],
    required: true
  },
  kilometrageDeclenchement: { type: Number, required: true },
  seuilKilometrage: { type: Number, required: true },
  datePrevue: { type: Date, default: null },
  dateRealisee: { type: Date, default: null },
  statut: {
    type: String,
    enum: ['planifiee', 'en_alerte', 'en_cours', 'terminee'],
    default: 'en_alerte'
  },
  description: { type: String, default: '' },
  cout: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);