import React from 'react';
import StatusColumnChart from "@/components/StatusColumnChart";
import SearchBox from "@/components/SearchBox";
const Graphs = () => {
    return (
        <div>
            <StatusColumnChart category={'ERC'} />

            <SearchBox />
        </div>
    )
}

export default Graphs;