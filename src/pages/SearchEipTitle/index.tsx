import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByTitle from '@/components/SearchByTitle';

const Authors: React.FC = () => {
    return (
        <>
            <AllLayout>
              <SearchByTitle defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;