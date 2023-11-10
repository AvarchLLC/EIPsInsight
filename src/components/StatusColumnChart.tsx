import React, {useEffect, useState} from 'react';
import {useWindowSize} from "react-use";
import {Box, useColorModeValue} from "@chakra-ui/react";
import dynamic from "next/dynamic";

interface StatusChart{
    statusChanges:[
        {
            eip: string;
            lastStatus: string;
            eipTitle: string;
            eipCategory: string;
        }
    ];
    year: number;
}



interface AreaCProps {
    category: string;
}



const getStatus = (status: string) => {
    switch (status) {
        case "Draft":
            return "Draft";
        case "Final":
        case "Accepted":
        case "Superseded":
            return "Final";
        case "Last Call":
            return "Last Call";
        case "Withdrawn":
        case "Abandoned" :
        case "Rejected":
            return "Withdrawn";
        case "Review":
            return "Review";
        case "Living":
        case "Active":
            return "Living";
        case "Stagnant":
            return "Stagnant";
        default:
            return "Final";
    }
};

const categoryColors: string[] = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(255, 99, 255)',
    'rgb(50, 205, 50)',
    'rgb(255, 0, 0)',
    'rgb(0, 128, 0)',
];
const categoryBorder: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 99, 255, 0.2)',
    'rgba(50, 205, 50, 0.2)',
    'rgba(255, 0, 0, 0.2)',
    'rgba(0, 128, 0, 0.2)',
];

const getCat= (cat: string) => {
    switch (cat) {
        case "Standards Track":
        case "Standard Track":
        case "Standards Track (Core, Networking, Interface, ERC)":
        case "Standard":
        case "Process":
        case "Core":
        case "core":
            return "Core";
        case "ERC":
            return "ERCs";
        case "Networking":
            return "Networking";
        case "Interface":
            return "Interface";
        case "Meta":
            return "Meta";
        case "Informational":
            return "Informational";
        default:
            return "Core";
    }
}

const StatusChart: React.FC<AreaCProps> = ({category}) => {
    const [data, setData] = useState<StatusChart[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/final-status-by-year`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);






    const windowSize = useWindowSize();
    const bg = useColorModeValue("#f6f6f7", "#171923");

    const filteredData = data.map(item => ({
        year: item.year,
        statusChanges: item.statusChanges.filter(x => getCat(x.eipCategory) === category)
    }));

    console.log(filteredData);


    const transformedData = filteredData.flatMap(item => (
        item.statusChanges.map(change => ({
            status: getStatus(change.lastStatus),
            year: item.year,
            value: 1
        }))
    ));

    const Area = dynamic(() => import('@ant-design/plots').then((item) => item.Column), {
        ssr: false,
    });

    const config = {
        data: transformedData,
        xField: 'year',
        yField: 'value',
        color: categoryColors,
        seriesField: 'status',
        isStack: true,
        areaStyle: { fillOpacity: 0.6 },
        legend: { position: 'top-right' as const },
        smooth: true,
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        } as any,
    };

    return (
        <>
            <Box boxSize={"100%"}
                 paddingX={'1rem'}
                 overflowX={'hidden'}

            >

                <Area {...config}/>
            </Box>
        </>
    )
}

export default StatusChart;