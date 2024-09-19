import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { username } = req.body;

  try {
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { auth0Id: session.user.sub },
      { username },
      { new: true, upsert: true }
    );
    res.status(200).json({ username: user.username });
  } catch (error: unknown) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to update username' });
  }
}