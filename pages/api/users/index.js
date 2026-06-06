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

  const { data: teknisiDetails, error: detailsError } = await supabaseAdmin
    .from('user_details')
    .select('user_id')
    .eq('role', 'teknisi');

  if (detailsError) {
    return res.status(500).json({ error: 'Gagal mengambil detail teknisi' });
  }

  const teknisiIds = new Set(teknisiDetails?.map(d => d.user_id) || []);

  const { data: { users: authUsers }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) {
    return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }

  const teknisiUsers = authUsers
    .filter(au => teknisiIds.has(au.id))
    .map(au => ({
      id: au.id,
      email: au.email,
      name: au.user_metadata?.name || '',
      phone: au.user_metadata?.phone || '',
    }));

  return res.status(200).json(teknisiUsers);
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
    user_metadata: { name: name || '', phone: phone || '' },
  });

  if (signUpError) {
    return res.status(500).json({ error: 'Gagal membuat akun pengguna' });
  }
  
  return res.status(201).json(authUser);
}
