import React from "react";
import logoDark from '@/../public/EIPsInsightsDark.gif';
import logo from '@/../public/EIPsInsights.gif';
import Image from 'next/image';
import { useColorModeValue } from "@chakra-ui/react";

function Logo() {
    
    const logoSrc = useColorModeValue( "/EIPsInsightsDark.gif", "/EIPsInsights.gif");

    return (
        <Image
    src={logoSrc}
    width={50}
    height={50}
    alt="logo"
    priority
    className="h-6 w-6"
    style={{ color: 'inherit', backgroundColor: 'transparent' }}
/>

    );
}

export default Logo;
