jest.mock('../../lib/supabaseAdmin', () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
      admin: {
        createUser: jest.fn(),
        updateUserById: jest.fn(),
        deleteUser: jest.fn(),
        listUsers: jest.fn(),
      },
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
});

describe('GET /api/services', () => {
  test('returns all services (public)', async () => {
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({
      data: [{ id: 1, name: 'AC Cleaning' }, { id: 2, name: 'Freon Refill' }],
      error: null,
    }));

    const handler = require('../../pages/api/services/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json).toHaveLength(2);
  });

  test('returns empty array when no services', async () => {
    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({ data: [], error: null }));

    const handler = require('../../pages/api/services/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json).toEqual([]);
  });
});

describe('POST /api/services', () => {
  test('returns 401 without auth', async () => {
    authenticateUser.mockResolvedValue({ user: null, error: 'Unauthorized' });

    const handler = require('../../pages/api/services/index').default;
    const { req, res } = createMockReqRes('POST', {}, { name: 'New Service' });
    await handler(req, res);

    expect(res._status).toBe(401);
  });

  test('returns 403 for non-admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'teknisi-1', role: 'teknisi' }, error: null });

    const handler = require('../../pages/api/services/index').default;
    const { req, res } = createMockReqRes('POST', {}, { name: 'New Service' });
    await handler(req, res);

    expect(res._status).toBe(403);
  });

  test('creates service as admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({
      data: { id: 1, name: 'New Service', description: null, price: null },
      error: null,
    }));

    const handler = require('../../pages/api/services/index').default;
    const { req, res } = createMockReqRes('POST', {}, { name: 'New Service' });
    await handler(req, res);

    expect(res._status).toBe(201);
    expect(res._json.name).toBe('New Service');
  });

  test('returns 400 if name is empty', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const handler = require('../../pages/api/services/index').default;
    const { req, res } = createMockReqRes('POST', {}, { name: '' });
    await handler(req, res);

    expect(res._status).toBe(400);
  });
});

describe('PATCH /api/services/[id]', () => {
  test('returns 401 without auth', async () => {
    authenticateUser.mockResolvedValue({ user: null, error: 'Unauthorized' });

    const handler = require('../../pages/api/services/[id]').default;
    const { req, res } = createMockReqRes('PATCH', { id: '1' }, { name: 'Updated' });
    await handler(req, res);

    expect(res._status).toBe(401);
  });

  test('updates service as admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({
      data: { id: 1, name: 'Updated Service' },
      error: null,
    }));

    const handler = require('../../pages/api/services/[id]').default;
    const { req, res } = createMockReqRes('PATCH', { id: '1' }, { name: 'Updated Service' });
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json.name).toBe('Updated Service');
  });
});

describe('GET /api/users', () => {
  test('returns 401 without auth', async () => {
    authenticateUser.mockResolvedValue({ user: null, error: 'Unauthorized' });

    const handler = require('../../pages/api/users/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res._status).toBe(401);
  });

  test('returns 403 for non-admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'teknisi-1', role: 'teknisi' }, error: null });

    const handler = require('../../pages/api/users/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res._status).toBe(403);
  });

  test('returns teknisi users for admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.from.mockReturnValue(makeChain({
      data: [{ user_id: 'u1' }],
      error: null,
    }));
    supabaseAdmin.auth.admin.listUsers.mockResolvedValue({
      data: { users: [{ id: 'u1', email: 'teknisi@example.com', user_metadata: { name: 'Teknisi 1' } }] },
      error: null,
    });

    const handler = require('../../pages/api/users/index').default;
    const { req, res } = createMockReqRes('GET');
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json).toHaveLength(1);
  });
});

describe('POST /api/users', () => {
  test('creates user as admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.auth.admin.createUser.mockResolvedValue({
      data: { user: { id: 'new-user-id', email: 'teknisi@example.com' } },
      error: null,
    });

    const handler = require('../../pages/api/users/index').default;
    const { req, res } = createMockReqRes('POST', {}, { email: 'teknisi@example.com', password: 'password123', name: 'New Teknisi' });
    await handler(req, res);

    expect(res._status).toBe(201);
    expect(res._json.user.id).toBe('new-user-id');
  });

  test('returns 400 when email/password missing', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const handler = require('../../pages/api/users/index').default;
    const { req, res } = createMockReqRes('POST', {}, { name: 'No Email' });
    await handler(req, res);

    expect(res._status).toBe(400);
  });
});

describe('PATCH /api/users/[id]', () => {
  test('updates user as admin', async () => {
    authenticateUser.mockResolvedValue({ user: { id: 'admin-1', role: 'admin' }, error: null });

    const { supabaseAdmin } = require('../../lib/supabaseAdmin');
    supabaseAdmin.auth.admin.updateUserById.mockResolvedValue({
      data: { user: { id: 'user-id' } },
      error: null,
    });

    const handler = require('../../pages/api/users/[id]').default;
    const { req, res } = createMockReqRes('PATCH', { id: 'user-id' }, { name: 'Updated Name' });
    await handler(req, res);

    expect(res._status).toBe(200);
    expect(res._json.id).toBe('user-id');
    expect(res._json.name).toBe('Updated Name');
  });
});
