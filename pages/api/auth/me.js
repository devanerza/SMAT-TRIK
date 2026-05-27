import { authenticateUser } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, error } = await authenticateUser(req);

  if (error) {
    return res.status(401).json({ error });
  }

  return res.status(200).json({ user });
}
