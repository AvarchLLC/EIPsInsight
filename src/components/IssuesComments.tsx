import React, {useEffect, useState} from 'react';
import {Box, Text, useColorModeValue} from "@chakra-ui/react";
import NextLink from "next/link";

interface IssuesCommentsProps{
    issueNumber: string;
}

interface Issues{
    issueNumber: number;
    issueTitle: string;
    issueDescription: string;
    comments: [{
        html_url: string;
        user:{
            login: string;
            id: number;
            avatar_url: string;
            html_url: string;
        }
        author_association:string;
        body: string;
    }];
    labels: [];
    participants:[];
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
            <Box
                className={'pt-8 border border-blue-400'}
                borderRadius={'0.55rem'}
            >
                {
                    data?.comments?.map(comment => (
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
                            </Box>
                            <Box
                                className={'p-4 mx-8 mt-5 mb-3 rounded-lg'}
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
    );
}

export default IssuesComments;