'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type TopicItem = {
  number: string;
  category: 'EIP' | 'ERC' | 'RIP';
  title: string;
  slug: string;
  post_id: number;
  link: string;
};

export default function TrendingEips(): JSX.Element {
  const [items, setItems] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await axios.get('/api/magicians'); // proxy to avoid CORS
        const data = response.data;
        const topics = data.topic_list?.topics || [];

        const results: TopicItem[] = [];

        for (const topic of topics) {
          const match = topic.title.match(/^(eip|erc|rip)-(\d+):\s+(.*)$/i);
          if (match) {
            const category = match[1].toUpperCase() as TopicItem['category'];
            const number = match[2];
            const cleanTitle = match[3].trim();
            const slug = topic.slug;
            const post_id = topic.id;

            // Construct raw GitHub URL
            const rawURL = `https://raw.githubusercontent.com/ethereum/${category === 'EIP' ? 'EIPs' : category === 'ERC' ? 'ERCs' : 'RIPs'}/master/${category}S/${category.toLowerCase()}-${number}.md`;

            let link = '';
            try {
              const headResponse = await axios.head(rawURL);
              if (headResponse.status === 200) {
                link = `https://eipsinsight.com/${category.toLowerCase()}s/${category.toLowerCase()}-${number}`;
              } else {
                throw new Error('Not found');
              }
            } catch {
              link = `https://ethereum-magicians.org/t/${slug}/${post_id}`;
            }

            results.push({
              number,
              category,
              title: cleanTitle,
              slug,
              post_id,
              link
            });
          }
        }

        setItems(results);
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  if (loading) return <p>Loading topics...</p>;

  if (items.length === 0) return <p>No matching topics found.</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Ethereum Magicians Topics</h2>
      <ul>
        {items.map(({ number, category, title, link }) => (
          <li key={`${category}-${number}`} style={{ marginBottom: '0.5rem' }}>
            <strong>{category}-{number}</strong>:&nbsp;
            <a href={link} target="_blank" rel="noopener noreferrer">{title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
