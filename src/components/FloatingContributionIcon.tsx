// components/FloatingContributionIcon.tsx
'use client';

import React from 'react';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { FaBug } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

const FloatingContributionIcon = () => {
  const pathname = usePathname();

  // Construct the GitHub URL dynamically
  const githubUrl = `https://github.com/AvarchLLC/EIPsInsight/blob/main/src/pages${pathname === '/' ? '/index.tsx' : `${pathname}`}`;

  return (
    <Box
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex="1000"
      borderRadius="50%"
      sx={{
        // Floating animation
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        animation: 'float 3s ease-in-out infinite',
      }}
    >
      <Tooltip label="Found a Bug? Try to fix it!" placement="left">
        <IconButton
          aria-label="Contribute"
          icon={<FaBug />}
          size="lg"
          colorScheme="teal"
          borderRadius="50%"
          onClick={() => window.open(githubUrl, '_blank')}
          sx={{
            // 3D effect with box shadow
            boxShadow: `
              0 5px 15px rgba(0, 0, 0, 0.3), // Base shadow
              0 10px 30px rgba(0, 0, 0, 0.2), // Outer glow
              inset 0 -3px 5px rgba(255, 255, 255, 0.2) // Inner highlight for 3D effect
            `,
            transform: 'perspective(500px) translateZ(20px)', // 3D perspective
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            _hover: {
              transform: 'perspective(500px) translateZ(30px)', // Hover effect
              boxShadow: `
                0 8px 20px rgba(0, 0, 0, 0.4), // Enhanced shadow on hover
                0 15px 40px rgba(0, 0, 0, 0.3), // Enhanced outer glow on hover
                inset 0 -5px 10px rgba(255, 255, 255, 0.3) // Enhanced inner highlight on hover
              `,
            },
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default FloatingContributionIcon;