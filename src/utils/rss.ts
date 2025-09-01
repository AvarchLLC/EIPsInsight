import { Feed } from 'feed';
import type { ChangeEvent } from './trackChanges';

interface FeedItem {
  title: string;
  link: string;
  description: string;
  date: Date;
}

interface GenerateFeedParams {
  title: string;
  id: string;
  link: string;
  items: FeedItem[];
}

export function generateRSSFeed({ title, items, id, link }: GenerateFeedParams) {
  const feed = new Feed({
    title,
    id,
    link,
    language: 'en',
    updated: new Date(),
    generator: 'EIPsInsight Feed Generator',
    copyright: `© ${new Date().getFullYear()} EIPsInsight`
  });

  items.forEach((item: FeedItem) => {
    feed.addItem({
      title: item.title,
      id: item.link,
      link: item.link,
      description: item.description,
      date: item.date
    });
  });

  return feed.rss2();
}

// Added export to fix build error in sync.ts
export function buildFeedItemsFromEvents(events: ChangeEvent[], baseLink: string): FeedItem[] {
  return events.map(e => ({
    title:
      e.kind === 'status' && e.statusFrom && e.statusTo
        ? `Status: ${e.statusFrom} → ${e.statusTo}`
        : e.summary,
    link: e.url,
    description: e.message || e.summary,
    date: new Date(e.date)
  }));
}
