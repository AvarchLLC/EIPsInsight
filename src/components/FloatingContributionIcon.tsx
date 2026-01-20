// components/FloatingContributionIcon.tsx
'use client';

import React from 'react';
import { Box, IconButton, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { FaBug } from 'react-icons/fa';
import { FaGithub } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const allowedPaths = [
  '/eips',
  '/ercs',
  '/rips',
  '/PR',
  '/catTable',
  '/insight',
  '/monthly',
  '/stats',
  '/tableStatus'
];

const FloatingContributionIcon = () => {
  const pathname = usePathname() || '/';

  // if the path is /eips/ or /ercs/ or /rips/ or /PR or /catTable or /insight or /monthly or /stats or /tableStatus then just use url as  https://github.com/AvarchLLC/EIPsInsight/blob/main/src/pages/[name like PR or monthly etc]

  const firstSegment = '/' + pathname.split('/').filter(Boolean)[0] || '/';

  let githubUrl = '';

  if (pathname === '/') {
    githubUrl = 'https://github.com/AvarchLLC/EIPsInsight/blob/main/src/pages/index.tsx';
  } else if (allowedPaths.includes(firstSegment)) {
    githubUrl = `https://github.com/AvarchLLC/EIPsInsight/blob/main/src/pages${firstSegment}`;
  } else {
    githubUrl = `https://github.com/AvarchLLC/EIPsInsight/blob/main/src/pages${pathname}`;
  }


  const headingColorLight = "#333";
  const headingColorDark = "#F5F5F5";
  const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";
  const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";

  return (
    <Box
      // position="fixed"
      // bottom="20px"
      // right="20px"
      zIndex="1000"
      borderRadius="50%"
    >
      <Tooltip label="View in Github!" placement="left">
        <IconButton
          aria-label="Contribute"
          icon={<FaGithub />}
          size="lg"
          colorScheme="teal"
          borderRadius="50%"
          onClick={() => window.open(githubUrl, '_blank')}
          sx={{
            boxShadow: `
                            0 5px 15px rgba(0, 0, 0, 0.3),
                            0 10px 30px rgba(0, 0, 0, 0.2),
                            inset 0 -3px 5px rgba(255, 255, 255, 0.2)
                          `,
            transition: 'box-shadow 0.2s ease',
            bgGradient: useColorModeValue(headingBgGradientLight, headingBgGradientDark),
            color: useColorModeValue(headingColorLight, headingColorDark),
            _hover: {
              boxShadow: `
                              0 8px 20px rgba(0, 0, 0, 0.4),
                              0 15px 40px rgba(0, 0, 0, 0.3),
                              inset 0 -5px 10px rgba(255, 255, 255, 0.3)
                            `,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default FloatingContributionIcon;