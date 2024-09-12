import React,{useState, useEffect} from "react";
import logoDark from '@/../public/EIPsInsightsDark.gif';
import logo from '@/../public/EIPsInsights.gif';
import Image from 'next/image';
import {useColorModeValue} from "@chakra-ui/react";

function Logo() {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if(bg === "#f6f6f7"){
            setIsDarkMode(false);
        }
        else{
            setIsDarkMode(true);
        }
    })
    return (
        <>
            <Image src={isDarkMode ? logo : logoDark} width={50} height={50} alt={'logo'} priority/>
        </>
    );
}

export default Logo;