import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { username } = req.query;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Username is required', code: 'INVALID_PARAMS' },
      });
    }

    const client = await clientPromise;
    const db = client.db('eipsinsight');
    
    // First verify contributor exists
    const contributor = await db.collection('contributors').findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') },
    });

    if (!contributor) {
      return res.status(404).json({
        success: false,
        error: { message: 'Contributor not found', code: 'NOT_FOUND' },
      });
    }

    // Aggregate statistics from activities collection
    const activitiesCollection = db.collection('activities');
    
    const stats = await activitiesCollection.aggregate([
      {
        $match: {
          username: { $regex: new RegExp(`^${username}$`, 'i') },
        },
      },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          byRepository: {
            $push: {
              repository: '$repository',
              activityType: '$activityType',
            },
          },
          byActivityType: {
            $push: '$activityType',
          },
          firstActivity: { $min: '$timestamp' },
          lastActivity: { $max: '$timestamp' },
        },
      },
    ]).toArray();

    const statData = stats[0] || {
      totalActivities: 0,
      byRepository: [],
      byActivityType: [],
      firstActivity: null,
      lastActivity: null,
    };

    // Calculate by repository
    const byRepository: any = {};
    if (contributor.repositoryStats) {
      contributor.repositoryStats.forEach((repoStat: any) => {
        byRepository[repoStat.repository] = {
          score: repoStat.score || 0,
          commits: repoStat.commits || 0,
          pullRequests: repoStat.pullRequests || 0,
          reviews: repoStat.reviews || 0,
          comments: repoStat.comments || 0,
        };
      });
    }

    // Calculate by activity type
    const byActivityType: any = {};
    statData.byActivityType.forEach((type: string) => {
      byActivityType[type] = (byActivityType[type] || 0) + 1;
    });

    // Calculate active days (approximate)
    const activeDays = statData.firstActivity && statData.lastActivity
      ? Math.ceil(
          (new Date(statData.lastActivity).getTime() -
            new Date(statData.firstActivity).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        overall: {
          totalScore: contributor.totalScore || 0,
          totalActivities: contributor.totalActivities || 0,
          commits: contributor.repositoryStats?.reduce((sum: number, s: any) => sum + (s.commits || 0), 0) || 0,
          pullRequests: contributor.repositoryStats?.reduce((sum: number, s: any) => sum + (s.pullRequests || 0), 0) || 0,
          reviews: contributor.repositoryStats?.reduce((sum: number, s: any) => sum + (s.reviews || 0), 0) || 0,
          comments: contributor.repositoryStats?.reduce((sum: number, s: any) => sum + (s.comments || 0), 0) || 0,
        },
        byRepository,
        byActivityType,
        timeline: {
          firstActivity: statData.firstActivity || contributor.firstActivityAt,
          lastActivity: statData.lastActivity || contributor.lastActivityAt,
          activeDays,
        },
      },
    });
  } catch (error: any) {
    console.error('Contributor stats API error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error.message || 'Failed to fetch contributor stats',
        code: 'INTERNAL_ERROR',
      },
    });
  }
}
