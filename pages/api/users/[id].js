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
    return res.status(403).json({ error: 'Hanya admin yang dapat mengubah pengguna' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'ID pengguna diperlukan' });
  }

  const { name, phone, role, email } = req.body;
  const updates = {};

  if (name !== undefined) updates.name = name;
  if (phone !== undefined) updates.phone = phone;
  if (role !== undefined) updates.role = role;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Tidak ada field yang diupdate' });
  }

  if (email) {
    const { error: emailError } = await supabaseAdmin.auth.admin.updateUserById(id, { email });
    if (emailError) {
      return res.status(500).json({ error: 'Gagal memperbarui email' });
    }
  }

  const { data: detail, error } = await supabaseAdmin
    .from('user_details')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !detail) {
    return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
  }

  return res.status(200).json(detail);
}
