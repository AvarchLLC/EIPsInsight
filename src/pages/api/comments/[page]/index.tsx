import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

const uri = process.env.MONGODB_URI as string; // Ensure this is set in your environment variables

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = new MongoClient(uri);
  const { page } = req.query; // Extract the page parameter from the URL

  if (!page || typeof page !== 'string') {
    res.status(400).json({ message: 'page is required' });
    return;
  }

  if (req.method === 'GET') {
    // Fetch comments for the specified page
    try {
      await client.connect();
      const database = client.db('test');
      const comments = database.collection('comments');
      const allComments = await comments.find({ page }).toArray();
      res.status(200).json(allComments);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching comments' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'POST' && !req.query.commentId) {
    // Add a new comment to the specified page
    const { content, author, profileLink, profileImage} = req.body;
    try {
      await client.connect();
      const database = client.db('test');
      const comments = database.collection('comments');

      const newComment = {
        content,
        author,
        profileLink,
        profileImage,
        page, // Add the page to the new comment
        createdAt: new Date(),
        subComments: [],
      };

      const result = await comments.insertOne(newComment);
      res.status(201).json({
        _id: result.insertedId,
        content,
        page,
        createdAt: new Date(),
        subComments: [],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error posting comment' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'POST' && req.query.commentId) {
    // Add a reply to a specific comment in the specified page
    const { commentId } = req.query;
    const { content } = req.body;

    try {
      await client.connect();
      const database = client.db('test');
      const comments = database.collection('comments');

      const result = await comments.updateOne(
        { _id: new ObjectId(commentId as string), page },
        { $push: { subComments: { content, createdAt: new Date() } } }
      );

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Reply added successfully' });
      } else {
        res.status(404).json({ message: 'Comment not found or page mismatch' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error posting reply' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
