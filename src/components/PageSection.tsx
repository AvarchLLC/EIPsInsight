import React from 'react';
import { Box, Divider, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

interface PageSectionProps {
  children: React.ReactNode;
  id?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  showDivider?: boolean;
  animate?: boolean;
}

const spacingMap = {
  sm: { py: 4, my: 2 },
  md: { py: 6, my: 3 },
  lg: { py: 8, my: 4 },
  xl: { py: 12, my: 6 }
};

const PageSection: React.FC<PageSectionProps> = ({ 
  children, 
  id, 
  spacing = 'md',
  showDivider = true,
  animate = true 
}) => {
  const dividerColor = useColorModeValue('gray.200', 'gray.600');
  const sectionSpacing = spacingMap[spacing];

  const content = (
    <Box
      id={id}
      {...sectionSpacing}
      position="relative"
    >
      {children}
      {showDivider && (
        <Divider 
          mt={sectionSpacing.py} 
          borderColor={dividerColor}
          opacity={0.6}
        />
      )}
    </Box>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default PageSection;
