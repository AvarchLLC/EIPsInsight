import { Box, Container, Heading, Text, VStack, Link, useColorModeValue } from '@chakra-ui/react';
import Head from 'next/head';
import DefaultLayout from '@/components/Layout';

const PrivacyPage = () => {
  const bg = useColorModeValue('white', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  return (
    <DefaultLayout>
      <Head>
        <title>Privacy Policy - EIPs Insights</title>
        <meta name="description" content="Privacy Policy for EIPs Insights platform" />
      </Head>
      
      <Container maxW="4xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Box bg={bg} p={8} borderRadius="lg" shadow="sm">
            <Heading as="h1" size="xl" mb={6} color={useColorModeValue('gray.800', 'white')}>
              Privacy Policy
            </Heading>
            
            <VStack spacing={6} align="stretch" color={textColor}>
              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  Information We Collect
                </Heading>
                <Text>
                  We collect information to provide better services to our users. The types of information we may collect include:
                </Text>
                <Text mt={2}>
                  • <strong>Usage Analytics:</strong> We use Google Analytics to understand how visitors interact with our website
                  <br />
                  • <strong>Technical Information:</strong> Browser type, device information, and IP address
                  <br />
                  • <strong>User Preferences:</strong> Theme settings and cookie preferences stored locally
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  How We Use Your Information
                </Heading>
                <Text>
                  We use the collected information to:
                </Text>
                <Text mt={2}>
                  • Improve our website functionality and user experience
                  <br />
                  • Analyze website traffic and usage patterns
                  <br />
                  • Maintain and optimize our services
                  <br />
                  • Remember your preferences for future visits
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  Cookies and Tracking
                </Heading>
                <Text>
                  Our website uses cookies and similar technologies:
                </Text>
                <Text mt={2}>
                  • <strong>Essential Cookies:</strong> Required for basic website functionality
                  <br />
                  • <strong>Analytics Cookies:</strong> Help us understand how you use our website (Google Analytics)
                  <br />
                  • <strong>Functional Cookies:</strong> Remember your preferences and settings
                </Text>
                <Text mt={3}>
                  You can manage your cookie preferences through our cookie consent banner or your browser settings.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  Third-Party Services
                </Heading>
                <Text>
                  We use Google Analytics to analyze website usage. Google Analytics may collect and process data according to their own privacy policies. You can learn more about Google's privacy practices at{' '}
                  <Link href="https://policies.google.com/privacy" isExternal color="blue.500">
                    https://policies.google.com/privacy
                  </Link>
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  Your Rights
                </Heading>
                <Text>
                  Under GDPR and other privacy laws, you have the right to:
                </Text>
                <Text mt={2}>
                  • Access the personal information we hold about you
                  <br />
                  • Request correction of inaccurate information
                  <br />
                  • Request deletion of your personal information
                  <br />
                  • Withdraw consent for data processing
                  <br />
                  • Object to processing of your personal information
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  Data Retention
                </Heading>
                <Text>
                  We retain information only as long as necessary to provide our services and comply with legal obligations. Analytics data is typically retained for 26 months, and you can request deletion at any time.
                </Text>
              </Box>

              <Box>
                <Heading as="h2" size="lg" mb={3}>
                  Contact Us
                </Heading>
                <Text>
                  If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us through our website or GitHub repository.
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')}>
                  Last updated: {new Date().toLocaleDateString()}
                </Text>
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </DefaultLayout>
  );
};

export default PrivacyPage;