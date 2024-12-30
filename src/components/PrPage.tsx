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
import MarkdownBox from './PrOrIssueDescription';


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
                                    <FlexBetween flexDirection={{ base: 'column', md: 'row' }} alignItems="center">
                                        <Header title={"Pull Request"} subtitle={`#${data?.prDetails?.prNumber}`} />
                                        {/* <Box display={{ base: 'none', md: 'block' }} width="100%" maxWidth="400px">
                                            <SearchBox />
                                        </Box> */}
                                    </FlexBetween>

                                    <Box display={{ base: 'block', md: 'none' }} width="100%" paddingTop={4}>
                                        <SearchBox />
                                    </Box>

                                    <Box 
                                        className="flex flex-wrap items-center" 
                                        paddingTop={8} 
                                        flexDirection={{ base: 'column', lg: 'row' }}
                                        justifyContent={{ base: 'center', lg: 'flex-start' }}
                                        textAlign={{ base: 'center', lg: 'left' }}
                                        gap={{ base: 4, lg: 10 }}
                                    >
                                        {/* Image */}
                                        <NextLink href={`https://github.com/${data?.prDetails?.commits[0]?.author?.login}`} target={'_blank'}>
                                            <img
                                                src={data?.prDetails?.commits[0]?.author?.avatar_url}
                                                alt={data?.prDetails?.commits[0]?.author?.login}
                                                width={80}
                                                height={80}
                                                className={'rounded-full hover:scale-110 duration-200'}
                                            />
                                        </NextLink>

                                        {/* Title */}
                                        <Text className={'text-3xl'} marginTop={{ base: 4, lg: 0 }}>
                                            {data?.title}
                                        </Text>

                                        {/* Tag */}
                                        <Box paddingTop={{ base: 4, lg: 0 }}>
                                            <Wrap justify={{ base: 'center', lg: 'flex-start' }}>
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
{/* </Box> */}

                                    </Box>



                                        <Box paddingTop={8}>
                                        <Box
                                            className="border border-blue-400 rounded-[0.55rem]"
                                            display="grid"
                                            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                                            gap={4}
                                            py={4}
                                            px={{ base: 4, md: 8 }}
                                        >
                                            {/* Left Column */}
                                            <Box className="border-0 lg:border-r lg:border-blue-400" pr={{ base: 0, md: 4 }}>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="pb-10 pr-8">
                                                                <Text className="text-lg md:text-2xl font-bold">Commits:</Text>
                                                            </td>
                                                            <td className="pb-10">
                                                                <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prDetails?.prNumber}/commits`} target="_blank">
                                                                    <Wrap>
                                                                        <WrapItem>
                                                                            <Badge colorScheme="gray" className="rounded-full" fontSize={{ base: 'lg', md: '2xl' }} px={4} py={1}>
                                                                                {data?.prDetails?.commits.length}
                                                                            </Badge>
                                                                        </WrapItem>
                                                                    </Wrap>
                                                                </NextLink>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="pb-10 pr-8">
                                                                <Text className="text-lg md:text-2xl font-bold">Files Changed:</Text>
                                                            </td>
                                                            <td className="pb-10">
                                                                <NextLink href={`https://github.com/ethereum/EIPs/pull/${data?.prDetails?.prNumber}/files`} target="_blank">
                                                                    <Wrap>
                                                                        <WrapItem>
                                                                            <Badge colorScheme="gray" className="rounded-full" fontSize={{ base: 'lg', md: '2xl' }} px={4} py={1}>
                                                                                {data?.prDetails?.numFilesChanged}
                                                                            </Badge>
                                                                        </WrapItem>
                                                                    </Wrap>
                                                                </NextLink>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>

                                                {data?.prDetails?.labels.length !== 0  && (
                                                    <Box className="pb-10">
                                                        <Text className="text-lg md:text-2xl font-bold pb-5">Labels:</Text>
                                                        <div className="flex flex-wrap gap-2">
                                                            {data?.prDetails?.labels.map((item) => (
                                                                <Badge key={item} colorScheme={getLabelColor(item)} px={4} py={2} className="rounded-full">
                                                                    {item}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </Box>
                                                )}

                                                <Box>
                                                    <Text className="text-lg md:text-2xl font-bold pb-5">Participants:</Text>
                                                    <div className="flex flex-wrap gap-3">
                                                        {data?.prDetails?.participants.map((participant) => {
                                                            const matchingConversation = data?.prDetails?.conversations.find(
                                                                (conversation) => conversation.user.login === participant
                                                            );

                                                            return (
                                                                matchingConversation && (
                                                                    <NextLink key={participant} href={`https://github.com/${matchingConversation.user.login}`} target="_blank">
                                                                        <img
                                                                            src={`${matchingConversation.user.avatar_url}`}
                                                                            alt=""
                                                                            width={50}
                                                                            height={50}
                                                                            className="rounded-full hover:scale-110 duration-200"
                                                                        />
                                                                    </NextLink>
                                                                )
                                                            );
                                                        })}
                                                    </div>
                                                </Box>
                                            </Box>

                                            {/* Right Column */}
                                            <Box pl={{ base: 0, md: 4 }}>
                                                <div className="flex items-center space-x-4 pb-6">
                                                    <Text className="text-lg md:text-2xl font-bold">Link:</Text>
                                                    <NextLink href={`${data?.url}`} target="_blank">
                                                        <Button variant="outline" colorScheme="purple">
                                                            <Text className="text-sm">Go to Github PR Page</Text>
                                                        </Button>
                                                    </NextLink>
                                                </div>

                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-lg md:text-2xl pb-6 pr-8 flex items-center">
                                                                <NextLink href="https://github.com/eth-bot" target="_blank">
                                                                    <img
                                                                        src="https://avatars.githubusercontent.com/u/85952233?v=4"
                                                                        alt=""
                                                                        width={50}
                                                                        height={50}
                                                                        className="rounded-full hover:scale-110 duration-200"
                                                                    />
                                                                </NextLink>
                                                                <span className="ml-3">ETH-Bot Comments:</span>
                                                            </td>
                                                            <td className="text-xl">
                                                                <Badge colorScheme="gray" className="rounded-full" fontSize={{ base: 'lg', md: '2xl' }} px={4} py={2}>
                                                                    {ethBotCount}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="text-lg md:text-2xl pr-8 flex items-center">
                                                                <NextLink href="https://github.com/features/actions" target="_blank">
                                                                    <img
                                                                        src="https://avatars.githubusercontent.com/in/15368?s=80&v=4"
                                                                        alt=""
                                                                        width={50}
                                                                        height={50}
                                                                        className="rounded-full hover:scale-110 duration-200"
                                                                    />
                                                                </NextLink>
                                                                <span className="ml-3">Github-Actions Bot:</span>
                                                            </td>
                                                            <td className="text-xl">
                                                                <Badge colorScheme="gray" className="rounded-full" fontSize={{ base: 'lg', md: '2xl' }} px={4} py={2}>
                                                                    {gitActionsBotCount}
                                                                </Badge>
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

                                            <MarkdownBox text={data?.prDetails?.prDescription}/>
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