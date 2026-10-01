const Camion = require('../models/Camion');

const getAll = async (filters = {}) => {
  const query = { statut: { $ne: 'archive' } };
  if (filters.statut) query.statut = filters.statut;
  if (filters.marque) query.marque = new RegExp(filters.marque, 'i');
  return await Camion.find(query).populate('pneus');
};

const getById = async (id) => {
  const camion = await Camion.findById(id).populate('pneus');
  if (!camion) throw { status: 404, message: 'Camion introuvable' };
  return camion;
};

const create = async (data) => {
  const exists = await Camion.findOne({ immatriculation: data.immatriculation });
  if (exists) throw { status: 409, message: 'Immatriculation déjà utilisée' };
  return await Camion.create(data);
};

const update = async (id, data) => {
  const camion = await Camion.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!camion) throw { status: 404, message: 'Camion introuvable' };
  return camion;
};

const archive = async (id) => {
  const camion = await Camion.findByIdAndUpdate(
    id,
    { statut: 'archive' },
    { new: true }
  );
  if (!camion) throw { status: 404, message: 'Camion introuvable' };
  return camion;
};

module.exports = { getAll, getById, create, update, archive };