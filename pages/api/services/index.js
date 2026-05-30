import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetServices(req, res);
  }
  if (req.method === 'POST') {
    return handleCreateService(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleGetServices(req, res) {
  const { data: services, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    return res.status(500).json({ error: 'Gagal mengambil daftar layanan' });
  }

  return res.status(200).json(services || []);
}

async function handleCreateService(req, res) {
  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat menambahkan layanan' });
  }

  const { name, price } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Nama layanan wajib diisi' });
  }

  const { data: service, error } = await supabaseAdmin
    .from('services')
    .insert({
      name: name.trim(),
      price: typeof price === 'number' ? price : null,
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Gagal membuat layanan' });
  }

  return res.status(201).json(service);
}
