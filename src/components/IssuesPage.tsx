import React, {useEffect, useState} from 'react';
import {Box, Text, useColorModeValue, useColorMode } from "@chakra-ui/react";
import {usePathname} from "next/navigation";
import SearchBox from "@/components/SearchBox";
import AllLayout from '@/components/Layout';
import NextLink from "next/link";
import IssuesComments from "@/components/IssuesComments";
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

const IssuesPage:React.FC  = () => {
    const [data, setData] = useState<Issues | null>(null);
    const path = usePathname();
    const brokenpath = path ? path.split('/') : '';
    const issueNumber = brokenpath[2];
    const { colorMode } = useColorMode();

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
            <Box >
                <AllLayout>
                    <Box
                        paddingBottom={{lg:'10', sm: '10',base: '10'}}
                        marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                        paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                        marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
                    >

                        <Box className={'flex justify-between'}>
                            <h1 className="text-7xl font-bold pt-4 text-blue-400">
                                Issues
                            </h1>
                            <Box className={'pt-10'}>
                                <SearchBox />
                            </Box>
                        </Box>

                        <Box
                            paddingTop={8}
                            display={'flex'}
                            className={'space-x-4'}
                        >
                            <Text className={'text-4xl font-bold'}>
                                {data?.issueDetails?.issueTitle}
                            </Text>
                            <Text className={'text-4xl text-gray-400'}>
                                #{data?.issueDetails?.issueNumber}
                            </Text>
                        </Box>



                        <Box className={'pt-8'}>
                            <IssuesComments issueNumber={issueNumber}/>
                        </Box>

                    </Box>
                </AllLayout>
            </Box>
    );
}

export default IssuesPage;
