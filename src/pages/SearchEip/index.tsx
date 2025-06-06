import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByEip from '@/components/SearchByEIP';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const Authors: React.FC = () => {
    useScrollSpy([
  "Search EIP",
]);

    return (
        <>
            <AllLayout>
                <SearchByEip defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;