import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { connectToDatabase } from '@/utils/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { db } = await connectToDatabase();
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const watchedMovies = await db.collection('watchedMovies').findOne({ userId: session.user.sub });
        res.status(200).json(watchedMovies?.movies || []);
      } catch (error) {
        console.error('Error fetching watched movies:', error);
        res.status(500).json({ error: 'Error fetching watched movies' });
      }
      break;

    case 'POST':
      try {
        const { movies } = req.body;
        await db.collection('watchedMovies').updateOne(
          { userId: session.user.sub },
          { $set: { movies } },
          { upsert: true }
        );
        res.status(200).json({ message: 'Watched movies updated successfully' });
      } catch (error) {
        console.error('Error updating watched movies:', error);
        res.status(500).json({ error: 'Error updating watched movies' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}