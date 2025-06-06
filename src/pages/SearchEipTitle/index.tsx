import React from 'react';
import AllLayout from "@/components/Layout";
import SearchByTitle from '@/components/SearchByTitle';
import { useScrollSpy } from '@/hooks/useScrollSpy';

const Authors: React.FC = () => {
    useScrollSpy([
  "Search EIP Title",
]);

    return (
        <>
            <AllLayout>
              <SearchByTitle defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;