import { Box, Container, VStack, Heading, Text, Button, Alert, AlertIcon, Badge } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function UpgradePage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Container maxW="2xl" py={20}>
      <VStack spacing={8} textAlign="center">
        <Box>
          <Heading size="xl" color="blue.500" mb={4}>
            Premium Feature
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Upgrade your account to access this premium feature.
          </Text>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box textAlign="left">
            <Text fontWeight="semibold">Premium Access Required</Text>
            <Text fontSize="sm" mt={1}>
              This feature is available for Premium users and above. 
              {session?.user && (
                <span> Your current tier: <Badge colorScheme="gray">{session.user.tier}</Badge></span>
              )}
            </Text>
          </Box>
        </Alert>

        {/* Pricing Tiers */}
        <Box w="full" maxW="4xl">
          <VStack spacing={6}>
            <Heading size="md" mb={4}>Choose Your Plan</Heading>
            
            <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6} w="full">
              {/* Pro Plan */}
              <Box p={6} border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
                <VStack spacing={4}>
                  <Badge colorScheme="blue" fontSize="sm">Pro</Badge>
                  <Heading size="lg">$9/month</Heading>
                  <VStack spacing={2} fontSize="sm" color="gray.600">
                    <Text>✓ Create up to 10 blogs/month</Text>
                    <Text>✓ AI writing assistance</Text>
                    <Text>✓ Export capabilities</Text>
                    <Text>✓ Priority support</Text>
                  </VStack>
                  <Button colorScheme="blue" size="sm">
                    Upgrade to Pro
                  </Button>
                </VStack>
              </Box>

              {/* Premium Plan */}
              <Box p={6} border="2px" borderColor="blue.500" borderRadius="lg" bg="blue.50" position="relative">
                <Badge position="absolute" top="-12px" left="50%" transform="translateX(-50%)" colorScheme="blue">
                  Most Popular
                </Badge>
                <VStack spacing={4}>
                  <Badge colorScheme="blue" fontSize="sm">Premium</Badge>
                  <Heading size="lg">$19/month</Heading>
                  <VStack spacing={2} fontSize="sm" color="gray.600">
                    <Text>✓ Create up to 20 blogs/month</Text>
                    <Text>✓ Advanced AI features</Text>
                    <Text>✓ Analytics dashboard</Text>
                    <Text>✓ Custom themes</Text>
                    <Text>✓ Priority support</Text>
                  </VStack>
                  <Button colorScheme="blue" size="sm">
                    Upgrade to Premium
                  </Button>
                </VStack>
              </Box>

              {/* Enterprise Plan */}
              <Box p={6} border="1px" borderColor="gray.200" borderRadius="lg" bg="white">
                <VStack spacing={4}>
                  <Badge colorScheme="purple" fontSize="sm">Enterprise</Badge>
                  <Heading size="lg">$49/month</Heading>
                  <VStack spacing={2} fontSize="sm" color="gray.600">
                    <Text>✓ Unlimited blogs</Text>
                    <Text>✓ Team collaboration</Text>
                    <Text>✓ Advanced analytics</Text>
                    <Text>✓ Custom integrations</Text>
                    <Text>✓ Dedicated support</Text>
                  </VStack>
                  <Button colorScheme="purple" size="sm">
                    Contact Sales
                  </Button>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </Box>

        <VStack spacing={4} w="full">
          <Button variant="ghost" onClick={() => router.back()}>
            Go Back
          </Button>
          
          <Button variant="ghost" onClick={() => router.push('/')}>
            Go Home
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}