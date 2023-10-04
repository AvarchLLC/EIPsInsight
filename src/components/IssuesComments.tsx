import React, {useEffect, useState} from 'react';
import {Box, Text, useColorModeValue} from "@chakra-ui/react";
import NextLink from "next/link";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface IssuesCommentsProps{
    issueNumber: string;
}

interface Issues{
    type: string;
    title: string;
    url : string;
    issueDetails:{
        issueNumber: number;
        issueTitle: string;
        issueDescription: string;
        comments: Array<{
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
                site_admin: boolean
            };
            created_at: string;
            updated_at: string;
            author_association: string;
            body: string;
        }>
    }
}

const IssuesComments:React.FC<IssuesCommentsProps> = ({issueNumber}) => {
    const bg = useColorModeValue('#f6f6f7', '#1F2937');
    const bg2 = useColorModeValue('#E5E7EB', '#374151');
    const [data, setData] = useState<Issues | null>(null);
    useEffect(() => {
        if(issueNumber){
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/get-pr-or-issue-details/${issueNumber}`);
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
    }, [issueNumber]);
    return(
        <>

            <Box bg={bg} className={'rounded-lg px-8 py-4 hover:border-[1px] hover:border-blue-400 duration-200'} paddingTop={8}>
                <Text className={'text-3xl font-bold '} paddingBottom={8}>
                    Description
                </Text>
                <Box
                    className={'p-4 mx-4 text-lg mb-3 rounded-lg'}
                    bgColor={bg2}
                >
                    <Text className={'text-lg'}>
                        {data?.issueDetails?.issueDescription}
                    </Text>
                </Box>
            </Box>

            <Text className={'text-3xl font-bold'} paddingY={8}>
                Comments
            </Text>

            <Box
                className={'pt-8 border border-blue-400'}
                borderRadius={'0.55rem'}
            >
                {
                    data?.issueDetails?.comments?.map(comment => (
                        <Box
                            className={'mx-8 mb-8 rounded-lg'}
                            paddingY={4}
                            paddingX={4}
                            bgColor={bg}
                        >
                            <Box
                                className={'flex justify-between'}
                            >
                                <Box className={'flex justify-between w-full'}>
                                    <Box
                                        className={'flex space-x-4'}
                                    >
                                        <Box>
                                            <NextLink href={comment.user.html_url}>
                                                <img
                                                    src={comment.user.avatar_url}
                                                    alt={comment.user.login}
                                                    className={'w-14 h-14 rounded-full hover:scale-110 duration-200 ml-5 mt-3'}
                                                />
                                            </NextLink>
                                        </Box>
                                        <Box className={'mt-3'}>
                                            <Text className={'text-2xl font-bold'}>
                                                {comment.user.login}
                                            </Text>
                                            <Text className={'text-gray-400'}>
                                                {comment.author_association}
                                            </Text>
                                        </Box>
                                    </Box>

                                    <Text className={'text-gray-400'}>{comment.created_at}</Text>
                                </Box>
                            </Box>
                            <Box
                                className={'p-4 mx-8 mt-5 mb-3 rounded-lg'}
                                bgColor={bg2}
                            >
                                {/*<Text className={'text-lg'}>*/}
                                {/*    {comment.body}*/}
                                {/*</Text>*/}
                                <Markdown remarkPlugins={[remarkGfm]}>
                                    {comment.body}
                                </Markdown>
                            </Box>
                        </Box>
                    ))
                }
            </Box>
        </>
    );
}

export default IssuesComments;