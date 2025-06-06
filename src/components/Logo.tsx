import React from "react";
import logoLight from '@/../public/EIPsInsightsDark.gif'; // for light mode
import logoDark from '@/../public/EIPsInsights.gif';     // for dark mode
import Image from 'next/image';
import { useColorModeValue } from "@chakra-ui/react";

function Logo() {
  const logoSrc = useColorModeValue(logoLight, logoDark); // use the imported image objects

  return (
    <Image
      src={logoSrc}
      width={50}
      height={50}
      alt="logo"
      priority
      style={{ color: 'inherit', backgroundColor: 'transparent' }}
    />
  );
}

export default Logo;
