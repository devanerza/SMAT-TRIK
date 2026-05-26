import * as fc from 'fast-check';

jest.mock('../../lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

jest.mock('../../lib/auth', () => ({
  authenticateUser: jest.fn(),
}));

import { authenticateUser } from '../../lib/auth';

function createMockReqRes(method, query, body, headers) {
  const req = {
    method,
    query: query || {},
    body: body || {},
    headers: {
      authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  const res = {
    _status: 200,
    _json: null,
    status(code) {
      this._status = code;
      return this;
    },
    json(data) {
      this._json = data;
      return this;
    },
  };
  return { req, res };
}

function makeChain(value) {
  const prom = Promise.resolve(value);
  prom.select = jest.fn(() => prom);
  prom.insert = jest.fn(() => prom);
  prom.update = jest.fn(() => prom);
  prom.delete = jest.fn(() => prom);
  prom.eq = jest.fn(() => prom);
  prom.gte = jest.fn(() => prom);
  prom.lte = jest.fn(() => prom);
  prom.in = jest.fn(() => prom);
  prom.order = jest.fn(() => prom);
  prom.single = jest.fn(() => prom);
  return prom;
}

beforeEach(() => {
  jest.clearAllMocks();
  process.env.ADMIN_PHONE = '628123456789';
});

describe('API Route: GET /api/quota', () => {
  test('returns quota for a given date', async () => {
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const orders = [{ id: 1, status: 'Pending', order_items: [{ unit_count: 3 }] }];
    supabaseAdmin.from.mockReturnValue(makeChain({ data: orders, error: null }));

    const handler = require('../../pages/api/quota').default;
    const { req, res } = createMockReqRes('GET', { date: '2026-05-26' });
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json).toMatchObject({ date: '2026-05-26', maxUnits: 20 });
    expect(typeof res._json.usedUnits).toBe('number');
    expect(typeof res._json.remainingUnits).toBe('number');
  });

  test('returns 400 for invalid date format', async () => {
    const handler = require('../../pages/api/quota').default;
    const { req, res } = createMockReqRes('GET', { date: 'invalid' });
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._json.error).toBeDefined();
  });

  test('returns 405 for non-GET methods', async () => {
    const handler = require('../../pages/api/quota').default;
    const { req, res } = createMockReqRes('POST');
    await handler(req, res);
    expect(res._status).toBe(405);
  });
});

describe('API Route: POST /api/orders', () => {
  test('creates an order successfully and returns waLink', async () => {
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const quotaChain = makeChain({ data: [], error: null });
    const insertChain = makeChain({ data: { id: 1, team_id: null, status: 'Pending' }, error: null });
    quotaChain.insert = jest.fn(() => insertChain);
    supabaseAdmin.from.mockReturnValue(quotaChain);

    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('POST', {}, {
      customerInfo: {
        custName: 'John Doe',
        custPhone: '08123456789',
        custLocUrl: 'https://maps.example.com/loc',
        custEmail: 'john@example.com',
      },
      items: [
        { serviceId: 'ac_cleaning', acCapacity: '1_pk', unitCount: 2 },
      ],
    });
    await handler(req, res);
    expect(res._status).toBe(201);
    expect(res._json.order).toBeDefined();
    expect(res._json.waLink).toContain('wa.me');
  });

  test('returns 422 for invalid customer info', async () => {
    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('POST', {}, {
      customerInfo: { custName: '', custPhone: 'invalid', custLocUrl: '' },
      items: [{ serviceId: 'ac_cleaning', acCapacity: '1_pk', unitCount: 1 }],
    });
    await handler(req, res);
    expect(res._status).toBe(422);
  });

  test('returns 422 for invalid order items', async () => {
    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('POST', {}, {
      customerInfo: {
        custName: 'John Doe',
        custPhone: '08123456789',
        custLocUrl: 'https://maps.example.com/loc',
      },
      items: [{ serviceId: '', acCapacity: 'invalid', unitCount: 0 }],
    });
    await handler(req, res);
    expect(res._status).toBe(422);
  });

  test('returns 422 when daily quota is full', async () => {
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const existingOrders = [{ id: 1, status: 'Pending', order_items: [{ unit_count: 20 }] }];
    supabaseAdmin.from.mockReturnValue(makeChain({ data: existingOrders, error: null }));

    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('POST', {}, {
      customerInfo: {
        custName: 'John Doe',
        custPhone: '08123456789',
        custLocUrl: 'https://maps.example.com/loc',
      },
      items: [{ serviceId: 'ac_cleaning', acCapacity: '1_pk', unitCount: 1 }],
    });
    await handler(req, res);
    expect(res._status).toBe(422);
    expect(res._json.error).toContain('Kuota');
  });

  test('returns 422 when no body provided', async () => {
    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('POST', {}, null);
    await handler(req, res);
    expect(res._status).toBe(422);
  });

  test('Property 18: Item Order Tidak Dapat Diubah Setelah Tersimpan', async () => {
    authenticateUser.mockResolvedValue({
      user: { id: 'admin-1', role: 'admin' },
      error: null,
    });

    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const order = { id: 1, status: 'Pending', team_id: null, order_items: [] };
    supabaseAdmin.from.mockReturnValue(makeChain({ data: order, error: null }));

    const handler = require('../../pages/api/orders/[id]').default;
    const { req, res } = createMockReqRes(
      'PATCH',
      { id: '1' },
      { action: 'update_status', order_items: [{ service_id: 'new_service' }], status: 'Proses' }
    );
    await handler(req, res);
    expect(res._status).toBe(400);
    expect(res._json.error).toBe('IMMUTABLE_ITEM');
  });
});

describe('API Route: GET /api/orders', () => {
  test('returns 401 without auth', async () => {
    authenticateUser.mockResolvedValue({ user: null, error: 'Unauthorized' });
    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);
    expect(res._status).toBe(401);
  });

  test('returns all orders for admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({ data: [{ id: 1 }, { id: 2 }], error: null }));

    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._json).toHaveLength(2);
  });

  test('Property 16: Teknisi hanya melihat order milik timnya', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'teknisi-1', role: 'teknisi' }, error: null });
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({ data: [{ id: 1, team_id: 'teknisi-1' }], error: null }));

    const handler = require('../../pages/api/orders/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);
    expect(res._status).toBe(200);
    expect(res._json).toHaveLength(1);
  });
});

