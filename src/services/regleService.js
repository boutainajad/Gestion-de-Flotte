const RegleMaintenance = require('../models/RegleMaintenance');

const getAll = async () => {
  return await RegleMaintenance.find().sort({ typeVehicule: 1, typeMaintenance: 1 });
};

const create = async (data) => {
  const existe = await RegleMaintenance.findOne({
    typeVehicule: data.typeVehicule,
    typeMaintenance: data.typeMaintenance
  });
  if (existe) throw { status: 409, message: 'Une règle existe déjà pour ce type' };
  return await RegleMaintenance.create(data);
};

const update = async (id, data) => {
  const regle = await RegleMaintenance.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!regle) throw { status: 404, message: 'Règle introuvable' };
  return regle;
};

const remove = async (id) => {
  const regle = await RegleMaintenance.findByIdAndDelete(id);
  if (!regle) throw { status: 404, message: 'Règle introuvable' };
  return regle;
};

module.exports = { getAll, create, update, remove };