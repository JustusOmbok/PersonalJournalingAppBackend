// user.test.js
const request = require('supertest');
const app = require('../src/index'); // Adjust the path as necessary
const { getConnection } = require('typeorm');

describe('User Endpoints', () => {
  afterAll(async () => {
    await getConnection().close();
  });

  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get user profile', async () => {
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password'
      });

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${loginRes.body.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser');
  });
});
