const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const NGO = require('../models/NGO');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // clear DB between tests
  await NGO.deleteMany({});
});

test('GET /api/ngo returns only approved NGOs', async () => {
  // create one approved and one pending NGO
  await NGO.create({ name: 'Approved NGO', registrationNumber: 'REG-001', address: '123 Main St', contactEmail: 'a@a.com', status: 'approved' });
  await NGO.create({ name: 'Pending NGO', registrationNumber: 'REG-002', address: '456 Main St', contactEmail: 'b@b.com', status: 'pending' });

  const res = await request(app).get('/api/ngo');

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBe(1);
  expect(res.body[0].status).toBe('approved');
  expect(res.body[0].name).toBe('Approved NGO');
});
