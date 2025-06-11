import { generateRSSFeed } from '@/utils/rss';
import { getFeedDataFor } from '@/utils/feedData';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: {
    type: 'eips' | 'ercs' | 'rips';
    id: string;
    filter: 'all' | 'status';
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const { type, id, filter } = params;
  const { title, items } = await getFeedDataFor(type, id, filter);

  const xml = generateRSSFeed({
    title,
    id: `${type}-${id}-${filter}`,
    link: `https://eipsinsight.com/${type}/${id}`,
    items
  });

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml'
    }
  });
}
