import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import WatchedMovie from '@/models/WatchedMovie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { shareableId } = req.query;

  try {
    await dbConnect();
    const user = await User.findOne({ shareableId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const watchedMovies = await WatchedMovie.find({ userId: user._id });
    res.status(200).json({ username: user.username, watchedMovies });
  } catch (error) {
    console.error('Error fetching shared watched list:', error);
    res.status(500).json({ error: 'Failed to fetch shared watched list' });
  }
}