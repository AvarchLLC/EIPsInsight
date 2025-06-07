import { Feed } from 'feed';

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
