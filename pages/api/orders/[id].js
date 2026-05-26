import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { authenticateUser } from '../../../lib/auth';
import {
  validateAdminStatusTransition,
  validateTechnicianStatusTransition,
  validateConfirmationRequirement,
  validateAssignTeam,
} from '../../../lib/statusTransitions';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  if (req.method === 'GET') {
    return handleGetOrder(req, res, id);
  }
  if (req.method === 'PATCH') {
    return handlePatchOrder(req, res, id);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

async function handleGetOrder(req, res, id) {
  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error || !order) {
    return res.status(404).json({ error: 'Order tidak ditemukan' });
  }

  if (user.role !== 'admin' && order.team_id !== user.id) {
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  return res.status(200).json(order);
}

async function handlePatchOrder(req, res, id) {
  const { user, error: authError } = await authenticateUser(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (fetchError || !order) {
    return res.status(404).json({ error: 'Order tidak ditemukan' });
  }

  if (user.role !== 'admin' && order.team_id !== user.id) {
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  const { action, ...updates } = req.body;

  if (updates.order_items !== undefined) {
    return res.status(400).json({
      error: 'IMMUTABLE_ITEM',
      message: 'Item order tidak dapat diubah setelah tersimpan',
    });
  }

  if (action === 'update_status') {
    return handleUpdateStatus(req, res, order, user);
  }
  if (action === 'assign_team') {
    return handleAssignTeam(req, res, order, user);
  }

  return res.status(400).json({ error: 'Aksi tidak dikenal' });
}

async function handleUpdateStatus(req, res, order, user) {
  const { status: newStatus } = req.body;
  if (!newStatus) {
    return res.status(400).json({ error: 'Status baru diperlukan' });
  }

  let isValid = false;
  if (user.role === 'admin') {
    if (newStatus === 'Proses' || newStatus === 'Batal') {
      isValid = validateAdminStatusTransition(order.status, newStatus);
    }
  } else {
    isValid = validateTechnicianStatusTransition(order.status, newStatus);
  }

  if (!isValid) {
    return res.status(422).json({ error: 'Transisi status tidak diizinkan' });
  }

  if (newStatus === 'Proses' && !validateConfirmationRequirement(order)) {
    return res.status(422).json({
      error: 'Order harus memiliki tim yang ditugaskan sebelum dikonfirmasi',
    });
  }

  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', order.id);

  if (updateError) {
    return res.status(500).json({ error: 'Gagal memperbarui status' });
  }

  const { data: updatedOrder } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', order.id)
    .single();

  return res.status(200).json(updatedOrder);
}

async function handleAssignTeam(req, res, order, user) {
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Hanya admin yang dapat menetapkan tim' });
  }

  if (!validateAssignTeam(order)) {
    return res.status(422).json({
      error: 'Assign tim hanya diizinkan pada status Pending atau Proses',
    });
  }

  const { team_id } = req.body;
  if (!team_id) {
    return res.status(400).json({ error: 'ID tim diperlukan' });
  }

  const { error: updateError } = await supabaseAdmin
    .from('orders')
    .update({ team_id })
    .eq('id', order.id);

  if (updateError) {
    return res.status(500).json({ error: 'Gagal menetapkan tim' });
  }

  const { data: updatedOrder } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', order.id)
    .single();

  return res.status(200).json(updatedOrder);
}
