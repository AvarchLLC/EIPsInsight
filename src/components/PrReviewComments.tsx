import react, {useEffect, useState} from 'react';
import {Box, Spinner, Text, useColorModeValue} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import ReactMarkdown from 'react-markdown';

interface PrConversationsProps {
    dataset: PR|null;
}

interface PR {
    type: string;
    title: string;
    state:string;
    url: string;
    prDetails: {
        prNumber: number;
        prTitle: string;
        prDescription: string;
        labels: string[];
        conversations: Conversation[];
        numConversations: number;
        participants: string[];
        commits: Commit[];
    };
    reviewComments: Conversation[];
}

interface Conversation {
    url: string;
    html_url: string;
    issue_url: string;
    state:string;
    id: number;
    node_id: string;
    user: {
        login: string;
        html_url: string;
        id: number;
        node_id: string;
        avatar_url: string;
    };
    submitted_at:string;
    created_at: string;
    updated_at: string;
    author_association: string;
    body: string;
    reactions: {
        url: string;
        total_count: number;
    };
    performed_via_github_app: null | any;
}

interface Commit {
    sha: string;
    node_id: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
        tree: {
            sha: string;
            url: string;
        };
        url: string;
        comment_count: number;
        verification: {
            verified: boolean;
            reason: string;
            signature: string;
            payload: string;
        };
    };
    url: string;
    html_url: string;
    comments_url: string;
    author: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
    };
    committer: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
    };
    parents: Parent[];
}

interface Parent {
    sha: string;
    url: string;
    html_url: string;
}


const PrComments: React.FC<PrConversationsProps> = ({dataset}) => {
    const [data, setData] = useState<PR | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const bg = useColorModeValue('#f6f6f7', '#1F2937');
    const bg2 = useColorModeValue('#E5E7EB', '#374151');
    useEffect(() => {
        setData(dataset);
        setIsLoading(false);
    }, [dataset]);
    return(
        <>
            <Box
                className={'pt-8 border border-blue-400'}
                borderRadius={'0.55rem'}
            >
                {
                    isLoading ? (
                        <>
                            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                                <Spinner/>
                            </Box>
                        </>
                    ):(
                        <>
                            <Box>
                        {data?.reviewComments?.length === 0 ? (
                            <Box className={'mx-8 p-8'}
                            display="flex" 
                            justifyContent="center" 
                            alignItems="center"
                            >
                            <Text className="text-2xl font-bold mt-2">No reviews yet!</Text>
                            </Box>
                        ) : (
                            data?.reviewComments?.map((comment) => (
                                <Box
                                    key={comment.id}  // Make sure to add a unique key for each comment
                                    className={'mx-8 mb-8 rounded-lg'}
                                    paddingY={4}
                                    paddingX={4}
                                    bgColor={bg}
                                >
                                    <Box className={'flex justify-between'}>
                                        <Box className={'flex space-x-4'}>
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
                                                    {comment.state}
                                                </Text>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box className={'p-4 mx-8 mt-4 rounded-lg'} bgColor={bg2}>
                                        <Box>
                                            {comment.body.trim() === "" ? (
                                                comment.state === "APPROVED" ? (
                                                    <Text className="text-lg font-bold">{comment.user.login} approved the changes.</Text>
                                                ) : comment.state === "COMMENTED" ? (
                                                    <Text className="text-lg font-bold">{comment.user.login} reviewed the changes.</Text>
                                                ) : null
                                            ) : (
                                                <ReactMarkdown>
                                                    {comment.body.split('\r\n\r\n')[0]}
                                                </ReactMarkdown>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box className={'mx-8'}>
                                        <Text className="text-sm font-bold mt-2">
                                            {new Date(comment.submitted_at).toLocaleString('en-US', {
                                                weekday: 'long',    // "Monday"
                                                year: 'numeric',    // "2024"
                                                month: 'long',      // "November"
                                                day: 'numeric',     // "14"
                                                hour: 'numeric',    // "10 AM"
                                                minute: '2-digit',  // "30"
                                                hour12: true        // 12-hour format
                                            })}
                                        </Text>
                                    </Box>
                                </Box>
                            ))
                        )}
                    </Box>

                        </>
                    )
                }


            </Box>
        </>
    )
}

export default PrComments;