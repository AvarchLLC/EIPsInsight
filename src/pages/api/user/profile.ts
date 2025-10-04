import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection('users');

    switch (req.method) {
      case 'GET':
        return await handleGetProfile(req, res, usersCollection, session.user.id);
      case 'PUT':
        return await handleUpdateProfile(req, res, usersCollection, session.user.id);
      case 'POST':
        return await handleChangePassword(req, res, usersCollection, session.user.id);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetProfile(req: NextApiRequest, res: NextApiResponse, usersCollection: any, userId: string) {
  try {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

async function handleUpdateProfile(req: NextApiRequest, res: NextApiResponse, usersCollection: any, userId: string) {
  const { profile, settings, ...otherUpdates } = req.body;
  
  try {
    const updates: any = {
      updatedAt: new Date(),
      'profile.lastActive': new Date()
    };
    
    // Update profile fields
    if (profile) {
      Object.keys(profile).forEach(key => {
        if (profile[key] !== undefined) {
          updates[`profile.${key}`] = profile[key];
        }
      });
    }
    
    // Update settings
    if (settings) {
      Object.keys(settings).forEach(key => {
        if (settings[key] !== undefined) {
          updates[`settings.${key}`] = settings[key];
        }
      });
    }
    
    // Update other allowed fields
    const allowedFields = ['name', 'image'];
    allowedFields.forEach(field => {
      if (otherUpdates[field] !== undefined) {
        updates[field] = otherUpdates[field];
      }
    });
    
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updates }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Fetch updated user
    const updatedUser = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );
    
    return res.status(200).json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

async function handleChangePassword(req: NextApiRequest, res: NextApiResponse, usersCollection: any, userId: string) {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required' });
  }
  
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long' });
  }
  
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.password) {
      return res.status(400).json({ error: 'Password change not available for this account type' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          password: hashedNewPassword,
          updatedAt: new Date()
        }
      }
    );
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
}