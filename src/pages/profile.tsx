import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { withAuth } from '@/components/auth/WithAuth';
import { useUserStore } from '@/stores/userStore';
import { 
  User, 
  Edit, 
  Save, 
  Mail, 
  Globe, 
  MapPin,  
  Twitter, 
  Linkedin,
  Shield,
  Zap
} from 'react-feather';
import { Building, Crown,  } from 'lucide-react';

interface ProfileFormData {
  name: string;
  bio: string;
  website: string;
  twitter: string;
  github: string;
  linkedin: string;
  location: string;
  company: string;
  isPublic: boolean;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    location: '',
    company: '',
    isPublic: false,
    emailNotifications: true,
    theme: 'system',
    language: 'en'
  });

  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        bio: session.user.profile?.bio || '',
        website: session.user.profile?.website || '',
        twitter: session.user.profile?.twitter || '',
        github: session.user.profile?.github || '',
        linkedin: session.user.profile?.linkedin || '',
        location: session.user.profile?.location || '',
        company: session.user.profile?.company || '',
        isPublic: session.user.profile?.isPublic || false,
        emailNotifications: session.user.settings?.emailNotifications || true,
        theme: session.user.settings?.theme || 'system',
        language: session.user.settings?.language || 'en'
      });
    }
  }, [session]);

  const handleInputChange = (field: keyof ProfileFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const profileData = {
        name: formData.name,
        profile: {
          bio: formData.bio,
          website: formData.website,
          twitter: formData.twitter,
          github: formData.github,
          linkedin: formData.linkedin,
          location: formData.location,
          company: formData.company,
          isPublic: formData.isPublic
        },
        settings: {
          emailNotifications: formData.emailNotifications,
          theme: formData.theme,
          language: formData.language
        }
      };

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated',
          status: 'success',
          duration: 3000,
          isClosable: true
        });
        setIsEditing(false);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Could not update your profile',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Shield size={20} />;
      case 'moderator':
        return <User size={20} />;
      case 'premium_user':
        return <Crown size={20} />;
      default:
        return <User size={20} />;
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'moderator':
        return 'purple';
      case 'premium_user':
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Box bg={bg} minH="100vh" py={8}>
      <Container maxW="4xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardBody>
              <Flex justify="space-between" align="start">
                <HStack spacing={6}>
                  <Avatar
                    size="2xl"
                    name={session.user.name || session.user.email || 'User'}
                    src={session.user.image || undefined}
                    border="4px solid"
                    borderColor={borderColor}
                  />
                  <VStack align="start" spacing={2}>
                    <Heading size="lg">{session.user.name || 'User'}</Heading>
                    <Text color="gray.500">{session.user.email}</Text>
                    <HStack spacing={2}>
                      <Badge
                        colorScheme={getRoleBadgeColor(session.user.role)}
                        size="md"
                        variant="subtle"
                      >
                        <HStack spacing={1}>
                          {getRoleIcon(session.user.role)}
                          <Text>{session.user.role || 'user'}</Text>
                        </HStack>
                      </Badge>
                      <Badge colorScheme="blue" size="md" variant="outline">
                        <HStack spacing={1}>
                          <Zap size={14} />
                          <Text>{session.user.tier || 'Free'}</Text>
                        </HStack>
                      </Badge>
                      {session.user.isVerified && (
                        <Badge colorScheme="green" size="md">Verified</Badge>
                      )}
                    </HStack>
                  </VStack>
                </HStack>
                <Button
                  leftIcon={<Edit size={16} />}
                  colorScheme="blue"
                  variant={isEditing ? "solid" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </Flex>
            </CardBody>
          </Card>

          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Blogs Created</StatLabel>
                  <StatNumber>{session.user.stats?.blogsCreated || 0}</StatNumber>
                  <StatHelpText>Total published blogs</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Feedback Given</StatLabel>
                  <StatNumber>{session.user.stats?.feedbackGiven || 0}</StatNumber>
                  <StatHelpText>Community contributions</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
            <Card bg={cardBg} borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel>Member Since</StatLabel>
                  <StatNumber>
                    {session.user.profile?.joinedAt 
                      ? new Date(session.user.profile.joinedAt).toLocaleDateString()
                      : 'Recently'
                    }
                  </StatNumber>
                  <StatHelpText>Account created</StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Profile Information */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Profile Information</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Display Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    isReadOnly={!isEditing}
                    variant={isEditing ? "outline" : "filled"}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    isReadOnly={!isEditing}
                    variant={isEditing ? "outline" : "filled"}
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                      isReadOnly={!isEditing}
                      variant={isEditing ? "outline" : "filled"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Company</FormLabel>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company name"
                      isReadOnly={!isEditing}
                      variant={isEditing ? "outline" : "filled"}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    isReadOnly={!isEditing}
                    variant={isEditing ? "outline" : "filled"}
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel>GitHub</FormLabel>
                    <Input
                      value={formData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      placeholder="username"
                      isReadOnly={!isEditing}
                      variant={isEditing ? "outline" : "filled"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Twitter</FormLabel>
                    <Input
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="@username"
                      isReadOnly={!isEditing}
                      variant={isEditing ? "outline" : "filled"}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>LinkedIn</FormLabel>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="username"
                      isReadOnly={!isEditing}
                      variant={isEditing ? "outline" : "filled"}
                    />
                  </FormControl>
                </SimpleGrid>

                {isEditing && (
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="public-profile" mb="0">
                      Make profile public
                    </FormLabel>
                    <Switch
                      id="public-profile"
                      isChecked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    />
                  </FormControl>
                )}
              </VStack>
            </CardBody>
          </Card>

          {/* Settings */}
          <Card bg={cardBg} borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Preferences</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="email-notifications" mb="0" flex="1">
                    Email Notifications
                  </FormLabel>
                  <Switch
                    id="email-notifications"
                    isChecked={formData.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    isDisabled={!isEditing}
                  />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Theme</FormLabel>
                    <Select
                      value={formData.theme}
                      onChange={(e) => handleInputChange('theme', e.target.value)}
                      isDisabled={!isEditing}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Language</FormLabel>
                    <Select
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      isDisabled={!isEditing}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <Button
              leftIcon={<Save size={16} />}
              colorScheme="blue"
              size="lg"
              onClick={handleSave}
              isLoading={isLoading}
              loadingText="Saving..."
            >
              Save Changes
            </Button>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default withAuth({
  children: <ProfilePage />,
  requireAuth: true
});