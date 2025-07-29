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
import { FiExternalLink, FiCopy } from "react-icons/fi"; // Example icons

interface DeclinedEIPCardProps {
  eip: {
    id: string;
    title: string;
    description: string;
    link?: string;
  };
}

export default function DeclinedEIPCard({ eip }: DeclinedEIPCardProps ) {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const border = useColorModeValue("blue.200", "blue.700");
  const hoverShadow = useColorModeValue("lg", "xl");

  return (
    <LinkBox
      as={Card}
      background={bg}
      borderLeft="4px solid"
      borderColor={border}
      borderRadius="lg"
      boxShadow="md"
      mb={0}
      h="100%"
      transition="box-shadow 0.18s, transform 0.18s"
      _hover={{
        boxShadow: hoverShadow,
        transform: "translateY(-2px) scale(1.02)",
      }}
      cursor="pointer"
      p={4}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <CardHeader p={0} mb={2}>
        <Flex justify="space-between" align="center">
          <Heading size="sm" color="blue.700" noOfLines={2}>
            <Box as="span" color="gray.500" fontWeight="normal" mr={2}>
              {eip.id}
            </Box>
            {eip.title}
          </Heading>
          <Badge colorScheme="red" ml={2} fontSize="0.8em">
            Declined
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody p={0} mb={4}>
        <Text color="gray.700" noOfLines={3}>{eip.description}</Text>
      </CardBody>
      {/* LinkOverlay makes the whole card clickable */}
      <Box mt="auto">
        <Flex align="center" gap={2}>
          <LinkOverlay href={eip.link} isExternal _hover={{ textDecor: "underline" }}>
            <chakra.span color="blue.600" fontWeight="medium">
              Discussion
            </chakra.span>
          </LinkOverlay>
          <IconButton
            as="a"
            href={eip.link}
            aria-label="Spec"
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