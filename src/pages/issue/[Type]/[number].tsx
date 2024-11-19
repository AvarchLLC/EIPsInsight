import React, { useEffect, useState } from 'react';
import IssuePage from "@/components/IssuesPage";
import { useRouter } from 'next/router';

const Test = () => {
    const router = useRouter();
    const { Type, number } = router.query;  

   
    useEffect(() => {
        console.log("Type:", Type);
        console.log("Number:", number);
    }, [Type, number]);

   
    return (
        <div>
            {Type && number && (
                <IssuePage Type={Type as string} number={number as string} />
            )}
        </div>
    );
}

export default Test;
