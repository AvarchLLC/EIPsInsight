import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  IconButton,
  Badge,
  Box,
  LinkBox,
  LinkOverlay,
  chakra,
} from "@chakra-ui/react";
import { FiExternalLink, FiCopy } from "react-icons/fi";

interface DeclinedEIPCardProps {
  eip: {
    id: string;
    title: string;
    description: string;
    link?: string;
  };
}

export default function DeclinedEIPCard({ eip }: DeclinedEIPCardProps) {
  // Color tokens for light/dark
  const bg = useColorModeValue("white", "gray.800");
  const accent = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("blue.400", "blue.600");
  const shadow = useColorModeValue("md", "dark-lg");
  const headerColor = useColorModeValue("blue.800", "blue.100");
  const descriptionColor = useColorModeValue("gray.600", "gray.400");
  const badgeBg = useColorModeValue("red.100", "red.700");
  const badgeColor = useColorModeValue("red.600", "red.200");

  return (
    <LinkBox
      as={Card}
      background={bg}
      borderRadius="xl"
      borderLeft="6px solid"
      borderColor={borderColor}
      boxShadow={shadow}
      minH={40}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p={5}
      transition="all 0.2s"
      cursor="pointer"
      _hover={{
        boxShadow: "0 6px 24px 0 rgba(0,0,0,0.18), 0 2px 4px 0 rgba(0,0,0,0.07)",
        transform: "translateY(-3px) scale(1.025)",
        bg: useColorModeValue("blue.50", "gray.700"),
      }}
    >
      <CardHeader p={0} mb={2}>
        <Flex justify="space-between" align="center">
          <Heading
            size="sm"
            color={headerColor}
            fontWeight="bold"
            lineHeight={1.3}
            noOfLines={2}
          >
            <Box as="span" color={accent} fontWeight="extrabold" mr={2}>
              {eip.id}
            </Box>
            {eip.title}
          </Heading>
          <Badge
            bg={badgeBg}
            color={badgeColor}
            px={2}
            py={0.5}
            borderRadius="md"
            fontSize="0.82em"
            fontWeight="semibold"
            boxShadow="sm"
          >
            Declined
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody p={0} mb={4}>
        <Text color={descriptionColor} fontSize="sm" noOfLines={3}>
          {eip.description}
        </Text>
      </CardBody>
      <Box mt="auto">
        <Flex align="center" gap={2}>
          <LinkOverlay href={eip.link} isExternal _hover={{ textDecor: "underline" }}>
            <chakra.span fontWeight="medium" color={accent}>
              Read Discussion
            </chakra.span>
          </LinkOverlay>
          <IconButton
            as="a"
            href={eip.link}
            aria-label="Open EIP Spec"
            icon={<FiExternalLink />}
            target="_blank"
            size="sm"
            colorScheme="blue"
            variant="ghost"
          />
        </Flex>
      </Box>
    </LinkBox>
  );
}
