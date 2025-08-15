import { getChangeLog } from './trackChanges';
import type { ChangeEvent } from './trackChanges';

export interface FeedItem {
  title: string;
  link: string;
  description: string;
  date: Date;
}

export interface FeedData {
  title: string;
  items: FeedItem[];
}

/**
 * Build feed data for a given proposal.
 * filter: 'all' | 'status'
 */
export async function getFeedDataFor(
  type: 'eips' | 'ercs' | 'rips',
  id: string | number,
  filter: 'all' | 'status' = 'all'
): Promise<FeedData> {
  const { events } = await getChangeLog(type, id);

  const filteredEvents: ChangeEvent[] =
    filter === 'status'
      ? events.filter(e => e.kind === 'status')
      : events;

  const baseLink =
    type === 'rips'
      ? `https://github.com/ethereum-cat-herders/RIPs/blob/master/RIPS/rip-${id}.md`
      : type === 'ercs'
      ? `https://eips.ethereum.org/ERCS/erc-${id}`
      : `https://eips.ethereum.org/EIPS/eip-${id}`;

  return {
    title: `${type.toUpperCase()}-${id} (${filter}) Updates`,
    items: filteredEvents.map(ev => ({
      title:
        ev.kind === 'status' && ev.statusFrom && ev.statusTo
          ? `Status: ${ev.statusFrom} → ${ev.statusTo}`
          : ev.summary,
      link: ev.url || baseLink,
      description: ev.message || ev.summary,
      date: new Date(ev.date)
    }))
  };
}