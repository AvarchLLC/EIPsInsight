import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByPrOrIssue from '@/components/SearchByPrOrIssue';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const Authors: React.FC = () => {
    useScrollSpy([
  "Search PR/ISSUE",
]);

    return (
        <>
            <AllLayout> 
                <SearchByPrOrIssue defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;