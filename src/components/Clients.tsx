'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Flex, Text, useColorModeValue, } from '@chakra-ui/react';
import { InfiniteMovingCards } from './InfiniteMovingCards';
import { slideInFromLeft, slideInFromRight } from "@/lib/utils";
import { motion } from 'framer-motion';

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
                                link =
                                    headResponse.status === 200
                                        ? `https://eipsinsight.com/${category.toLowerCase()}s/${category.toLowerCase()}-${number}`
                                        : `https://ethereum-magicians.org/t/${slug}/${post_id}`;
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
            <motion.div
                variants={slideInFromLeft(0.5)}
                initial="hidden"
                animate="visible"
            >
                <Text fontSize="6xl" fontWeight="bold" textAlign="center">
                    Trending{' '}
                    <Box as="span" className="text-blue-400">
                        EIPS
                    </Box>

                </Text>
            </motion.div>

            <motion.div
                variants={slideInFromRight(0.5)}
                initial="hidden"
                animate="visible"
            >
                <Text fontSize="lg" color="gray.300" mt={4} mb={10} textAlign="center">
                    Explore the most impactful proposals shaping Ethereum today.
                </Text>
            </motion.div>

            <Flex justify="center">
                <Box w="100%" maxW="7xl" h={{ base: '50vh', md: '30rem' }}>
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
