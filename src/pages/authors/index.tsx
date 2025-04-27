import React from 'react';
import AllLayout from "@/components/Layout";
import Author from "@/components/Author";

const Authors: React.FC = () => {
    return (
        <>
            <AllLayout>
                <Author defaultQuery=''/>
            </AllLayout>
        </>
    );
};

export default Authors;