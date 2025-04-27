import React from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook
import AllLayout from '@/components/Layout';
import Author from '@/components/Author';

const Authors: React.FC = () => {
    const router = useRouter();
    const { name } = router.query; // Extract 'name' from the URL query parameters

    // Ensure 'name' is defined and cast to a string for safe use
    const authorName = typeof name === 'string' ? name : '';

    return (
        <>
            <AllLayout>
                <Author defaultQuery={authorName} />
            </AllLayout>
        </>
    );
};

export default Authors;
