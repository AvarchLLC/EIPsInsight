import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection('users');

    switch (req.method) {
      case 'GET':
        return await handleGetUsers(req, res, usersCollection);
      case 'PUT':
        return await handleUpdateUser(req, res, usersCollection);
      case 'DELETE':
        return await handleDeleteUser(req, res, usersCollection);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('User management API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetUsers(req: NextApiRequest, res: NextApiResponse, usersCollection: any) {
  const { page = 1, limit = 10, search = '', role = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  
  const skip = (Number(page) - 1) * Number(limit);
  const query: any = {};
  
  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  
  // Role filter
  if (role && role !== 'all') {
    query.role = role;
  }
  
  // Sort configuration
  const sort: any = {};
  sort[String(sortBy)] = sortOrder === 'desc' ? -1 : 1;
  
  try {
    const [users, totalCount] = await Promise.all([
      usersCollection
        .find(query, { projection: { password: 0 } })
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      usersCollection.countDocuments(query)
    ]);
    
    return res.status(200).json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function handleUpdateUser(req: NextApiRequest, res: NextApiResponse, usersCollection: any) {
  const { userId } = req.query;
  const updates = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { _id, password, createdAt, ...allowedUpdates } = updates;
    
    // Add update timestamp
    allowedUpdates.updatedAt = new Date();
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(String(userId)) },
      { $set: allowedUpdates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Fetch updated user (excluding password)
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(String(userId)) },
      { projection: { password: 0 } }
    );
    
    return res.status(200).json({ 
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

async function handleDeleteUser(req: NextApiRequest, res: NextApiResponse, usersCollection: any) {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  
  try {
    const result = await usersCollection.deleteOne({
      _id: new ObjectId(String(userId))
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({ 
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}