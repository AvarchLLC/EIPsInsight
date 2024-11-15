import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI as string; // Ensure this is set in your .env.local file

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { CommentId, page } = req.query; // Extract the CommentId and page parameters
    const { content } = req.body;

    console.log(CommentId);
    console.log(page);
    console.log(content);
  if (req.method === 'POST') {

    if (!page || typeof page !== 'string') {
      res.status(400).json({ message: 'Page parameter is required' });
      return;
    }

    if (!ObjectId.isValid(CommentId as string)) {
      res.status(400).json({ message: 'Invalid comment ID' });
      return;
    }

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db('test');
      const comments = database.collection('comments');
      
      console.log("Triggered the reply API");

      const result = await comments.updateOne(
        { _id: new ObjectId(CommentId as string), page: page }, // Filter by category (page)
        { $push: { subComments: { content, createdAt: new Date() } } }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Reply added successfully' });
      } else {
        res.status(404).json({ message: 'Comment not found or category mismatch' });
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

export default handler;