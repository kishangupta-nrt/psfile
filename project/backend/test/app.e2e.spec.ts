/**
 * e2e smoke: health + auth login + DLT 410 check.
 * Requires the API running at E2E_BASE_URL (default http://localhost:3001):
 *   npm run start:dev (in one shell), then npm run test:e2e
 */
import request from 'supertest';

const BASE = process.env.E2E_BASE_URL || 'http://localhost:3001';

describe('backend e2e smoke', () => {
  it('GET /api/v1/health -> ok', async () => {
    const res = await request(BASE).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('POST /api/v1/auth/login -> access_token', async () => {
    const res = await request(BASE)
      .post('/api/v1/auth/login')
      .send({ email: 'customer@local.dev', password: process.env.CUSTOMER_PASSWORD || 'Customer@123' });
    expect([200, 201]).toContain(res.status);
    expect(res.body.access_token).toBeDefined();
  });

  it('GET /api/v1/dlt-templates -> 410 DLT_DISABLED', async () => {
    const res = await request(BASE).get('/api/v1/dlt-templates');
    expect(res.status).toBe(410);
    expect(res.body.code).toBe('DLT_DISABLED');
  });
});
