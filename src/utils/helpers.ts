import dayjs from 'dayjs';

export const MONTHS = [
  { name: 'Jan', value: '01' },
  { name: 'Feb', value: '02' },
  { name: 'Mar', value: '03' },
  { name: 'Apr', value: '04' },
  { name: 'May', value: '05' },
  { name: 'Jun', value: '06' },
  { name: 'Jul', value: '07' },
  { name: 'Aug', value: '08' },
  { name: 'Sep', value: '09' },
  { name: 'Oct', value: '10' },
  { name: 'Nov', value: '11' },
  { name: 'Dec', value: '12' },
];

export const YEARS = Array.from({ length: 2025 - 2015 + 1 }, (_, i) => (2025 - i).toString());

export const REVIEWERS_LIST = [
  'nalepae',
  'SkandaBhat',
  'advaita-saha',
  'Marchhill',
  'bomanaps',
  'daniellehrner',
];

export const ACTIVE_REVIEWERS = [
  'lightclient',
  'SamWilsn',
  'xinbenlv',
  'g11tech',
  'CarlBeek',
  'nconsigny',
  'yoavw',
  'adietrichs',
];

export const EMERITUS_REVIEWERS = [
  'axic',
  'gcolvin',
  'lightclient',
  'SamWilsn',
  'xinbenlv',
  'g11tech',
  'cdetrio',
  'Pandapip1',
  'Souptacular',
  'wanderer',
  'MicahZoltu',
];

export const TOP_CONTRIBUTOR_COLORS: Record<string, string> = {
  lightclient: '#FF6B6B',
  SamWilsn: '#4ECDC4',
  xinbenlv: '#FFD93D',
  g11tech: '#6C5CE7',
  Pandapip1: '#00D2FF',
  axic: '#FF8C42',
  MicahZoltu: '#A8E6CF',
};

export const API_ENDPOINTS = {
  eips: '/api/editorsprseips',
  ercs: '/api/editorsprsercs',
  rips: '/api/editorsprsrips',
};

export const ACTIVE_ENDPOINTS = {
  eips: '/api/activeeditorsprseips',
  ercs: '/api/activeeditorsprsercs',
  rips: '/api/activeeditorsprsrips',
  all: '/api/activeeditorsprsall',
};

export const generateDistinctColor = (index: number, total: number): string => {
  const hue = (index * (360 / total)) % 360;
  return `hsl(${hue}, 85%, 50%)`;
};

export const generateMonthYearRange = (start: string, end: string): string[] => {
  const range = [];
  let current = dayjs(start);
  const endDate = dayjs(end);

  while (current.isBefore(endDate) || current.isSame(endDate)) {
    range.push(current.format('YYYY-MM'));
    current = current.add(1, 'month');
  }

  return range;
};

export const convertTo24Hour = (time: string): string => {
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i);
  if (!match) return '00:00';
  
  const [, hours, minutes, period] = match;
  let hh = parseInt(hours, 10);
  if (period.toUpperCase() === 'PM' && hh !== 12) hh += 12;
  if (period.toUpperCase() === 'AM' && hh === 12) hh = 0;
  return `${hh.toString().padStart(2, '0')}:${minutes}`;
};

export interface PRData {
  monthYear: string;
  reviewer: string;
  count: number;
}

export interface ReviewData {
  monthYear: string;
  reviewer: string;
  count: number;
  PRs?: any[];
}

export interface PRInfo {
  prNumber: number;
  prTitle: string;
  created_at?: string;
  closed_at?: string;
  merged_at?: string;
  reviewDate: string;
  reviewComment?: string;
  repo: string;
}

export interface ShowReviewerType {
  [key: string]: boolean;
}

export const fetchReviewers = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/ethereum/EIPs/master/config/eip-editors.yml'
    );
    const text = await response.text();

    const matches = text.match(/-\s(\w+)/g);
    const reviewers = matches ? Array.from(new Set(matches.map((m) => m.slice(2)))) : [];
    const additionalReviewers = [
      'nalepae',
      'SkandaBhat',
      'advaita-saha',
      'Marchhill',
      'bomanaps',
      'daniellehrner',
      'CarlBeek',
      'nconsigny',
      'yoavw',
      'adietrichs',
    ];

    return Array.from(new Set([...reviewers, ...additionalReviewers]));
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    return [];
  }
};

export const getYearlyData = (
  data: PRData[],
  showReviewer: ShowReviewerType
): Record<string, number> => {
  const yearlyData: Record<string, number> = data
    ?.filter((item) => {
      const itemYear = parseInt(item.monthYear.split('-')[0], 10);
      return itemYear >= 2015 && itemYear <= 2025;
    })
    ?.reduce((acc, item) => {
      if (showReviewer[item.reviewer]) {
        acc[item.reviewer] = (acc[item.reviewer] || 0) + item.count;
      }
      return acc;
    }, {} as Record<string, number>);

  return Object.entries(yearlyData)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [reviewer, count]) => {
      acc[reviewer] = count;
      return acc;
    }, {} as Record<string, number>);
};

export const formatChartData = (rawData: Record<string, number>) => {
  return Object.entries(rawData).map(([reviewer, count]) => ({
    reviewer,
    count,
  }));
};

export const transformAndGroupData = (data: any[]): ReviewData[] => {
  type GroupedData = {
    [monthYear: string]: {
      [reviewer: string]: ReviewData;
    };
  };

  const groupedData: GroupedData = data?.reduce((acc: GroupedData, item) => {
    const { monthYear, reviewer, count } = item;

    if (!acc[monthYear]) {
      acc[monthYear] = {};
    }

    if (!acc[monthYear][reviewer]) {
      acc[monthYear][reviewer] = { monthYear, reviewer, count: 0 };
    }

    acc[monthYear][reviewer].count += count;

    return acc;
  }, {});

  return Object.entries(groupedData).flatMap(([, reviewers]) => Object.values(reviewers) as ReviewData[]);
};
