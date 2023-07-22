import { motion, Transition } from 'framer-motion';
import { Box, Text, useTheme } from '@chakra-ui/react';
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 } as any}
        fontSize={{base: "2xl", md: "6xl"}}
        fontWeight="bold"
        color="#10b981"

      >
        {title}
      </Text>
      <Text
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 } as any}
        fontSize={{base: "md", md: "2xl"}}
        className=""
      >
        {subtitle}
      </Text>
    </Box>
  );
};

export default Header;