describe('API Route: PATCH /api/orders/[id]', () => {
  test('returns 401 without auth', async () => {
    authenticateUser.mockResolvedValue({ user: null, error: 'Unauthorized' });
    const handler = require('../../pages/api/orders/[id]').default;
    const { req, res } = createMockReqRes('PATCH', { id: '1' }, { action: 'update_status', status: 'Proses' });
    await handler(req, res);
    expect(res._status).toBe(401);
  });

  test('Property 26: RBAC applies — admin can update status', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const order = { id: 1, status: 'Pending', team_id: 'team-1', order_items: [{ unit_count: 2 }] };
    supabaseAdmin.from.mockReturnValue(makeChain({ data: order, error: null }));

    const handler = require('../../pages/api/orders/[id]').default;
    const { req, res } = createMockReqRes(
      'PATCH',
      { id: '1' },
      { action: 'update_status', status: 'Proses' }
    );
    await handler(req, res);
    expect(res._status).toBe(200);
  });

  test('Property 16: Teknisi tidak bisa mengupdate order milik tim lain', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'teknisi-1', role: 'teknisi' }, error: null });
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const order = { id: 1, status: 'Proses', team_id: 'teknisi-2', order_items: [] };
    supabaseAdmin.from.mockReturnValue(makeChain({ data: order, error: null }));

    const handler = require('../../pages/api/orders/[id]').default;
    const { req, res } = createMockReqRes(
      'PATCH',
      { id: '1' },
      { action: 'update_status', status: 'Selesai' }
    );
    await handler(req, res);
    expect(res._status).toBe(403);
  });

  test('Property 26: RBAC applies — teknisi cannot assign team', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'teknisi-1', role: 'teknisi' }, error: null });
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    const order = { id: 1, status: 'Pending', team_id: 'teknisi-1', order_items: [] };
    supabaseAdmin.from.mockReturnValue(makeChain({ data: order, error: null }));

    const handler = require('../../pages/api/orders/[id]').default;
    const { req, res } = createMockReqRes(
      'PATCH',
      { id: '1' },
      { action: 'assign_team', team_id: 'teknisi-2' }
    );
    await handler(req, res);
    expect(res._status).toBe(403);
  });
});
