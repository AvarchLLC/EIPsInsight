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
import { BiGitMerge, BiLockAlt, BiGitBranch } from 'react-icons/bi';
import SearchBox from "@/components/SearchBox";
import PrConversations from "@/components/PrConversations";
import PrComments from './PrReviewComments';
import FlexBetween from "@/components/FlexBetween";
import Header from "@/components/Header";
import {motion} from "framer-motion";
import LoaderComponent from "@/components/Loader";
import ReactMarkdown from 'react-markdown';



interface PR {
    type: string;
    title: string;
    url: string;
    state:string;
    prDetails: {
        prNumber: number;
        prTitle: string;
        prDescription: string;
        labels: string[];
        conversations: Conversation[];
        numConversations: number;
        participants: string[];
        commits: Commit[];
        numFilesChanged:number;
    }
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

interface PrPageProps {
    Type: string; 
    number:string;
  }

const PrPage: React.FC<PrPageProps> = ({ Type,number }) => {
    const [data, setData] = useState<PR | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const bg = useColorModeValue('#f6f6f7', '#171923');
    const [isDarkMode, setIsDarkMode] = useState(false);


    useEffect(() => {
        setIsDarkMode(bg === '#171923');
    }, [bg]);


    // const path = usePathname();
    // const brokenpath = path ? path.split('/') : '';
    const prNumber = number;
    console.log(Type);
    console.log(prNumber);

    useEffect(() => {
        if (prNumber) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/get-pr-details/${Type}/${prNumber}`);
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
    console.log(data);





    const ethBotFiltered = data?.prDetails?.conversations.filter(
        (item) => item.user.login === 'eth-bot'
    );
    const ethBotCount = ethBotFiltered?.length;
    const gitActionsBotFiltered = data?.prDetails?.conversations?.filter(
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
                        {
                            isLoading ? (
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
                            ):(
                                <>
                                    <Box>
                                        <FlexBetween>
                                            <Header title={"Pull Request"} subtitle={`#${data?.prDetails?.prNumber}`}/>
                                            <SearchBox />
                                        </FlexBetween>

                                        <Box className={'flex space-x-10 items-center'} paddingTop={8}>
                                            <NextLink href={`https://github.com/${data?.prDetails?.commits[0]?.author?.login}`} target={'_blank'}>
                                                <img
                                                    src={data?.prDetails?.commits[0]?.author?.avatar_url}
                                                    alt={data?.prDetails?.commits[0]?.author?.login}
                                                    width={80}
                                                    height={80}
                                                    className={'rounded-full hover:scale-110 duration-200'}
                                                />
                                            </NextLink>
                                            <Text className={'text-3xl'}>{data?.title}</Text>
                                            <Box paddingTop={3}>
                                            <Wrap>
                                                <WrapItem>
                                                    {data?.state === 'merged' ? (
                                                        <Badge variant={'solid'} colorScheme={'purple'} display={'flex'} className={'text-3xl px-4 py-2 rounded-xl space-x-2'}>
                                                            <BiGitMerge /> Merged
                                                        </Badge>
                                                    ) : data?.state === 'closed' ? (
                                                        <Badge variant={'solid'} colorScheme={'red'} display={'flex'} className={'text-3xl px-4 py-2 rounded-xl space-x-2'}>
                                                            <BiLockAlt /> Closed
                                                        </Badge>
                                                    ) : data?.state === 'open' ? (
                                                        <Badge variant={'solid'} colorScheme={'green'} display={'flex'} className={'text-3xl px-4 py-2 rounded-xl space-x-2'}>
                                                            <BiGitBranch /> Open
                                                        </Badge>
                                                    ) : null}
                                                </WrapItem>
                                            </Wrap>
                                            </Box>
                                        </Box>

                                        <Box paddingTop={8}>
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
                                                            <td
                                                                className={'pb-10 pr-16'}
                                                            >
                                                                <Text className={'text-2xl font-bold'}>Commits:</Text>
                                                            </td>
                                                            <td className={'pb-10'}>
                                                                <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prDetails?.prNumber}/commits`} target={'_blank'}>
                                                                    <Wrap>
                                                                        <WrapItem>
                                                                            <Badge colorScheme={'gray'} className={'rounded-full'} fontSize={'2xl'} paddingX={4} paddingY={1}>
                                                                                {data?.prDetails?.commits.length}
                                                                            </Badge>
                                                                        </WrapItem>
                                                                    </Wrap>
                                                                </NextLink>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td className={'pb-10 pr-16'}><Text className={'text-2xl font-bold'}>Files Changed: </Text></td>
                                                            <td className={'pb-10'}>
                                                                <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prDetails?.prNumber}/files`} target={'_blank'}>
                                                                    <Wrap>
                                                                        <WrapItem>
                                                                            <Badge colorScheme={'gray'} className={'rounded-full'} fontSize={'2xl'} paddingX={4} paddingY={1}>
                                                                                {data?.prDetails?.numFilesChanged}
                                                                            </Badge>
                                                                        </WrapItem>
                                                                    </Wrap>
                                                                </NextLink>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>

                                                    {
                                                        data?.prDetails?.labels.length !== 0 ? (
                                                            <Box className={'pb-10'}>
                                                                <Text className={'text-2xl font-bold pb-5'}>Labels: </Text>
                                                                <div className="flex space-x-3">
                                                                    {
                                                                        data?.prDetails?.labels.map(item => (
                                                                            <Wrap>
                                                                                <WrapItem>
                                                                                    <Badge  colorScheme={getLabelColor(item)} paddingX={4} paddingY={2} className={'rounded-full'}>
                                                                                        {item}
                                                                                    </Badge>
                                                                                </WrapItem>
                                                                            </Wrap>
                                                                        ))
                                                                    }
                                                                </div>
                                                            </Box>
                                                        ):(
                                                            <>
                                                            </>
                                                        )
                                                    }

                                                    <Box>
                                                        <Text className={'text-2xl font-bold pb-5'}>Participants: </Text>
                                                        <div className={'flex flex-wrap'}>
                                                            {
                                                                data?.prDetails?.participants.map(participant => {
                                                                    const matchingConversation = data?.prDetails?.conversations.find(conversation => conversation.user.login === participant);

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
                                                </Box>

                                                <Box
                                                    className={'pl-10'}
                                                >
                                                    <div className={'flex items-center space-x-10 pb-10'}>
                                                        <Text className={'text-2xl font-bold'}>Link:</Text>
                                                        <NextLink href={`${data?.url}`} target={'_blank'}>
                                                            <Wrap>
                                                                <Button variant={'outline'} colorScheme={'purple'}>
                                                                    <Text className={'text-sm'}>Go to Github PR Page</Text>
                                                                </Button>
                                                            </Wrap>
                                                        </NextLink>
                                                    </div>

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
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box>
                                            <Text className="text-3xl font-bold" paddingY={8}>
                                                Description
                                            </Text>

                                            <Box className="border border-blue-400 p-4 rounded-lg">
                                                <Text className="text-xl">
                                                    <ReactMarkdown>
                                                        {data?.prDetails?.prDescription || ''}
                                                    </ReactMarkdown>
                                                </Text>
                                            </Box>
                                        </Box>


                                        <Box>
                                            <Text className={'text-3xl font-bold'} paddingY={8}>
                                                All Conversations
                                            </Text>

                                            <PrConversations dataset={data}/>
                                        </Box>

                                        <Box>
                                            <Text className={'text-3xl font-bold'} paddingY={8}>
                                                Review Comments
                                            </Text>

                                            <PrComments dataset={data}/>
                                        </Box>

                                    </Box>
                                </>
                            )
                        }

                    </Box>






                </>
            </AllLayout>
        </>
    );
}

export default PrPage;