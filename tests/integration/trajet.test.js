require('../setup/setup');
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Camion = require('../../src/models/Camion');
const Remorque = require('../../src/models/Remorque');

describe('Trajet API', () => {
  let adminToken, chauffeurToken, camion, remorque, chauffeur;

  beforeEach(async () => {
    const admin = await User.create({
      nom: 'Admin', email: 'admin@test.com', password: '123456', role: 'admin'
    });
    chauffeur = await User.create({
      nom: 'Chauffeur', email: 'chauffeur@test.com', password: '123456', role: 'chauffeur'
    });
    camion = await Camion.create({ immatriculation: 'AB-001', marque: 'Volvo', modele: 'FH16' });
    remorque = await Remorque.create({ immatriculation: 'REM-001', capacite: 20 });

    const loginAdmin = await request(app).post('/api/auth/login').send({
      email: 'admin@test.com', password: '123456'
    });
    adminToken = loginAdmin.body.accessToken;

    const loginChauffeur = await request(app).post('/api/auth/login').send({
      email: 'chauffeur@test.com', password: '123456'
    });
    chauffeurToken = loginChauffeur.body.accessToken;
  });

  it('POST /api/trajets crée un trajet (admin)', async () => {
    const res = await request(app)
      .post('/api/trajets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        siteDepart: 'Casa', siteArrivee: 'Rabat', marchandise: 'Tomates',
        dateDepartPrevue: '2026-12-01T08:00:00.000Z',
        dateArriveePrevue: '2026-12-01T18:00:00.000Z'
      });
    expect(res.status).toBe(201);
  });

  it('POST /api/trajets refuse chauffeur (403)', async () => {
    const res = await request(app)
      .post('/api/trajets')
      .set('Authorization', `Bearer ${chauffeurToken}`)
      .send({
        siteDepart: 'Casa', siteArrivee: 'Rabat', marchandise: 'Tomates',
        dateDepartPrevue: '2026-12-01T08:00:00.000Z',
        dateArriveePrevue: '2026-12-01T18:00:00.000Z'
      });
    expect(res.status).toBe(403);
  });

  it('PUT assigner retourne 409 si conflit', async () => {
    const t1 = await request(app)
      .post('/api/trajets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        siteDepart: 'Casa', siteArrivee: 'Rabat', marchandise: 'X',
        dateDepartPrevue: '2026-12-01T08:00:00.000Z',
        dateArriveePrevue: '2026-12-05T18:00:00.000Z'
      });

    await request(app)
      .put(`/api/trajets/${t1.body._id}/assigner`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        camionId: camion._id, remorqueId: remorque._id, chauffeurId: chauffeur._id
      });

    const t2 = await request(app)
      .post('/api/trajets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        siteDepart: 'Casa', siteArrivee: 'Rabat', marchandise: 'Y',
        dateDepartPrevue: '2026-12-03T08:00:00.000Z',
        dateArriveePrevue: '2026-12-08T18:00:00.000Z'
      });

    const res = await request(app)
      .put(`/api/trajets/${t2.body._id}/assigner`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        camionId: camion._id, remorqueId: remorque._id, chauffeurId: chauffeur._id
      });

    expect(res.status).toBe(409);
  });
});