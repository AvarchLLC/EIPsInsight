import React, {useEffect, useState} from 'react';
import {Box, useColorModeValue, Text} from "@chakra-ui/react";
import {borderColor} from "@mui/system";
import NextLink from "next/link";
import {motion} from "framer-motion";
import LoaderComponent from "@/components/Loader";

// interface Author{
//     login: string;
//     id: number;
//     node_id: string;
//     avatar_url: string;
//     gravatar_id: string;
//     url: string;
//     html_url: string;
//     followers_url: string;
//     following_url: string;
//     gists_url: string;
//     starred_url: string;
//     subscriptions_url: string;
//     organizations_url: string;
//     repos_url: string;
//     events_url: string;
//     received_events_url: string;
//     type: string;
//     site_admin:boolean;
//     contributions: number;
// }

interface EIP {
    _id: string;
    eip: string;
    title: string;
    author: string;
    status: string;
    type: string;
    category: string;
    created: string;
    discussion: string;
    deadline: string;
    requires: string;
    unique_ID: number;
    __v: number;
}

const Author: React.FC = () => {

    // const [data, setData] = React.useState<Author[]>([]);
    const [data, setData] = React.useState<EIP[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`/api/allcontributors`);
    //             const jsonData = await response.json();
    //             console.log(jsonData);
    //             setData(jsonData);
    //             setIsLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //             setIsLoading(false);
    //         }
    //     };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
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



    const uniqueAuthorNames = new Set<string>();

    const formattedAuthors : any[] = [];

    data.forEach((item) => {
        const authors = item.author.split(','); // Split authors by comma

        authors.forEach((author) => {
            const trimmedAuthor = author.trim();
            if (trimmedAuthor) {
                if (trimmedAuthor.includes('@') && trimmedAuthor.includes('(') && trimmedAuthor.includes(')')) {
                    // It matches type 2 pattern
                    const type2Match = trimmedAuthor.match(/^(.*?)\s?\((@.*?)\)$/);
                    if (type2Match) {
                        const name = type2Match[1].trim();
                        const username = type2Match[2].replace(/[@()]/g, ''); // Remove "@" and brackets
                        // Add the name to the set and to the result if it's unique
                        if (!uniqueAuthorNames.has(name)) {
                            uniqueAuthorNames.add(name);
                            formattedAuthors.push({ name, username });
                        }
                    }
                } else {

                    const type1Match = trimmedAuthor.match(/^(.*?)\s?<.*?@.*?>$/);
                    if (type1Match) {
                        const name = type1Match[1].trim();
                        // Add the name to the set and to the result if it's unique
                        if (!uniqueAuthorNames.has(name)) {
                            uniqueAuthorNames.add(name);
                            formattedAuthors.push({ name });
                        }
                    }
                }
            }
        });
    });

    // console.log(formattedAuthors);


    // const [githubData, setGithubData] = useState<any[]>([]);
    //
    // // Function to fetch GitHub profile data
    // const fetchGitHubProfile = async (username: string) => {
    //     try {
    //         const response = await fetch(`https://api.github.com/users/${username}`);
    //         if (response.ok) {
    //             const userData = await response.json();
    //             return userData;
    //         } else {
    //             throw new Error('GitHub API response not okay');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching GitHub profile:', error);
    //         return null;
    //     }
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const githubProfiles = await Promise.all(
    //             formattedAuthors.map((author) => {
    //                 if (author.username) {
    //                     return fetchGitHubProfile(author.username);
    //                 } else {
    //                     return Promise.resolve(null);
    //                 }
    //             })
    //         );
    //
    //         setGithubData(githubProfiles);
    //     };
    //
    //     fetchData();
    // }, [formattedAuthors]);







        const bg = useColorModeValue('#f7fafc', '#171923');
    const border = useColorModeValue('#000000', '#ffffff')

    return(
        <>
            {/*<Box*/}
            {/*    paddingBottom={{lg:'10', sm: '10',base: '10'}}*/}
            {/*    marginX={{lg:"40",md:'2', sm: '2', base: '2'}}*/}
            {/*    paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}*/}
            {/*    marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}*/}
            {/*>*/}
            {/*    {*/}
            {/*        isLoading ? (*/}
            {/*            <>*/}
            {/*                <Box*/}
            {/*                    display="flex"*/}
            {/*                    justifyContent="center"*/}
            {/*                    alignItems="center"*/}
            {/*                    height="100vh"*/}
            {/*                >*/}
            {/*                    <motion.div*/}
            {/*                        initial={{ opacity: 0, y: -20 }}*/}
            {/*                        animate={{ opacity: 1, y: 0 }}*/}
            {/*                        transition={{ duration: 0.5 }}*/}
            {/*                    >*/}
            {/*                        <LoaderComponent />*/}
            {/*                    </motion.div>*/}
            {/*                </Box>*/}
            {/*            </>*/}
            {/*        ):(*/}
            {/*            <Box*/}
            {/*                className={'grid grid-cols-3 gap-8'}*/}
            {/*            >*/}

            {/*                    {*/}
            {/*                        formattedAuthors.map((author,index) => (*/}
            {/*                            <>*/}
            {/*                            <Box*/}
            {/*                                bgColor={bg}*/}
            {/*                                border={2}*/}
            {/*                                borderColor={border}*/}
            {/*                                borderRadius={'0.55rem'}*/}
            {/*                                padding={4}*/}
            {/*                            >*/}
            {/*                                <div className={'space-y-8'} key={index}>*/}
            {/*                                    /!*<div className={'flex justify-center w-full'}>*!/*/}
            {/*                                    /!*    <NextLink href={authors.html_url} target={'_blank'}>*!/*/}
            {/*                                    /!*        <img*!/*/}
            {/*                                    /!*            src={authors.avatar_url}*!/*/}
            {/*                                    /!*            alt={authors.login}*!/*/}
            {/*                                    /!*            className={'w-20 h-20 rounded-full hover:scale-110 duration-200 ml-5 mt-3'}*!/*/}
            {/*                                    /!*        />*!/*/}
            {/*                                    /!*    </NextLink>*!/*/}
            {/*                                    /!*</div>*!/*/}

            {/*                                    /!*<div>*!/*/}
            {/*                                    /!*    <Text className={'text-2xl font-bold text-center'}>{authors.login}</Text>*!/*/}
            {/*                                    /!*</div>*!/*/}

            {/*                                    /!*<div>*!/*/}
            {/*                                    /!*    <Text className={'text-xl text-center'}>Contributions - {authors.contributions}</Text>*!/*/}
            {/*                                    /!*</div>*!/*/}
            {/*                                    <div className={'flex justify-center w-full'}>*/}
            {/*                                        {*/}
            {/*                                            author.username ? (*/}
            {/*                                                <img*/}
            {/*                                                    src={githubData[index]?.avatar_url}*/}
            {/*                                                    alt={`${author.username}'s GitHub Avatar`}*/}
            {/*                                                    className={'w-20 h-20 rounded-full hover:scale-110 duration-200 ml-5 mt-3'}*/}
            {/*                                                />*/}
            {/*                                            ): null*/}
            {/*                                        }*/}
            {/*                                    </div>*/}
            {/*                                    <Text className={'text-2xl font-bold text-center'}>{author.name}</Text>*/}
            {/*                                </div>*/}
            {/*                            </Box>*/}
            {/*                            </>*/}
            {/*                        ))*/}
            {/*                    }*/}

            {/*            </Box>*/}
            {/*        )*/}
            {/*    }*/}
            {/*</Box>*/}


            {/*<Box>*/}

            {/*</Box>*/}
        </>
    );
};
//
export default Author;