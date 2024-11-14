import React, { useEffect, useState } from 'react';
import PrPage from "@/components/PrPage";
import { useRouter } from 'next/router';

const Test = () => {
    const router = useRouter();
    const { Type, number } = router.query;  // Extract dynamic parts of the URL

    // Logging the Type and number to ensure they're correctly extracted
    useEffect(() => {
        console.log("Type:", Type);
        console.log("Number:", number);
    }, [Type, number]);

    // Ensure both Type and number are available before rendering the component
    return (
        <div>
            {Type && number && (
                <PrPage Type={Type as string} number={number as string} />
            )}
        </div>
    );
}

export default Test;
