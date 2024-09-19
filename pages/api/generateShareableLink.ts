import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { connectToDatabase } from '@/utils/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { db } = await connectToDatabase();
    const shareableId = uuidv4();

    await db.collection('shareableLinks').insertOne({
      userId: session.user.sub,
      shareableId,
      createdAt: new Date(),
    });

    res.status(200).json({ shareableId });
  } catch (error) {
    console.error('Failed to generate shareable link:', error);
    res.status(500).json({ error: 'Failed to generate shareable link' });
  }
}