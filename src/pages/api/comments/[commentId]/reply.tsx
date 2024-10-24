import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI as string; // Make sure this is set in your .env.local file

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { commentId } = req.query;
    const { content } = req.body;

    if (!ObjectId.isValid(commentId as string)) {
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const database = client.db('test');
      const comments = database.collection('comments');
      console.log("triggered the reply api")
      const result = await comments.updateOne(
        { _id: new ObjectId(commentId as string) },
        { $push: { subComments: { content, createdAt: new Date() } } }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ _id: 1 , message: 'Reply added successfully' });
      } else {
        res.status(404).json({ message: 'Comment not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error posting reply' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
