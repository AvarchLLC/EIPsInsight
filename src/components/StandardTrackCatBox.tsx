import React, {useEffect, useState} from 'react';
import CatBox from "@/components/CatBox";
import {Box, Icon, useColorModeValue} from "@chakra-ui/react";
import {BookOpen, Briefcase, Clipboard, Link} from "react-feather";


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

const StandardTrackCatBox: React.FC = () => {

    const [data, setData] = useState<EIP[]>([]); // Set initial state as an empty array
    const [isLoading, setIsLoading] = useState(true); // Loader state
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
                console.log(response);
                const jsonData = await response.json();
                setData(jsonData);
                setIsLoading(false); // Set loader state to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false); // Set loader state to false even if an error occurs
            }
        };

        fetchData();
    }, []);
    const bg = useColorModeValue("#f6f6f7", "#171923");


    return(
        <>
            <Box
                gridColumn={'span 8'}
                display={{lg:'grid', base: 'none'}}
                gridTemplateColumns={'repeat(8,1fr)'}
                gap={'20px'}
                paddingX={4}
                bgColor={bg}
                className={'py-2'}
                borderRadius={'0.55rem'}
            >
                <CatBox
                    title="Core"
                    value={data.filter((item) => item.category === "Core").length}
                    icon={<Icon as={Link} />}
                    url="interface"
                />

                <CatBox
                    title="ERCs"
                    value={data.filter((item) => item.category === "ERC").length}
                    icon={<Icon as={Clipboard} />}
                    url="informational"
                />

                <CatBox
                    title="Networking"
                    value={
                        data.filter((item) => item.category === "Networking").length
                    }
                    icon={<Icon as={Briefcase} />}
                    url="meta"
                />
                <CatBox
                    title="Interface"
                    value={data.filter((item) => item.category === "Interface").length}
                    icon={<Icon as={BookOpen} fontSize={{lg:'15', sm: '10'}}/>}
                    url="erc"
                />
            </Box>


            <Box
                display={{lg:'none', base: 'grid'}}
                gridTemplateColumns="repeat(4, 1fr)"
                paddingTop={'5'}
                gap="10px"
                bgColor={bg}
                borderRadius={'0.55rem'}
                padding={'4'}

            >
                <CatBox
                    title="Core"
                    value={data.filter((item) => item.category === "Core").length}
                    icon={<Icon as={Link} />}
                    url="interface"
                />
                <CatBox
                    title="ERCs"
                    value={data.filter((item) => item.category === "ERC").length}
                    icon={<Icon as={Clipboard} />}
                    url="informational"
                />

                <CatBox
                    title="Networking"
                    value={
                        data.filter((item) => item.category === "Networking").length
                    }
                    icon={<Icon as={Briefcase} />}
                    url="meta"
                />
                <CatBox
                    title="Interface"
                    value={data.filter((item) => item.category === "Interface").length}
                    icon={<Icon as={Clipboard} />}
                    url="interface"
                />
            </Box>
        </>
    );
}

export default StandardTrackCatBox;