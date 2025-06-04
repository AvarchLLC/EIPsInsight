import react, {useEffect, useState} from 'react';
import {Box, Spinner, Text, useColorModeValue} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import ReactMarkdown from 'react-markdown';

interface IssueConversationsProps {
    dataset: issue|null;
}

interface issue {
    type: string;
    title: string;
    url: string;
    state:string;
    issueDetails: {
        issueNumber: number;
        issueTitle: string;
        issueDescription: string;
        labels: string[];
        conversations: Conversation[];
        numConversations: number;
        participants: string[];
    }
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
    created_at: string;
    submitted_at:string;
    updated_at: string;
    author_association: string;
    body: string;
    reactions: {
        url: string;
        total_count: number;
    };
    performed_via_github_app: null | any;
}


const IssueConversations: React.FC<IssueConversationsProps> = ({dataset}) => {
    const [data, setData] = useState<issue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const bg = useColorModeValue('#f6f6f7', '#1F2937');
    const bg2 = useColorModeValue('#E5E7EB', '#374151');
    const codeBg = useColorModeValue('#f5f5f5', '#2d3748'); // Light and dark mode background for code blocks
    const preCodeBg = useColorModeValue('#f5f5f5', '#2d3748'); // Light and dark mode background for block code
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
                            {
                                data?.issueDetails?.conversations?.map(comment => (
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
                                           <ReactMarkdown
                                            components={{
                                                code({ inline, children, ...props }) {
                                                return inline ? (
                                                    <code
                                                    style={{
                                                        whiteSpace: 'break-spaces',
                                                        wordBreak: 'break-word',
                                                        backgroundColor: codeBg, // Adjusted dynamic background color for inline code
                                                        padding: '4px 6px', // Padding for inline code
                                                        borderRadius: '4px',
                                                        display: 'inline-block', // Ensure inline block behavior
                                                    }}
                                                    {...props}
                                                    >
                                                    {children}
                                                    </code>
                                                ) : (
                                                    <pre
                                                    style={{
                                                        overflowX: 'auto',
                                                        backgroundColor: preCodeBg, // Adjusted dynamic background color for block code
                                                        padding: '12px 16px', // Padding for block code
                                                        borderRadius: '4px',
                                                        maxWidth: '100%',
                                                        margin: 0, // Remove default <pre> margin
                                                    }}
                                                    {...props}
                                                    >
                                                    <code>{children}</code>
                                                    </pre>
                                                );
                                                },
                                            }}
                                            >
                                            {comment.body.split('\r\n\r\n')[0] || ''}
                                            </ReactMarkdown>

 
 {/* {comment.body.split('\r\n\r\n')[0]} */}
                                        </Box>
                                        <Box
                                        className={'mx-8'}
                                        >
                                        <Text className="text-sm font-bold mt-2">
                                            {new Date(comment.created_at).toLocaleString('en-US', {
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
                            }
                        </>
                    )
                }


            </Box>
        </>
    )
}

export default IssueConversations;