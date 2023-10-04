import React, {useEffect, useState} from 'react';
import IssuesPage from "@/components/IssuesPage";
import {useColorModeValue} from "@chakra-ui/react";
const Issues = () => {
    const bg = useColorModeValue('#f6f6f7', '#171923');
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if(bg === '#f6f6f7'){
            setIsDarkMode(false);
        }
        else{
            setIsDarkMode(true);
        }
    }, []);
    console.log(isDarkMode);
    return(
        <>
            <IssuesPage />
        </>
    )
}

export default Issues;