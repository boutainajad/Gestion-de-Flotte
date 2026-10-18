require('../setup/setup');
const request = require('supertest');
const app = require('../../src/app');

describe('Auth API', () => {
  it('POST /api/auth/register crée un compte admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'Admin Test',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin'
      });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /api/auth/register refuse email dupliqué', async () => {
    await request(app).post('/api/auth/register').send({
      nom: 'A', email: 'a@test.com', password: '123456', role: 'admin'
    });
    const res = await request(app).post('/api/auth/register').send({
      nom: 'A', email: 'a@test.com', password: '123456', role: 'admin'
    });
    expect(res.status).toBe(409);
  });

  it('POST /api/auth/login réussit avec bons identifiants', async () => {
    await request(app).post('/api/auth/register').send({
      nom: 'A', email: 'a@test.com', password: '123456', role: 'admin'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'a@test.com', password: '123456'
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /api/auth/login refuse mauvais mot de passe', async () => {
    await request(app).post('/api/auth/register').send({
      nom: 'A', email: 'a@test.com', password: '123456', role: 'admin'
    });
    const res = await request(app).post('/api/auth/login').send({
      email: 'a@test.com', password: 'wrong'
    });
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me refuse sans token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});