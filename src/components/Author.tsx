import React, {useEffect, useState} from 'react';
import {Box, useColorModeValue, Text} from "@chakra-ui/react";
import {borderColor} from "@mui/system";
import NextLink from "next/link";
import {motion} from "framer-motion";
import LoaderComponent from "@/components/Loader";

interface Author{
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
    site_admin:boolean;
    contributions: number;
}

const Author: React.FC = () => {

    const [data, setData] = React.useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/allcontributors`);
                const jsonData = await response.json();
                console.log(jsonData);
                setData(jsonData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const bg = useColorModeValue('#f7fafc', '#171923');
    const border = useColorModeValue('#000000', '#ffffff')

    return(
        <>
            <Box
                paddingBottom={{lg:'10', sm: '10',base: '10'}}
                marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
            >
                {
                    isLoading ? (
                        <>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                height="100vh"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <LoaderComponent />
                                </motion.div>
                            </Box>
                        </>
                    ):(
                        <Box
                            className={'grid grid-cols-3 gap-32'}
                        >
                            {
                                data.map(authors => (
                                    <Box
                                        bgColor={bg}
                                        border={2}
                                        borderColor={border}
                                        borderRadius={'0.55rem'}
                                        padding={4}
                                    >
                                        <div className={'space-y-8'}>
                                            <div className={'flex justify-center w-full'}>
                                                <NextLink href={authors.html_url} target={'_blank'}>
                                                    <img
                                                        src={authors.avatar_url}
                                                        alt={authors.login}
                                                        className={'w-20 h-20 rounded-full hover:scale-110 duration-200 ml-5 mt-3'}
                                                    />
                                                </NextLink>
                                            </div>

                                            <div>
                                                <Text className={'text-2xl font-bold text-center'}>{authors.login}</Text>
                                            </div>

                                            <div>
                                                <Text className={'text-xl text-center'}>Contributions - {authors.contributions}</Text>
                                            </div>

                                        </div>
                                    </Box>
                                ))
                            }


                        </Box>
                    )
                }
            </Box>
        </>
    );
};

export default Author;