const Pneu = require('../models/Pneu');
const Camion = require('../models/Camion');

const getAll = async (filters = {}) => {
  const query = {};
  if (filters.camion) query.camion = filters.camion;
  if (filters.statut) query.statut = filters.statut;
  return await Pneu.find(query).populate('camion');
};

const getById = async (id) => {
  const pneu = await Pneu.findById(id).populate('camion');
  if (!pneu) throw { status: 404, message: 'Pneu introuvable' };
  return pneu;
};

const create = async (data) => {
  if (data.camion) {
    const camion = await Camion.findById(data.camion);
    if (!camion) throw { status: 404, message: 'Camion introuvable' };
  }
  const pneu = await Pneu.create(data);

  if (data.camion) {
    await Camion.findByIdAndUpdate(data.camion, {
      $push: { pneus: pneu._id }
    });
  }
  return pneu;
};

const update = async (id, data) => {
  const pneu = await Pneu.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });
  if (!pneu) throw { status: 404, message: 'Pneu introuvable' };
  return pneu;
};

const remove = async (id) => {
  const pneu = await Pneu.findByIdAndDelete(id);
  if (!pneu) throw { status: 404, message: 'Pneu introuvable' };
  if (pneu.camion) {
    await Camion.findByIdAndUpdate(pneu.camion, {
      $pull: { pneus: pneu._id }
    });
  }
  return pneu;
};

const associerCamion = async (pneuId, camionId) => {
  const camion = await Camion.findById(camionId);
  if (!camion) throw { status: 404, message: 'Camion introuvable' };

  const pneu = await Pneu.findByIdAndUpdate(
    pneuId,
    { camion: camionId },
    { new: true }
  );
  if (!pneu) throw { status: 404, message: 'Pneu introuvable' };

  if (!camion.pneus.includes(pneuId)) {
    camion.pneus.push(pneuId);
    await camion.save();
  }
  return pneu;
};

module.exports = { getAll, getById, create, update, remove, associerCamion };