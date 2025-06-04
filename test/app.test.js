const request = require('supertest');
const app = require('../server');

describe('AI Bidding API', () => {
  let token;

  it('registers a user', async () => {
    const res = await request(app).post('/register').send({ username: 'alice', password: 'password' });
    expect(res.statusCode).toBe(200);
  });

  it('logs in the user', async () => {
    const res = await request(app).post('/login').send({ username: 'alice', password: 'password' });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it('creates a model listing', async () => {
    const res = await request(app)
      .post('/models')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Model1', description: 'test model' });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
  });

  it('lists models', async () => {
    const res = await request(app).get('/models');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('places a bid', async () => {
    const res = await request(app)
      .post('/models/1/bid')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 });
    expect(res.statusCode).toBe(200);
  });
});
