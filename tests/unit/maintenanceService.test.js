require('../setup/setup');
const maintenanceService = require('../../src/services/maintenanceService');
const Camion = require('../../src/models/Camion');
const RegleMaintenance = require('../../src/models/RegleMaintenance');
const Maintenance = require('../../src/models/Maintenance');

describe('maintenanceService', () => {
  let camion;

  beforeEach(async () => {
    camion = await Camion.create({
      immatriculation: 'AB-999',
      marque: 'Volvo',
      modele: 'FH16',
      kilometrage: 25000
    });
    await RegleMaintenance.create({
      typeVehicule: 'Camion',
      typeMaintenance: 'vidange',
      periodiciteKm: 10000
    });
  });

  it('déclenche une alerte quand le seuil est dépassé', async () => {
    const alertes = await maintenanceService.verifierMaintenance(camion._id, 'Camion');
    expect(alertes.length).toBeGreaterThan(0);
    expect(alertes[0].statut).toBe('en_alerte');
  });

  it('bloque le véhicule quand une alerte existe', async () => {
    await maintenanceService.verifierMaintenance(camion._id, 'Camion');
    const bloque = await maintenanceService.verifierVehiculeBloque(camion._id, 'Camion');
    expect(bloque).toBe(true);
  });

  it('libère le véhicule après traitement', async () => {
    const alertes = await maintenanceService.verifierMaintenance(camion._id, 'Camion');
    await maintenanceService.traiter(alertes[0]._id);
    const bloque = await maintenanceService.verifierVehiculeBloque(camion._id, 'Camion');
    expect(bloque).toBe(false);
  });
});