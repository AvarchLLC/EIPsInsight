import React, {useEffect, useState} from 'react';
import {useWindowSize} from "react-use";
import {useColorModeValue} from "@chakra-ui/react";


interface AreaProps {
    data: MappedDataItem[];
    xField: string;
    yField: string;
    color: string[];
    seriesField: string;
    xAxis: {
        range: number[];
        tickCount: number;
    };
    areaStyle: {
        fillOpacity: number;
    };
    legend: {
        position: string;
    };
    smooth: boolean;
}

interface MappedDataItem {
    status: string;
    date: string;
    value: number;
}

interface EIP {
    status: string;
    eips: {
        status: string;
        month: number;
        year: number;
        date: string;
        count: number;
        category: string
    }[];
}

interface FormattedEIP {
    status: string;
    date: string;
    value: number;
}

const statusColors: string[] = [
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

interface AreaCProps {
    category: string;
}


const TypeColumnChart : React.FC<AreaCProps> = ({category}) => {
    const [data, setData] = useState<EIP[]>([]);
    const windowSize = useWindowSize();
    const bg = useColorModeValue("#f6f6f7", "#171923");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/graphs`);
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const [isChartReady, setIsChartReady] = useState(false);

    useEffect(() => {
        setIsChartReady(true);
    }, []);

    const filteredData = data.filter((item) => category === (item.status));

    return(
        <>

        </>
    );
}

export default TypeColumnChart;