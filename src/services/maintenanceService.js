const Maintenance = require('../models/Maintenance');
const RegleMaintenance = require('../models/RegleMaintenance');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');

const getAlertes = async (filters = {}) => {
  const query = { statut: { $in: ['en_alerte', 'planifiee'] } };
  if (filters.typeVehicule) query.typeVehicule = filters.typeVehicule;
  return await Maintenance.find(query).populate('vehicule');
};

const getById = async (id) => {
  const m = await Maintenance.findById(id).populate('vehicule');
  if (!m) throw { status: 404, message: 'Maintenance introuvable' };
  return m;
};

const traiter = async (id, data = {}) => {
  const m = await Maintenance.findById(id);
  if (!m) throw { status: 404, message: 'Maintenance introuvable' };

  m.statut = 'terminee';
  m.dateRealisee = new Date();
  if (data.description) m.description = data.description;
  if (data.cout !== undefined) m.cout = data.cout;
  await m.save();

  return m;
};

const verifierUsurePneus = async (camionId) => {
  const camion = await Camion.findById(camionId).populate('pneus');
  if (!camion) return;

  for (const pneu of camion.pneus) {
    if (pneu.kilometrageUsure >= pneu.seuilUsure && pneu.statut !== 'a_remplacer') {
      pneu.statut = 'a_remplacer';
      await pneu.save();
    } else if (pneu.kilometrageUsure >= pneu.seuilUsure * 0.8 && pneu.statut === 'bon') {
      pneu.statut = 'use';
      await pneu.save();
    }
  }
};

const verifierMaintenance = async (vehiculeId, typeVehicule = 'Camion') => {
  const Model = typeVehicule === 'Camion' ? Camion : Remorque;
  const vehicule = await Model.findById(vehiculeId);
  if (!vehicule) return [];

  const regles = await RegleMaintenance.find({ typeVehicule, actif: true });
  const alertesCreees = [];

  for (const regle of regles) {
    const seuil = Math.floor(vehicule.kilometrage / regle.periodiciteKm) * regle.periodiciteKm;

    if (seuil > 0) {
      const existe = await Maintenance.findOne({
        vehicule: vehiculeId,
        typeVehicule,
        typeMaintenance: regle.typeMaintenance,
        kilometrageDeclenchement: seuil,
        statut: { $in: ['en_alerte', 'planifiee', 'en_cours'] }
      });

      if (!existe) {
        const alerte = await Maintenance.create({
          vehicule: vehiculeId,
          typeVehicule,
          typeMaintenance: regle.typeMaintenance,
          kilometrageDeclenchement: seuil,
          seuilKilometrage: regle.periodiciteKm,
          statut: 'en_alerte'
        });
        alertesCreees.push(alerte);
      }
    }
  }

  return alertesCreees;
};

const verifierVehiculeBloque = async (vehiculeId, typeVehicule = 'Camion') => {
  const alerte = await Maintenance.findOne({
    vehicule: vehiculeId,
    typeVehicule,
    statut: 'en_alerte'
  });
  return !!alerte;
};

module.exports = {
  getAlertes,
  getById,
  traiter,
  verifierUsurePneus,
  verifierMaintenance,
  verifierVehiculeBloque
};