import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByPrOrIssue from '@/components/SearchByPrOrIssue';

const Authors: React.FC = () => {
    return (
        <>
            <AllLayout> 
                <SearchByPrOrIssue defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;