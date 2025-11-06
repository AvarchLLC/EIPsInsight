import React from 'react'
import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
  Image,
  Collapse,
  IconButton,
  useDisclosure,
  Divider,
  Button,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

type Grant = {
  id: string
  title: string
  amount?: string
  startDate?: string
  tags?: string[]
  overview?: string
  milestones?: string
  impact?: string
  description?: string
  logo?: string
  awarded?: boolean
  externalLink?: string
}

const GrantCard: React.FC<{ grant: Grant }> = ({ grant }) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg={grant.awarded ? 'green.50' : undefined}
      borderColor={grant.awarded ? 'green.100' : undefined}
    >
      <Stack direction={["column", "row"]} spacing={4} align="center">
        <Box flexShrink={0}>
          {grant.logo ? (
            <Image
              src={grant.logo}
              alt={`${grant.title} logo`}
              boxSize="64px"
              objectFit="contain"
            />
          ) : (
            <Box
              boxSize="64px"
              bg="gray.100"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" color="gray.500">
                logo
              </Text>
            </Box>
          )}
        </Box>

        <Box flex="1">
          <Stack spacing={1}>
            <Stack direction="row" align="center" justify="space-between">
              <Heading size="md">{grant.title}</Heading>
              <Stack direction="row" align="center" spacing={2}>
                {grant.awarded && (
                  <Badge colorScheme="green">Awarded</Badge>
                )}
                {grant.amount && (
                  <Badge colorScheme={grant.awarded ? 'green' : 'purple'}>
                    {grant.amount}
                  </Badge>
                )}
                {grant.startDate && (
                  <Text fontSize="sm" color="gray.500">
                    Starts {grant.startDate}
                  </Text>
                )}
              </Stack>
            </Stack>

            {grant.tags && (
              <Stack direction="row" spacing={2}>
                {grant.tags.map((t) => (
                  <Badge key={t} variant="subtle">
                    {t}
                  </Badge>
                ))}
              </Stack>
            )}

            {grant.overview && (
              <Text fontSize="sm" color="gray.700">
                {grant.overview}
              </Text>
            )}
          </Stack>
        </Box>
          <Stack spacing={2} align="center">
            {grant.externalLink && (
              <Button
                as={ChakraLink}
                href={grant.externalLink}
                isExternal
                size="sm"
                colorScheme={grant.awarded ? 'green' : 'blue'}
              >
                Learn more
              </Button>
            )}
            <IconButton
              aria-label={isOpen ? 'Collapse details' : 'Expand details'}
              icon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
              onClick={onToggle}
              variant="ghost"
            />
          </Stack>
      </Stack>

      <Collapse in={isOpen} animateOpacity>
        <Divider my={4} />
        <Stack spacing={3}>
          {grant.milestones && (
            <Box>
              <Heading size="sm">Milestones & Updates</Heading>
              <Text fontSize="sm" color="gray.700">
                {grant.milestones}
              </Text>
            </Box>
          )}

          {grant.impact && (
            <Box>
              <Heading size="sm">Impact Criteria</Heading>
              <Text fontSize="sm" color="gray.700">
                {grant.impact}
              </Text>
            </Box>
          )}

          {grant.description && (
            <Box>
              <Heading size="sm">Grant Description</Heading>
              <Text fontSize="sm" color="gray.700">
                {grant.description}
              </Text>
            </Box>
          )}
        </Stack>
      </Collapse>
    </Box>
  )
}

export default GrantCard
