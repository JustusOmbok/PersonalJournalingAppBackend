// entry.test.js
const request = require('supertest');
const app = require('../src/index'); // Adjust the path as necessary
const { getConnection } = require('typeorm');

describe('Entry Endpoints', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        username: 'testuser',
        password: 'password'
      });
    token = res.body.token;
  });

  afterAll(async () => {
    await getConnection().close();
  });

  it('should create an entry', async () => {
    const res = await request(app)
      .post('/api/entries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Entry',
        content: 'This is a test entry',
        category: 'General',
        date: '2024-07-09'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Entry created successfully');
  });

  it('should get entries', async () => {
    const res = await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get entry by ID', async () => {
    const entriesRes = await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`);

    const entryId = entriesRes.body[0].id;
    const res = await request(app)
      .get(`/api/entries/${entryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', entryId);
  });

  it('should update an entry', async () => {
    const entriesRes = await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`);

    const entryId = entriesRes.body[0].id;
    const res = await request(app)
      .put(`/api/entries/${entryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Test Entry',
        content: 'This is an updated test entry',
        category: 'General',
        date: '2024-07-09'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Entry updated successfully');
  });

  it('should delete an entry', async () => {
    const entriesRes = await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${token}`);

    const entryId = entriesRes.body[0].id;
    const res = await request(app)
      .delete(`/api/entries/${entryId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Entry deleted successfully');
  });
});
