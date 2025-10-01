import { Box, Heading, Text, Button } from "@chakra-ui/react";
import AllLayout from "@/components/Layout";
import FactsSection from "@/components/TriviaContents";
import EtherWorldAdCard from "@/components/EtherWorldAdCard";

const UnderConstructionPage: React.FC = () => {
  return (
    <AllLayout>
      {/* <Box
        textAlign="center"
        py={6}
        px={6}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Heading size="lg" mb={4}>
        🚧 This page is under progress 🚧
        </Heading>
        <Text color="gray.500" fontSize="xl" mb={6}>
          Please check back later!
        </Text>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => (window.location.href = "/")}
        >
          Return to Home
        </Button>
      </Box> */}
      <Box
       textAlign="center"
       py={8}
       px={8}
       display="flex"
       flexDirection="column"
       justifyContent="center"
      //  alignItems="center"
       >
        {/* EtherWorld Advertisement */}
        <Box my={6}>
          <EtherWorldAdCard />
        </Box>
        
        <FactsSection/>
      </Box>
    </AllLayout>
  );
};

export default UnderConstructionPage;
