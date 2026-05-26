import { supabaseAdmin } from './supabaseAdmin';

export async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Unauthorized' };
  }

  const token = authHeader.split('Bearer ')[1];
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    return { user: null, error: 'Invalid token' };
  }

  const { data: userDetails } = await supabaseAdmin
    .from('user_details')
    .select('role')
    .eq('id', data.user.id)
    .single();

  return {
    user: {
      ...data.user,
      role: userDetails?.role || 'customer',
    },
    error: null,
  };
}
