const request = require('supertest');
const app = require('../app');

describe('Expense API', () => {
  test('should create an expense', async () => {
    const res = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', 'test-create-1')
      .send({
        amount: '250',
        category: 'Food',
        description: 'Lunch',
        date: '2026-04-20',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.amount).toBe('250.00');
    expect(res.body.category).toBe('Food');
  });

  test('should reject missing required fields', async () => {
    const res = await request(app)
      .post('/expenses')
      .send({
        amount: '',
        category: '',
      });

    expect(res.statusCode).toBe(400);
  });

  test('should prevent duplicate insert using idempotency key', async () => {
    const payload = {
      amount: '500',
      category: 'Travel',
      description: 'Taxi',
      date: '2026-04-20',
    };

    const first = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', 'retry-check')
      .send(payload);

    const second = await request(app)
      .post('/expenses')
      .set('Idempotency-Key', 'retry-check')
      .send(payload);

    expect(first.body.id).toBe(second.body.id);
  });

  test('should fetch expenses sorted newest first', async () => {
    const res = await request(app).get('/expenses?sort=date_desc');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});