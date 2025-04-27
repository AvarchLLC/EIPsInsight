import { Box, Flex, Text, useColorMode, Icon, Spacer } from '@chakra-ui/react';
import { FaEthereum } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { fetchEthPriceInUSD } from './ethereumService';

const Navbar = () => {
  const { colorMode } = useColorMode();
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await fetchEthPriceInUSD();
      setEthPrice(price);
    };
    fetchPrice();
  }, []);

  return (
    <Box
      bg="black" // Set background to black
      p={4}
      boxShadow="0px 4px 6px rgba(159, 122, 234, 0.5)" // Purple shadow
    >
      <Flex align="center" maxW="1200px" mx="auto">
        {/* Ethereum Mainnet Section */}
        <Flex align="center">
          <Icon
            as={FaEthereum}
            w={8}
            h={8}
            bgGradient="#9F7AEA" // Pink to purple gradient
            bgClip="text"
            mr={2}
          />
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="white"
            textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)" // Enhanced purple shadow
          >
            Ethereum Hoodie Testnet
          </Text>
        </Flex>

        <Spacer />

        {/* ETH Price Section */}
        {ethPrice && (
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="white"
            textShadow="0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8), 0 0 30px rgba(159, 122, 234, 0.8)"  // Enhanced purple shadow
          >
            ETH Price: {ethPrice.toFixed(2)} USD
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;