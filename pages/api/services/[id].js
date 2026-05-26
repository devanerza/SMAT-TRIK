import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat mengubah layanan' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID layanan diperlukan' });
  }

  const { name, description, price } = req.body;
  const updates = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (price !== undefined) updates.price = price;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Tidak ada field yang diupdate' });
  }

  const { data: service, error } = await supabaseAdmin
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !service) {
    return res.status(404).json({ error: 'Layanan tidak ditemukan' });
  }

  return res.status(200).json(service);
}
