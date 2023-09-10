import React, { useEffect, useState } from 'react';
import AllLayout from '@/components/Layout';
import {
    Badge,
    Box, Button,
    Text,
    useColorModeValue,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { BiGitMerge } from 'react-icons/bi';
import {usePathname} from "next/navigation";
import SearchBox from "@/components/SearchBox";
import PrConversations from "@/components/PrConversations";




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


function getLabelColor(label : string){
    switch (label) {
        case 's-withdrawn':
        case 's-stagnant':
        case 's-review':
        case 's-lastcall':
        case 's-final':
        case 's-draft':
        case 'javascript':
            return 'green';
        case 'ruby':
        case 'bug':
            return 'red';
        case 'r-website':
        case 'r-process':
        case 'r-other':
        case 'r-eips':
        case 'r-ci':
            return 'purple';
        case 'created-by-bot':
        case '1272989785':
            return 'gray';
        case 'c-new':
        case 'c-status':
        case 'c-update':
            return 'orange';
        case 'a-review':
            return 'pink';
        case 'e-blocked':
        case 'e-blocking':
        case 'e-circular':
        case 'e-consensus':
        case 'e-number':
        case 'e-review':
            return 'yellow';
        case 'enhancement':
        case 'dependencies':
        case 'question':
            return 'blue';
        case 'discussions-to':
            return 'lightGreen';
        default:
            return 'gray';
    }
}

const PrPage: React.FC = () => {
    const [data, setData] = useState<PR | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const bg = useColorModeValue('#f6f6f7', '#171923');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLabelEmpty, setIsLabelEmpty] = useState(false);

    useEffect(() => {
        setIsDarkMode(bg === '#171923');
    }, [bg]);


    const path = usePathname();
    const brokenpath = path ? path.split('/') : '';
    const prNumber = brokenpath[2];

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

                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [prNumber]);



    useEffect(() => {
        if(data?.labels.length === 0){
            setIsLabelEmpty(true);
        }
    })

    const ethBotFiltered = data?.conversations.filter(
        (item) => item.user.login === 'eth-bot'
    );
    const ethBotCount = ethBotFiltered?.length;
    const gitActionsBotFiltered = data?.conversations.filter(
        (item) => item.user.login === 'github-actions[bot]'
    );
    const gitActionsBotCount = gitActionsBotFiltered?.length;

    return(
        <>
            <AllLayout>
                <>
                    <Box
                        paddingBottom={{lg:'10', sm: '10',base: '10'}}
                        marginX={{lg:"40",md:'2', sm: '2', base: '2'}}
                        paddingX={{lg:"10",md:'5', sm:'5',base:'5'}}
                        marginTop={{lg:"10",md:'5', sm:'5',base:'5'}}
                    >
                        <Box className={'flex justify-between'}>
                            <h1 className="text-7xl font-bold pt-4">
                                Pull Request
                            </h1>
                            <Box className={'pt-10'}>
                                <SearchBox />
                            </Box>
                        </Box>

                        <Box
                            paddingTop={8}
                            display={'flex'}
                            gap={5}
                        >
                            <NextLink href={`https://github.com/${data?.commits[0].author.login}`} target={'_blank'}>
                                <img
                                    src={`${data?.commits.map(item => item.author.avatar_url)}`}
                                    alt=""
                                    width={80}
                                    height={80}
                                    className={'rounded-full hover:scale-110 duration-200'}
                                />
                            </NextLink>

                            <Box
                                paddingTop={5}
                                display={'flex'}
                                className={'space-x-4'}
                            >
                                <Text className={'text-4xl'}>
                                    {data?.prTitle}
                                </Text>
                                <Text className={'text-4xl text-gray-400'}>
                                    #{data?.prNumber}
                                </Text>
                            </Box>

                            <Box paddingTop={3}>
                                <Wrap>
                                    <WrapItem>
                                        <Badge variant={'solid'} colorScheme={'purple'} display={'flex'} className={'text-3xl px-4 py-2 rounded-xl space-x-2'}>
                                            <BiGitMerge />  Merged
                                        </Badge>
                                    </WrapItem>
                                </Wrap>
                            </Box>
                        </Box>


                        <div className="pt-8">
                            <Box
                                className={'border border-blue-400 rounded-[0.55rem]'}
                                display={'grid'}
                                gridTemplateColumns={'1fr 1fr'}
                                paddingY={4}
                                paddingX={8}
                            >
                                <Box
                                    className={'border-r border-blue-400'}
                                >
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className={'text-2xl pb-10  pr-16'}>Commits:</td>
                                            <td className={'text-lg pb-10 rounded'}>
                                                <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prNumber}/commits`} target={'_blank'}>
                                                    <Wrap>
                                                        <WrapItem>
                                                            <Badge colorScheme={'gray'} className={'rounded-full'} fontSize={'2xl'} paddingX={4} paddingY={2}>
                                                                {data?.numCommits}
                                                            </Badge>
                                                        </WrapItem>
                                                    </Wrap>
                                                </NextLink>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={'text-2xl pr-16 '}>Files Changed:</td>
                                            <td className={'text-xl'}>
                                                <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prNumber}/files`} target={'_blank'}>
                                                    <Wrap>
                                                        <WrapItem>
                                                            <Badge colorScheme={'gray'} className={'rounded-full'} fontSize={'2xl'} paddingX={4} paddingY={2}>
                                                                {data?.filesChanged.length}
                                                            </Badge>
                                                        </WrapItem>
                                                    </Wrap>
                                                </NextLink>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <Text className={'text-2xl pt-8 py-5'}>
                                        Labels:
                                    </Text>
                                    <div className="flex space-x-3">
                                        {data?.labels.map(item => (
                                            <Wrap>
                                                <WrapItem>
                                                    <Badge  colorScheme={getLabelColor(item)} paddingX={4} paddingY={2} className={'rounded-full'}>
                                                        {isLabelEmpty ? 'No Label' : item}
                                                    </Badge>
                                                </WrapItem>
                                            </Wrap>
                                        ))}
                                    </div>

                                    <Text className={'text-2xl pt-8 py-5'}>
                                        Participants:
                                    </Text>
                                    <div className={'flex flex-wrap'}>
                                        {
                                            data?.participants.map(participant => {
                                                const matchingConversation = data?.conversations.find(conversation => conversation.user.login === participant);

                                                if (matchingConversation) {
                                                    return (
                                                        <NextLink key={participant} href={`https://github.com/${matchingConversation.user.login}`} target={'_blank'}>
                                                            <img
                                                                src={`${matchingConversation.user.avatar_url}`}
                                                                alt=""
                                                                width={50}
                                                                height={50}
                                                                className={'rounded-full hover:scale-110 duration-200 flex mr-5 my-3'}
                                                            />
                                                        </NextLink>
                                                    );
                                                }

                                                return null;
                                            })
                                        }
                                    </div>
                                </Box>

                                <Box className={'pl-8'}>
                                    <Box display={'flex'} className={'space-x-10 pb-10'}>
                                        <Text className={'text-2xl pt-2'}>Link:</Text>
                                        <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prNumber}`} target={'_blank'}>
                                            <Wrap>
                                                <Button variant={'outline'} colorScheme={'purple'}>
                                                    <Text className={'text-sm'}>Go to Github PR Page</Text>
                                                </Button>
                                            </Wrap>
                                        </NextLink>
                                    </Box>

                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className={'text-2xl pb-10  pr-16 flex'}>
                                                <NextLink href={'https://github.com/eth-bot'} target={'_blank'}>
                                                    <img
                                                        src={`https://avatars.githubusercontent.com/u/85952233?v=4`}
                                                        alt=""
                                                        width={50}
                                                        height={50}
                                                        className={'rounded-full hover:scale-110 duration-200 flex mr-5 my-3'}
                                                    />
                                                </NextLink>
                                                <span className="pt-5">ETH-Bot Comments:</span>
                                            </td>
                                            <td className={'text-xl pb-10 rounded'}>
                                                <Wrap>
                                                    <WrapItem>
                                                        <Badge colorScheme={'gray'} className={'rounded-full'} fontSize={'2xl'} paddingX={4} paddingY={2}>
                                                            {ethBotCount}
                                                        </Badge>
                                                    </WrapItem>
                                                </Wrap>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className={'text-2xl pr-16 flex'}>
                                                <NextLink href={'https://github.com/features/actions'} target={'_blank'}>
                                                    <img
                                                        src={`https://avatars.githubusercontent.com/in/15368?s=80&v=4`}
                                                        alt=""
                                                        width={50}
                                                        height={50}
                                                        className={'rounded-full hover:scale-110 duration-200 flex mr-5 my-3'}
                                                    />
                                                </NextLink>
                                                <span className='pt-4'>Github-Actions Bot:</span>
                                            </td>
                                            <td className={'text-xl'}>
                                                <Wrap>
                                                    <WrapItem>
                                                        <Badge colorScheme={'gray'} className={'rounded-full'} fontSize={'2xl'} paddingX={4} paddingY={2}>
                                                            {gitActionsBotCount}
                                                        </Badge>
                                                    </WrapItem>
                                                </Wrap>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    <Box>
                                        <Text className={'text-2xl pt-8'}>
                                            Editor Comments:
                                        </Text>

                                        <Box>
                                            {
                                                data?.conversations.map(conversation => (
                                                    <>
                                                        {
                                                           conversation.user.login === 'axic' || conversation.user.login === 'Pandapip1' || conversation.user.login === 'gcolvin' || conversation.user.login === 'lightclient' || conversation.user.login === 'SamWilsn' ? (
                                                               <Box>
                                                                   <NextLink href={conversation.user.html_url} target={'_blank'}>
                                                                       <img
                                                                           src={conversation.user.avatar_url}
                                                                           alt=""
                                                                           width={50}
                                                                           height={50}
                                                                           className={'rounded-full hover:scale-110 duration-200 flex mr-5 my-3'}
                                                                       />
                                                                   </NextLink>
                                                               </Box>
                                                           ):(
                                                               <>
                                                               </>
                                                           )
                                                        }
                                                    </>
                                                ))
                                            }
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>

                            <Box>
                                <Text className={'text-3xl font-bold'} paddingY={8}>
                                    All Conversations
                                </Text>

                                <PrConversations prNumber={prNumber}/>
                            </Box>
                        </div>
                    </Box>






                </>
            </AllLayout>
        </>
    );
}

export default PrPage;