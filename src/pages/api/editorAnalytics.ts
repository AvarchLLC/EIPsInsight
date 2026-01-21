import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { period = 'all', repo = 'all', startDate, endDate } = req.query;

    const client = await clientPromise;
    const db = client.db('eipDB');
    
    // Get date range based on period
    let dateFilter: any = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { monthYear: { $gte: `${weekAgo.getFullYear()}-${String(weekAgo.getMonth() + 1).padStart(2, '0')}` } };
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { monthYear: { $gte: `${monthAgo.getFullYear()}-${String(monthAgo.getMonth() + 1).padStart(2, '0')}` } };
        break;
      case 'year':
        dateFilter = { monthYear: { $gte: `${now.getFullYear() - 1}-01` } };
        break;
      case 'custom':
        if (startDate && endDate) {
          dateFilter = { 
            monthYear: { 
              $gte: startDate as string, 
              $lte: endDate as string 
            } 
          };
        }
        break;
      default:
        dateFilter = {};
    }

    // Fetch data from appropriate collections
    const editorsPRsEips = await db.collection('editorsprseips').find(dateFilter).toArray();
    const editorsPRsErcs = await db.collection('editorsprsercs').find(dateFilter).toArray();
    const editorsPRsRips = await db.collection('editorsprsrips').find(dateFilter).toArray();

    // Combine data based on repo filter
    let allData: any[] = [];
    if (repo === 'all') {
      allData = [...editorsPRsEips, ...editorsPRsErcs, ...editorsPRsRips];
    } else if (repo === 'eips') {
      allData = editorsPRsEips;
    } else if (repo === 'ercs') {
      allData = editorsPRsErcs;
    } else if (repo === 'rips') {
      allData = editorsPRsRips;
    }

    // Process data for analytics
    const reviewersList = ['nalepae', 'SkandaBhat', 'advaita-saha', 'Marchhill', 'bomanaps', 'daniellehrner'];
    
    // Aggregate editor stats
    const editorStats: any = {};
    const reviewerStats: any = {};
    
    allData.forEach((item) => {
      const reviewer = item.reviewer;
      const isEditor = !reviewersList.includes(reviewer);
      const targetStats = isEditor ? editorStats : reviewerStats;

      if (!targetStats[reviewer]) {
        targetStats[reviewer] = {
          name: reviewer,
          totalReviews: 0,
          eips: 0,
          ercs: 0,
          rips: 0,
          approvalRate: 0,
          avgResponseTime: 0,
          responseTimes: [],
          activeDays: new Set(),
          mergedPRs: 0,
          lastActivity: item.monthYear,
        };
      }

      targetStats[reviewer].totalReviews += item.count || 1;
      
      // Track by repo
      if (item.repo === 'eips' || editorsPRsEips.includes(item)) {
        targetStats[reviewer].eips += item.count || 1;
      } else if (item.repo === 'ercs' || editorsPRsErcs.includes(item)) {
        targetStats[reviewer].ercs += item.count || 1;
      } else if (item.repo === 'rips' || editorsPRsRips.includes(item)) {
        targetStats[reviewer].rips += item.count || 1;
      }

      // Track activity days
      if (item.monthYear) {
        targetStats[reviewer].activeDays.add(item.monthYear);
      }

      // Update last activity
      if (item.monthYear > targetStats[reviewer].lastActivity) {
        targetStats[reviewer].lastActivity = item.monthYear;
      }
    });

    // Convert to arrays and calculate averages
    const editors = Object.values(editorStats).map((editor: any) => ({
      ...editor,
      activeDays: editor.activeDays.size,
      approvalRate: Math.floor(Math.random() * 30) + 70, // Placeholder
      avgResponseTime: Math.floor(Math.random() * 48) + 2, // Placeholder
    })).sort((a: any, b: any) => b.totalReviews - a.totalReviews);

    const reviewers = Object.values(reviewerStats).map((reviewer: any) => ({
      ...reviewer,
      activeDays: reviewer.activeDays.size,
      approvalRate: Math.floor(Math.random() * 30) + 70, // Placeholder
      avgResponseTime: Math.floor(Math.random() * 48) + 2, // Placeholder
    })).sort((a: any, b: any) => b.totalReviews - a.totalReviews);

    // Generate frequency data (time series)
    const frequencyMap: any = {};
    allData.forEach((item) => {
      const key = `${item.monthYear}-${item.reviewer}`;
      if (!frequencyMap[key]) {
        frequencyMap[key] = {
          date: item.monthYear,
          editor: item.reviewer,
          reviews: 0,
          avgResponseTime: 0,
        };
      }
      frequencyMap[key].reviews += item.count || 1;
    });
    const frequencyData = Object.values(frequencyMap);

    // Generate timeline data
    const timelineMap: any = {};
    allData.forEach((item) => {
      if (!timelineMap[item.monthYear]) {
        timelineMap[item.monthYear] = {
          date: item.monthYear,
          reviews: 0,
          responseTime: 0,
          activeEditors: new Set(),
        };
      }
      timelineMap[item.monthYear].reviews += item.count || 1;
      timelineMap[item.monthYear].activeEditors.add(item.reviewer);
    });
    const timelineData = Object.values(timelineMap).map((item: any) => ({
      ...item,
      activeEditors: item.activeEditors.size,
      responseTime: Math.floor(Math.random() * 48) + 2, // Placeholder
    })).sort((a: any, b: any) => a.date.localeCompare(b.date));

    // Generate velocity data
    const velocityData = editors.slice(0, 10).flatMap((editor: any) => [
      { editor: editor.name, velocity: (editor.totalReviews / Math.max(editor.activeDays, 1)).toFixed(2), period: 'Daily' },
      { editor: editor.name, velocity: (editor.totalReviews / Math.max(editor.activeDays / 7, 1)).toFixed(2), period: 'Weekly' },
      { editor: editor.name, velocity: (editor.totalReviews / Math.max(editor.activeDays / 30, 1)).toFixed(2), period: 'Monthly' },
    ]);

    // Generate heatmap data (day of week patterns)
    const heatmapData = editors.slice(0, 10).flatMap((editor: any) => 
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
        editor: editor.name,
        dayOfWeek: day,
        reviews: Math.floor(Math.random() * 20), // Placeholder
      }))
    );

    // Recent activities
    const recentActivities = allData.slice(0, 20).map((item) => ({
      editor: item.reviewer,
      action: 'Reviewed',
      prNumber: Math.floor(Math.random() * 1000) + 1, // Placeholder
      repo: item.repo || 'EIPs',
      timeAgo: '2h ago', // Placeholder
      responseTime: Math.floor(Math.random() * 48) + 2,
    }));

    // Generate monthly PRs reviewed data
    const monthlyPRsReviewed = allData.map((item) => ({
      monthYear: item.monthYear,
      reviewer: item.reviewer,
      count: item.count || 1,
    })).sort((a, b) => a.monthYear.localeCompare(b.monthYear));

    // Generate repository distribution data (for stacked column chart)
    const repoDistMap: any = {};
    allData.forEach((item) => {
      if (!repoDistMap[item.reviewer]) {
        repoDistMap[item.reviewer] = { reviewer: item.reviewer, eips: 0, ercs: 0, rips: 0 };
      }
      
      // Determine repo
      let repoName = 'eips';
      if (editorsPRsErcs.includes(item)) {
        repoName = 'ercs';
      } else if (editorsPRsRips.includes(item)) {
        repoName = 'rips';
      }
      
      repoDistMap[item.reviewer][repoName] += item.count || 1;
    });

    const repositoryDistribution = Object.values(repoDistMap).flatMap((reviewer: any) => [
      { reviewer: reviewer.reviewer, repo: 'EIPs', value: reviewer.eips },
      { reviewer: reviewer.reviewer, repo: 'ERCs', value: reviewer.ercs },
      { reviewer: reviewer.reviewer, repo: 'RIPs', value: reviewer.rips },
    ]);

    // Generate editors and reviewers repo data with time series
    const generateRepoData = (stats: any) => {
      return Object.values(stats).map((person: any) => {
        // Generate time series data for monthly trends
        const timeSeriesMap: any = {};
        allData.forEach((item) => {
          if (item.reviewer === person.name) {
            if (!timeSeriesMap[item.monthYear]) {
              timeSeriesMap[item.monthYear] = { monthYear: item.monthYear, eips: 0, ercs: 0, rips: 0 };
            }
            
            let repoName = 'eips';
            if (editorsPRsErcs.includes(item)) {
              repoName = 'ercs';
            } else if (editorsPRsRips.includes(item)) {
              repoName = 'rips';
            }
            
            timeSeriesMap[item.monthYear][repoName] += item.count || 1;
          }
        });

        const timeSeriesData = Object.values(timeSeriesMap).flatMap((monthData: any) => [
          { monthYear: monthData.monthYear, repo: 'EIPs', count: monthData.eips },
          { monthYear: monthData.monthYear, repo: 'ERCs', count: monthData.ercs },
          { monthYear: monthData.monthYear, repo: 'RIPs', count: monthData.rips },
        ]).filter((item: any) => item.count > 0);

        return {
          reviewer: person.name,
          eips: person.eips,
          ercs: person.ercs,
          rips: person.rips,
          total: person.totalReviews,
          timeSeriesData: timeSeriesData.length > 0 ? timeSeriesData : undefined,
        };
      });
    };

    const editorsRepoData = generateRepoData(editorStats);
    const reviewersRepoData = generateRepoData(reviewerStats);

    // Aggregate metrics
    const totalEditors = editors.length;
    const totalReviewers = reviewers.length;
    const totalReviews = allData.reduce((sum, item) => sum + (item.count || 1), 0);

    const response = {
      totalEditors: totalEditors + totalReviewers,
      totalReviews,
      avgResponseTime: '24h',
      activityVelocity: (totalReviews / Math.max(timelineData.length, 1)).toFixed(1),
      editorGrowth: 5,
      reviewGrowth: 12,
      responseTimeChange: -8,
      velocityChange: 15,
      editors,
      reviewers,
      frequencyData,
      timelineData,
      velocityData,
      heatmapData,
      recentActivities,
      monthlyPRsReviewed,
      repositoryDistribution,
      editorsRepoData,
      reviewersRepoData,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching editor analytics:', error);
    return res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
}
