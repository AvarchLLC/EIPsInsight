import React from 'react';
import AllLayout from "@/components/Layout";
import Author from "@/components/Author";
import { useScrollSpy } from '@/hooks/useScrollSpy';

const Authors: React.FC = () => {
    useScrollSpy([
  "Search Author",
]);

    return (
        <>
            <AllLayout>
                <Author defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;