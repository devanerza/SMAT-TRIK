import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { calculateDailyUsedUnits, checkQuotaAvailability } from '../../lib/quotaChecker';

const MAX_UNITS = 20;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const date = req.query.date || new Date().toISOString().split('T')[0];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  const startOfDay = `${date}T00:00:00.000Z`;
  const endOfDay = `${date}T23:59:59.999Z`;

  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay);

  if (error) {
    return res.status(500).json({ error: 'Failed to query quota' });
  }

  const usedUnits = calculateDailyUsedUnits(orders || []);
  const { allowed, remainingUnits } = checkQuotaAvailability(usedUnits, 0);

  return res.status(200).json({
    date,
    usedUnits,
    remainingUnits: allowed ? remainingUnits : 0,
    maxUnits: MAX_UNITS,
  });
}
