import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { authenticateUser } from '../../../lib/auth';
import { validateCustomerInfo, validateOrderItem } from '../../../lib/validators';
import { calculateDailyUsedUnits, checkQuotaAvailability } from '../../../lib/quotaChecker';
import { buildWaLink } from '../../../lib/waLink';

const MAX_UNITS = 20;
const ADMIN_PHONE = process.env.ADMIN_PHONE || '';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetOrders(req, res);
  }
  if (req.method === 'POST') {
    return handleCreateOrder(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleGetOrders(req, res) {
  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  let query = supabaseAdmin.from('orders').select('*, order_items(*)');

  if (user.role !== 'admin') {
    query = query.eq('team_id', user.id);
  }

  const { status, startDate, endDate } = req.query;
  if (status) {
    query = query.in('status', Array.isArray(status) ? status : [status]);
  }
  if (startDate) {
    query = query.gte('created_at', `${startDate}T00:00:00.000Z`);
  }
  if (endDate) {
    query = query.lte('created_at', `${endDate}T23:59:59.999Z`);
  }

  const { data: orders, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch orders' });
  }

  return res.status(200).json(orders || []);
}

async function handleCreateOrder(req, res) {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  const { customerInfo, items } = body;

  const customerValidation = validateCustomerInfo(customerInfo);
  if (!customerValidation.isValid) {
    return res.status(422).json({
      error: 'Validasi gagal',
      details: customerValidation.errors,
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Minimal satu item diperlukan' });
  }

  const itemErrors = [];
  items.forEach((item, idx) => {
    const result = validateOrderItem(item);
    if (!result.isValid) {
      itemErrors.push({ index: idx, errors: result.errors });
    }
  });
  if (itemErrors.length > 0) {
    return res.status(422).json({
      error: 'Item tidak valid',
      details: itemErrors,
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;

  const { data: existingOrders, error: queryError } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay);

  if (queryError) {
    return res.status(500).json({ error: 'Gagal memeriksa kuota' });
  }

  const usedUnits = calculateDailyUsedUnits(existingOrders || []);
  const newOrderUnits = items.reduce((sum, item) => sum + (item.unitCount || 0), 0);
  const { allowed, remainingUnits } = checkQuotaAvailability(usedUnits, newOrderUnits);

  if (!allowed) {
    return res.status(422).json({ error: 'Kuota harian penuh' });
  }

  const { data: newOrder, error: insertError } = await supabaseAdmin
    .from('orders')
    .insert({
      cust_name: customerInfo.custName,
      cust_phone: customerInfo.custPhone,
      cust_email: customerInfo.custEmail || null,
      cust_loc_url: customerInfo.custLocUrl,
      status: 'Pending',
      team_id: null,
    })
    .select()
    .single();

  if (insertError) {
    return res.status(500).json({ error: 'Gagal membuat order' });
  }

  const orderItems = items.map(item => ({
    order_id: newOrder.id,
    service_id: item.serviceId,
    ac_capacity: item.acCapacity,
    unit_count: item.unitCount,
  }));

  const { error: itemsInsertError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (itemsInsertError) {
    await supabaseAdmin.from('orders').delete().eq('id', newOrder.id);
    return res.status(500).json({ error: 'Gagal menyimpan item order' });
  }

  const waLink = buildWaLink(
    {
      custName: customerInfo.custName,
      custPhone: customerInfo.custPhone,
      custLocUrl: customerInfo.custLocUrl,
    },
    items,
    remainingUnits,
    ADMIN_PHONE
  );

  return res.status(201).json({
    order: newOrder,
    waLink,
  });
}
