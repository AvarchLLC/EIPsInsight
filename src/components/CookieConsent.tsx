'use client';

import {
  Box,
  Button,
  Text,
  HStack,
  VStack,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    functional: false,
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Theme colors matching EIPs Insight
  const bannerBg = useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)');
  const bannerBorder = useColorModeValue('gray.200', 'gray.600');
  const bannerShadow = useColorModeValue('0 2px 20px rgba(0,0,0,0.15)', '0 2px 20px rgba(0,0,0,0.5)');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const buttonBg = useColorModeValue('blue.500', 'blue.400');

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('eips-insight-cookie-consent');
    
    if (!consent) {
      // Show banner after 1 second delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    const fullConsent = { necessary: true, analytics: true, functional: true };
    setPreferences(fullConsent);
    saveCookiePreferences(fullConsent);
    setShowBanner(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly = { necessary: true, analytics: false, functional: false };
    setPreferences(necessaryOnly);
    saveCookiePreferences(necessaryOnly);
    setShowBanner(false);
  };

  const saveCustomPreferences = () => {
    saveCookiePreferences(preferences);
    setShowBanner(false);
    onClose();
  };

  const saveCookiePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('eips-insight-cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('eips-insight-consent-date', new Date().toISOString());
    
    // Initialize/disable Google Analytics based on consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      if (prefs.analytics) {
        // Enable Google Analytics
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      } else {
        // Disable Google Analytics
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99999, // Increased z-index
            }}
          >
            <Box
              bg={bannerBg}
              borderTop="1px"
              borderColor={bannerBorder}
              boxShadow={bannerShadow}
              p={4}
              backdropFilter="blur(10px)"
            >
              <VStack spacing={3} maxW="6xl" mx="auto">
                <Text color={textColor} fontSize="sm" textAlign="center">
                  🍪 We use cookies to enhance your experience. Our site uses necessary cookies for basic functionality and optional analytics cookies to understand how you use EIPs Insight.{' '}
                  <Link color="blue.500" href="/privacy" isExternal>
                    Learn more in our Privacy Policy
                  </Link>
                </Text>
                
                <HStack spacing={3} flexWrap="wrap" justify="center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={acceptNecessary}
                    colorScheme="gray"
                  >
                    Necessary Only
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onOpen}
                    colorScheme="blue"
                  >
                    Customize
                  </Button>
                  
                  <Button
                    size="sm"
                    bg={buttonBg}
                    color="white"
                    onClick={acceptAll}
                    _hover={{ opacity: 0.9 }}
                  >
                    Accept All
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Cookie Preferences</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color={textColor}>
                Manage your cookie preferences for EIPs Insight. You can change these settings at any time.
              </Text>

              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <Box flex="1">
                  <FormLabel mb="0" fontWeight="semibold">
                    Necessary Cookies
                  </FormLabel>
                  <Text fontSize="xs" color={textColor}>
                    Required for basic site functionality, authentication, and security.
                  </Text>
                </Box>
                <Switch
                  isChecked={preferences.necessary}
                  isDisabled={true} // Always required
                  colorScheme="blue"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <Box flex="1">
                  <FormLabel mb="0" fontWeight="semibold">
                    Analytics Cookies
                  </FormLabel>
                  <Text fontSize="xs" color={textColor}>
                    Help us understand how you use EIPs Insight to improve the platform.
                  </Text>
                </Box>
                <Switch
                  isChecked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  colorScheme="blue"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" justifyContent="space-between">
                <Box flex="1">
                  <FormLabel mb="0" fontWeight="semibold">
                    Functional Cookies
                  </FormLabel>
                  <Text fontSize="xs" color={textColor}>
                    Remember your preferences and enhance your experience.
                  </Text>
                </Box>
                <Switch
                  isChecked={preferences.functional}
                  onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                  colorScheme="blue"
                />
              </FormControl>

              <HStack spacing={3} justify="flex-end" mt={6}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={saveCustomPreferences}>
                  Save Preferences
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CookieConsent;