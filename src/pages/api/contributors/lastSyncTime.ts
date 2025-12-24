import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('EIPsInsight');
    
    // Fetch all sync_state documents
    const syncStates = await db
      .collection('sync_state')
      .find({})
      .sort({ lastSyncAt: -1 })
      .toArray();

    if (!syncStates || syncStates.length === 0) {
      return res.status(404).json({ 
        message: 'No sync state found',
        lastSyncAt: null 
      });
    }

    // Find the most recent lastSyncAt across all repositories
    const mostRecentSync = syncStates.reduce((latest, current) => {
      const currentTime = new Date(current.lastSyncAt).getTime();
      const latestTime = new Date(latest.lastSyncAt).getTime();
      return currentTime > latestTime ? current : latest;
    }, syncStates[0]);

    // Calculate total activities processed
    const totalActivities = syncStates.reduce((sum, state) => 
      sum + (state.activitiesProcessed || 0), 0
    );

    return res.status(200).json({
      lastSyncAt: mostRecentSync.lastSyncAt,
      totalActivities,
      repositories: syncStates.map(state => ({
        repository: state.repository,
        lastSyncAt: state.lastSyncAt,
        activitiesProcessed: state.activitiesProcessed,
        status: state.status
      }))
    });
  } catch (error: any) {
    console.error('Error fetching sync state:', error);
    return res.status(500).json({ 
      message: 'Error fetching sync state',
      error: error.message 
    });
  }
}
