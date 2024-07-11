const request = require('supertest');
const { createApp, startServer } = require('../src/index').default; // Adjust the path as necessary
const { getConnection } = require('typeorm');

let app, server;

beforeAll(async () => {
  await startServer(); // Start the server
  app = createApp(); // Initialize the app
});

afterAll(async () => {
  const connection = getConnection();
  if (connection.isConnected) {
    await connection.close(); // Close database connection
  }
  server.close(); // Close the server
});

describe('User Endpoints', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get user profile', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password'
      });

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });
});
