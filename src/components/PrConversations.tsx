import react, {useEffect, useState} from 'react';
import {Box, Text, useColorModeValue} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface PrConversationsProps {
    prNumber: string;
}

interface PR {
    _id: string;
    __v: number;
    prNumber: number;
    prTitle: string;
    prDescription: string;
    labels: [];
    conversations: [
        {
            url: string;
            html_url: string;
            issue_url: string;
            id: number;
            node_id: string;
            user: {
                login: string;
                id: number;
                node_id: string;
                avatar_url: string;
                gravatar_id: string;
                url: string;
                html_url: string;
                followers_url: string;
                following_url: string;
                gists_url: string;
                starred_url: string;
                subscriptions_url: string;
                organizations_url: string;
                repos_url: string;
                events_url: string;
                received_events_url: string;
                type: string;
                site_admin: boolean;
            }
            author_association: string;
            body: string;
        }
    ];
    participants: [];
    mergeDate: string;
    numCommits: number;
    numFilesChanged: number;
    numParticipants: number;
    numConversations: number;
    filesChanged: [];
    commits: [
        {
            author: {
                login: string;
                id: number;
                node_id: string;
                avatar_url: string;
                gravatar_id: string;
                url: string;
                html_url: string;
                followers_url: string;
                following_url: string;
                gists_url: string;
                starred_url: string;
                subscriptions_url: string;
                organizations_url: string;
                repos_url: string;
                events_url: string;
                received_events_url: string;
                type: string;
                site_admin: boolean;
            }
        }
    ];
}


const PrConversations: React.FC<PrConversationsProps> = ({prNumber}) => {
    const [data, setData] = useState<PR | null>(null);
    const bg = useColorModeValue('#f6f6f7', '#1F2937');
    const bg2 = useColorModeValue('#E5E7EB', '#374151');
    useEffect(() => {
        if (prNumber) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/pr/${prNumber}`);
                    const jsonData = await response.json();

                    if (jsonData && typeof jsonData === 'object') {
                        setData(jsonData);
                    } else {
                        console.error('API response is not an object:', jsonData);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [prNumber]);
    return(
        <>
            <Box
                className={'pt-8 border border-blue-400'}
                borderRadius={'0.55rem'}
            >
                {
                    data?.conversations?.map(comment => (
                        <Box
                            className={'mx-8 mb-8 rounded-lg'}
                            paddingY={4}
                            paddingX={4}
                            bgColor={bg}
                        >
                            <Box
                                className={'flex justify-between'}
                            >
                                <Box
                                    className={'flex space-x-4'}
                                >
                                    <Box>
                                        <NextLink href={comment.user.html_url}>
                                            <img
                                                src={comment.user.avatar_url}
                                                alt={comment.user.login}
                                                className={'w-14 h-14 rounded-full hover:scale-110 duration-200'}
                                            />
                                        </NextLink>
                                    </Box>
                                    <Box>
                                        <Text className={'text-2xl font-bold'}>
                                            {comment.user.login}
                                        </Text>
                                        <Text className={'text-gray-400'}>
                                            {comment.author_association}
                                        </Text>
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                className={'p-4 mx-8 mt-4 rounded-lg'}
                                bgColor={bg2}
                            >
                                <Text className={'text-lg'}>
                                    {comment.body}
                                </Text>
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </>
    )
}

export default PrConversations;