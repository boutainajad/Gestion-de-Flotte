require('../setup/setup');
const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth API', () => {
  let adminToken;

  beforeEach(async () => {
    // Kréyi l-user 9bel kol test (bach ykoun mawjoud mnin kaydir login)
    await User.create({
      nom: 'Admin Test',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin'
    });
  });

  it('POST /api/v1/auth/register crée un compte', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ 
        nom: 'Admin', 
        email: 'newadmin@test.com', 
        password: '123456', 
        role: 'admin' 
      });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
  });

  it('POST /api/v1/auth/login réussit', async () => {
    // L-user déjà m-créé f l-beforeEach
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@test.com', 
        password: '123456'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    adminToken = res.body.accessToken;
  });

  it('GET /api/v1/auth/me refuse sans token (401)', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});