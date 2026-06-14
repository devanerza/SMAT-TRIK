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

  const { name, phone, email } = req.body;
  if (!name && !phone && !email) {
    return res.status(400).json({ error: 'Tidak ada field yang diupdate' });
  }

  const userUpdates = {};
  if (email) userUpdates.email = email;
  if (name !== undefined || phone !== undefined) {
    userUpdates.user_metadata = {};
    if (name !== undefined) userUpdates.user_metadata.name = name;
    if (phone !== undefined) userUpdates.user_metadata.phone = phone;
  }

  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(id, userUpdates);
  if (updateError) {
    return res.status(500).json({ error: 'Gagal memperbarui pengguna' });
  }

  return res.status(200).json({ id, name, phone, email });
}
