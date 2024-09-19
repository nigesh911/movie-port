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
        const posts = await db.collection('posts').find().sort({ timestamp: -1 }).toArray();
        res.status(200).json(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Error fetching posts' });
      }
      break;

    case 'POST':
      try {
        const { content } = req.body;
        const user = await db.collection('users').findOne({ userId: session.user.sub });
        const username = user?.username || session.user.name;
        const newPost = {
          user: username,
          content,
          timestamp: new Date().toISOString(),
        };
        const result = await db.collection('posts').insertOne(newPost);
        res.status(201).json({ ...newPost, _id: result.insertedId });
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Error creating post' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}