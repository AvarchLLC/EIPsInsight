import { Box, Grid, Flex, Text, Heading, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface FactCardProps {
  title: string;
  content: string;
}

const FactCard: FC<FactCardProps> = ({ title, content }) => {
    const bg = useColorModeValue("#F5F5F5", "#171923");
  
    return (
      <Box
        border="2px solid"
        borderColor="#30A0E0"
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg={bg}
        textAlign="center"
        transition="all 0.3s"
        _hover={{
          bg: "#E0F7FA",
          transform: "scale(1.05)",
          shadow: "lg",
        }}
      >
        <Text 
          fontSize={{ base: "md", md: "lg" }} 
          fontWeight="bold" 
          color="#30A0E0" 
          mb={2} 
          whiteSpace="normal" // Allow wrapping
        >
          {title}
        </Text>
        <Text 
          fontSize={{ base: "sm", md: "md" }} 
          color="gray.500" 
          textAlign="justify" 
          whiteSpace="normal" // Allow wrapping
        >
          {content}
        </Text>
      </Box>
    );
  };
  
  

const FactsSection: FC = () => {
  const headingColorLight = "#333";
  const headingColorDark = "#F5F5F5";

  const facts = [
    { title: "📊 Over 1,700 EIPs submitted since launch.", content: "As of late 2024, there have been more than 1,700 EIPs submitted since the launch of the Ethereum network, though many are still in various stages of development, while some have been rejected or withdrawn." },
    { title: "🏆 Only About 10% of EIPs Are Finalized", content: "Out of all the EIPs proposed, only about 10% ever reach the “Final” status. This is because the review process is thorough, and proposals often need significant community and developer support to be implemented." },
    { title: "📜 Meta EIPs Are the Smallest Category", content: "Meta EIPs, which cover processes, standards, or governance, make up the smallest proportion of all EIPs—less than 5%. Most EIPs are focused on standards (e.g., ERCs) or protocol changes." },
    { title: "👥 EIP-1 Has over 200 Contributors", content: "EIP-1, the very first EIP and the template for all future proposals, has been collaboratively updated and edited by more than 200 contributors to keep it relevant and accurate as the Ethereum ecosystem evolves." },
    { title: "🔢 Highest Numbered EIP", content: "The highest numbered EIP in the repository as of now is beyond 5,000, even though many proposals between EIP-1 and the highest number have been abandoned or withdrawn." },
    { title: "⏳ Longest Time to Finalize", content: "Some EIPs take years to finalize. EIP-1559, which introduced a major fee model change, was proposed in 2019 but was only implemented in 2021 during the London hard fork—two years later." },
    { title: "📏 Shortest EIP Length", content: "The shortest EIP by word count is under 150 words. These short EIPs typically focus on simple, yet impactful, technical changes or clarifications that don’t require extensive explanation." },
    { title: "🥇 EIP-20 Was Not the First ERC Proposal", content: "Although ERC-20 is the most famous and widely used EIP standard for tokens, it was not the first ERC proposal; ERC-1 is actually EIP-1, which is the template." },
    { title: "📅 EIP Editors Manage Over 100 Proposals Annually", content: "The small team of EIP editors collectively manages over 100 proposals annually, ensuring they meet formatting guidelines, providing feedback, and guiding them through the review process." },
    { title: "💬 Most Discussed EIP in Ethereum’s History", content: "EIP-1559 holds the record for the most discussions, comments, and debates on Ethereum forums, GitHub, and community calls. Its impact on Ethereum’s economics and user experience made it one of the most hotly debated EIPs ever." },
  ];

  const funFacts = [
    { title: "🔄 EIP Numbers Aren’t Sequential", content: `Even though EIP numbers are assigned sequentially, they don’t always get finalized in that order. It’s like the EIP version of "musical chairs"—some early numbers remain open while higher numbers get approved faster!` },
    { title: "💀 The “EIP Graveyard” Exists", content: "There are over 500 EIPs that have been rejected, withdrawn, or marked as stagnant, unofficially forming an “EIP Graveyard.” It’s a reminder that not every idea makes it, but all have their place in Ethereum history." },
    { title: "👻 EIP-0 Doesn’t Exist", content: "Despite the numbering starting at 1, there is no EIP-0. It’s like the ghost proposal, implying maybe even Ethereum itself needed a warm-up round before diving into real improvements!" },
    { title: "🍕 The Most Cloned EIP", content: "EIP-20, the ERC-20 token standard, has become a template for hundreds of other EIPs and smart contracts. It’s like the “pizza base” of Ethereum—simple but customizable to create an entire ecosystem of tokens!" },
    { title: "📊 ERCs Outnumber Protocol EIPs 3 to 1", content: "ERCs (Ethereum Request for Comments) make up the bulk of EIPs, outnumbering protocol-level proposals by almost 3 to 1. Seems like everyone loves creating new token standards and applications rather than diving deep into the core protocol." },
    { title: "🎩 Longest EIP Title Ever", content: "EIP-2020: “Guidelines for Scheduling Hard Forks in an Emergency Scenario (Code Red Situations)” is one of the longest EIP titles. It sounds more like a spy mission than a blockchain proposal!" },
    { title: "🐱 EIP-721 Turned Cats into Digital Gold", content: "EIP-721, which defined the non-fungible token (NFT) standard, indirectly made digital cats (CryptoKitties) some of the most valuable collectibles on Ethereum. A proposal about token uniqueness ended up creating a billion-dollar market for JPEGs!" },
    { title: "📏 The Shortest EIP Description", content: "EIP-9 has one of the shortest descriptions in history: “Deprecate Ethash.” Sometimes, brevity is the soul of wit—or just a very direct way to state a problem!" },
    { title: "🧛 The Vampire EIP", content: "EIP-2982 introduced a staking mechanism for Ethereum 2.0, and some in the community jokingly called it the “vampire EIP” because it “sucks up” Ethereum to stake it, keeping it locked away for validation rewards." },
    { title: "💎 Underrated ERC-777", content: "ERC-777 was created to improve upon the ERC-20 standard, offering features like better security and advanced token functionality. Ironically, despite its advanced design, it remains much less popular than the classic ERC-20, which is the “grandparent” everyone still prefers!" },
  ];

  return (
    <Box py={10} textAlign="center" px={4}>
      <Heading
        fontWeight="bold"
        fontSize={{ base: "2xl", md: "4xl" }}
        color={useColorModeValue(headingColorLight, headingColorDark)}
        mb={6}
      >
        🌟 Cool EIP Facts 🌟
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={10}>
        {facts.map((fact, index) => (
          <FactCard key={index} title={fact.title} content={fact.content} />
        ))}
      </Grid>

      <Heading
        fontWeight="bold"
        fontSize={{ base: "2xl", md: "4xl" }}
        color={useColorModeValue(headingColorLight, headingColorDark)}
        mb={6}
      >
        😄 Fun EIP Facts 😄
      </Heading>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {funFacts.map((fact, index) => (
          <FactCard key={index} title={fact.title} content={fact.content} />
        ))}
      </Grid>
    </Box>
  );
};

export default FactsSection;
