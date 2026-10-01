const Remorque = require('../models/Remorque');

const getAll = async (filters = {}) => {
  const query = { statut: { $ne: 'archive' } };
  if (filters.statut) query.statut = filters.statut;
  return await Remorque.find(query);
};

const getById = async (id) => {
  const remorque = await Remorque.findById(id);
  if (!remorque) throw { status: 404, message: 'Remorque introuvable' };
  return remorque;
};

const create = async (data) => {
  const exists = await Remorque.findOne({ immatriculation: data.immatriculation });
  if (exists) throw { status: 409, message: 'Immatriculation déjà utilisée' };
  return await Remorque.create(data);
};

const update = async (id, data) => {
  const remorque = await Remorque.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!remorque) throw { status: 404, message: 'Remorque introuvable' };
  return remorque;
};

const archive = async (id) => {
  const remorque = await Remorque.findByIdAndUpdate(
    id,
    { statut: 'archive' },
    { new: true }
  );
  if (!remorque) throw { status: 404, message: 'Remorque introuvable' };
  return remorque;
};

module.exports = { getAll, getById, create, update, archive };