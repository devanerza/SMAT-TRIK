import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return handleGetUsers(req, res);
  }
  if (req.method === 'POST') {
    return handleCreateUser(req, res);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleGetUsers(req, res) {
  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat melihat daftar pengguna' });
  }

  const { data: users, error } = await supabaseAdmin
    .from('user_details')
    .select('*')
    .eq('role', 'teknisi');

  if (error) {
    return res.status(500).json({ error: 'Gagal mengambil daftar pengguna' });
  }

  return res.status(200).json(users || []);
}

async function handleCreateUser(req, res) {
  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat menambahkan pengguna' });
  }

  const { email, password, name, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }

  const { data: authUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (signUpError) {
    return res.status(500).json({ error: 'Gagal membuat akun pengguna' });
  }

  const { data: detail, error: detailError } = await supabaseAdmin
    .from('user_details')
    .insert({
      id: authUser.user.id,
      name: name || null,
      phone: phone || null,
      role: 'teknisi',
    })
    .select()
    .single();

  if (detailError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return res.status(500).json({ error: 'Gagal menyimpan detail pengguna' });
  }

  return res.status(201).json(detail);
}
