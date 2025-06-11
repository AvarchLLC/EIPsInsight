import { RssIcon } from 'lucide-react';
import Link from 'next/link';

interface FeedIconProps {
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
  filter: 'all' | 'status';
}

export function FeedIcon({ type, id, filter }: FeedIconProps) {
  return (
    <Link
      href={`/api/feeds/${type}/${id}/${filter}`}
      target="_blank"
      className="flex items-center space-x-2 text-orange-500 hover:text-orange-600"
    >
      <RssIcon className="w-4 h-4" />
      <span className="text-sm">RSS</span>
    </Link>
  );
}
