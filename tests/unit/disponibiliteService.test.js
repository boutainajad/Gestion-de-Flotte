require('../setup/setup');
const disponibiliteService = require('../../src/services/disponibiliteService');
const Trajet = require('../../src/models/Trajet');
const Camion = require('../../src/models/Camion');
const Remorque = require('../../src/models/Remorque');
const User = require('../../src/models/User');

describe('disponibiliteService', () => {
  let camion, remorque, chauffeur;

  beforeEach(async () => {
    camion = await Camion.create({ immatriculation: 'AB-123', marque: 'Volvo', modele: 'FH16' });
    remorque = await Remorque.create({ immatriculation: 'REM-001', capacite: 20 });
    chauffeur = await User.create({ nom: 'Jean', email: 'jean@test.com', password: '123456', role: 'chauffeur' });
  });

  it('accepte si tout est disponible', async () => {
    const result = await disponibiliteService.verifierDisponibilite({
      camionId: camion._id,
      remorqueId: remorque._id,
      chauffeurId: chauffeur._id,
      dateDepart: new Date('2026-12-01'),
      dateArrivee: new Date('2026-12-05')
    });
    expect(result.camion._id.toString()).toBe(camion._id.toString());
  });

  it('rejette si camion en maintenance (409)', async () => {
    camion.statut = 'maintenance';
    await camion.save();

    await expect(disponibiliteService.verifierDisponibilite({
      camionId: camion._id,
      remorqueId: remorque._id,
      chauffeurId: chauffeur._id,
      dateDepart: new Date('2026-12-01'),
      dateArrivee: new Date('2026-12-05')
    })).rejects.toMatchObject({ status: 409 });
  });

  it('rejette si conflit de dates (409)', async () => {
    await Trajet.create({
      siteDepart: 'Casa', siteArrivee: 'Rabat', marchandise: 'Tomates',
      dateDepartPrevue: new Date('2026-12-01'),
      dateArriveePrevue: new Date('2026-12-05'),
      camion: camion._id, remorque: remorque._id, chauffeur: chauffeur._id, statut: 'a_faire'
    });

    await expect(disponibiliteService.verifierDisponibilite({
      camionId: camion._id,
      remorqueId: remorque._id,
      chauffeurId: chauffeur._id,
      dateDepart: new Date('2026-12-03'),
      dateArrivee: new Date('2026-12-08')
    })).rejects.toMatchObject({ status: 409 });
  });
});