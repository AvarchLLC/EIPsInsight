'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

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
  const router = useRouter();

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
      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map(({ number, category, title, link }) => {
          const isInternal = link.includes('eipsinsight.com');
          const internalPath = `/${category.toLowerCase()}s/${category.toLowerCase()}-${number}`;

          const cardStyles: React.CSSProperties = {
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
            background: isInternal ? '#f9f9f9' : '#fff',
            transition: 'box-shadow 0.2s',
            cursor: 'pointer'
          };

          const handleClick = () => {
            if (isInternal) {
              router.push(internalPath); // client-side route
            }
          };

          const cardContent = (
            <div
              style={cardStyles}
              onClick={isInternal ? handleClick : undefined}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <strong>{category}-{number}</strong>: {title}
            </div>
          );

          // If internal, wrap with div; if external, wrap with <a>
          return isInternal ? (
            <div key={`${category}-${number}`}>{cardContent}</div>
          ) : (
            <a
              key={`${category}-${number}`}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {cardContent}
            </a>
          );
        })}
      </div>
    </div>
  );
}
