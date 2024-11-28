import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByEip from '@/components/SearchByEIP';

const Authors: React.FC = () => {
    return (
        <>
            <AllLayout>
              
                <SearchByEip defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;