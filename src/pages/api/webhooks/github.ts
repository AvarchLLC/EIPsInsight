import { NextRequest, NextResponse } from 'next/server';
import { syncEipChanges } from '@/utils/sync';

export async function POST(req: NextRequest) {
  const event = req.headers.get('x-github-event');
  if (event === 'push') {
    await syncEipChanges();
    return NextResponse.json({ message: 'Sync triggered' });
  }
  return NextResponse.json({ message: 'Ignored' });
}