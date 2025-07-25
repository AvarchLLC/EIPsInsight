'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Flex, Text, useColorModeValue, } from '@chakra-ui/react';
import { InfiniteMovingCards } from './InfiniteMovingCards';
import { slideInFromLeft, slideInFromRight } from "@/lib/utils";
import { motion } from 'framer-motion';
import CopyLink from './CopyLink';
import Header from './Header';

export function Clients() {
    const [items, setItems] = useState<
        { quote: string; name: string; title: string; avatar: string; link?: string }[]
    >([]);



    useEffect(() => {
        async function fetchTopics() {
            try {
                const response = await axios.get('/api/magicians');
                const topics = response.data?.topic_list?.topics || [];
                const users = response.data?.users || []; // ← get the user list

                const results = await Promise.all(
                    topics.map(async (topic: any) => {
                        const match = topic.title.match(/^(eip|erc|rip)-(\d+):\s+(.*)$/i);
                        if (match) {
                            const category = match[1].toUpperCase();
                            const number = match[2];
                            const title = match[3].trim();
                            const slug = topic.slug;
                            const post_id = topic.id;

                            // find the poster (first poster)
                            const poster = topic.posters?.[0];
                            const user = users.find((u: any) => u.id === poster?.user_id);

                            const rawURL = `https://raw.githubusercontent.com/ethereum/${category === 'EIP'
                                ? 'EIPs'
                                : category === 'ERC'
                                    ? 'ERCs'
                                    : 'RIPs'
                                }/master/${category}S/${category.toLowerCase()}-${number}.md`;

                            let link = '';
                            try {
                                const headResponse = await axios.head(rawURL);
                                console.log(`HEAD request for ${rawURL} returned status: ${headResponse.status}`);
                                console.log(slug, post_id);
                                link = `https://ethereum-magicians.org/t/${slug}/${post_id}`;
                            } catch {
                                link = `https://ethereum-magicians.org/t/${slug}/${post_id}`;
                            }

                            return {
                                quote: title,
                                name: `${category}-${number}`,
                                title: 'Ethereum Magicians Topic',
                                avatar: user
                                    ? `https://ethereum-magicians.org${user.avatar_template.replace('{size}', '96')}`
                                    : '/profile.svg', // fallback avatar
                                link,
                            };
                        }
                        return null;
                    })
                );

                setItems(results.filter(Boolean) as any);
            } catch (error) {
                console.error('Failed to fetch topics:', error);
            }
        }

        fetchTopics();
    }, []);

    return (
        <Box as="section" py={20} color={useColorModeValue("gray.800", "white")}>
            <div className="py-16" id="trending">
         <Header
        title="Trending EIPs"
        subtitle="Overview"
        description="Explore the most impactful proposals shaping Ethereum today."
        sectionId="trending"
      />
            </div>

<Flex justify="center">
  <Box w="100%"> {/* ✅ fix here */}
    {items.length > 0 && (
      <InfiniteMovingCards
        items={items}
        direction="right"
        speed="slow"
      />
    )}
  </Box>
</Flex>

        </Box>
    );
}
