// BorderedImage.tsx
"use client";

import { Box, Image as ChakraImage, useColorModeValue } from "@chakra-ui/react";

export default function BorderedImage({ src, alt, ...props }) {
  const borderColor = useColorModeValue('teal.400', 'teal.600');
  return (
    <Box borderWidth="2px" borderColor={borderColor} borderRadius="xl" {...props}>
      <ChakraImage src={src} alt={alt} width="100%" objectFit="cover" />
    </Box>
  );
}
