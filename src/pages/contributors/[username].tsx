import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Avatar,
  Badge,
  Flex,
  Spinner,
  useColorModeValue,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
  Button,
  Select,
  Divider,
  Link,
  Icon,
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { FiGithub, FiTwitter, FiExternalLink } from "react-icons/fi";
import type { Contributor, Activity } from "@/types/contributors";
import { ActivityCard } from "@/components/ActivityCard";

export default function ContributorDetailPage() {
  const router = useRouter();
  const { username } = router.query;

  const [contributor, setContributor] = useState<Contributor | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [activityType, setActivityType] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    if (username) {
      fetchContributor();
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchActivities();
    }
  }, [username, selectedRepo, activityType, page]);

  const fetchContributor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contributors/list?search=${username}&limit=1`);
      const data = await response.json();
      
      if (data.contributors && data.contributors.length > 0) {
        setContributor(data.contributors[0]);
      }
    } catch (error) {
      console.error("Failed to fetch contributor:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      const params = new URLSearchParams({
        username: username as string,
        page: page.toString(),
        limit: "30",
      });

      if (selectedRepo) params.append("repository", selectedRepo);
      if (activityType) params.append("activityType", activityType);

      const response = await fetch(`/api/contributors/timeline?${params}`);
      const data = await response.json();

      setActivities(data.activities || []);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <Flex justify="center" py={20}>
            <Spinner size="xl" />
          </Flex>
        </Container>
      </Box>
    );
  }

  if (!contributor) {
    return (
      <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
        <Container maxW="container.xl">
          <Card>
            <CardBody>
              <Text textAlign="center" py={8}>
                Contributor not found
              </Text>
              <Flex justify="center">
                <NextLink href="/contributors" passHref legacyBehavior>
                  <Button as="a">Back to Contributors</Button>
                </NextLink>
              </Flex>
            </CardBody>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Button
            as={NextLink}
            href="/contributors"
            variant="ghost"
            alignSelf="flex-start"
          >
            ← Back to Contributors
          </Button>

          <Card>
            <CardBody>
              <Flex gap={6} align="start" direction={{ base: "column", md: "row" }}>
                <Avatar
                  src={contributor.avatarUrl}
                  name={contributor.username}
                  size="2xl"
                />
                <VStack align="start" flex={1} spacing={4}>
                  <Box>
                    <Heading size="xl">{contributor.username}</Heading>
                    {contributor.name && (
                      <Text fontSize="lg" color="gray.500">
                        {contributor.name}
                      </Text>
                    )}
                  </Box>

                  {contributor.bio && (
                    <Text color="gray.600">{contributor.bio}</Text>
                  )}

                  <HStack spacing={4} flexWrap="wrap">
                    {contributor.company && (
                      <Badge colorScheme="blue" px={3} py={1}>
                        🏢 {contributor.company}
                      </Badge>
                    )}
                    {contributor.location && (
                      <Badge colorScheme="green" px={3} py={1}>
                        📍 {contributor.location}
                      </Badge>
                    )}
                  </HStack>

                  <HStack spacing={4}>
                    <Link
                      href={`https://github.com/${contributor.username}`}
                      isExternal
                    >
                      <Button leftIcon={<Icon as={FiGithub} />} size="sm">
                        GitHub
                      </Button>
                    </Link>
                    {contributor.twitterUsername && (
                      <Link
                        href={`https://twitter.com/${contributor.twitterUsername}`}
                        isExternal
                      >
                        <Button leftIcon={<Icon as={FiTwitter} />} size="sm">
                          Twitter
                        </Button>
                      </Link>
                    )}
                    {contributor.blog && (
                      <Link href={contributor.blog} isExternal>
                        <Button
                          leftIcon={<Icon as={FiExternalLink} />}
                          size="sm"
                        >
                          Website
                        </Button>
                      </Link>
                    )}
                  </HStack>
                </VStack>

                <VStack align="end">
                  <Badge colorScheme="purple" fontSize="2xl" px={4} py={2}>
                    {contributor.totalScore}
                  </Badge>
                  <Text fontSize="sm" color="gray.500">
                    Total Score
                  </Text>
                </VStack>
              </Flex>
            </CardBody>
          </Card>

          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total Activities</StatLabel>
                  <StatNumber>{contributor.totalActivities}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Repositories</StatLabel>
                  <StatNumber>{contributor.repositories.length}</StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>First Activity</StatLabel>
                  <StatNumber fontSize="md">
                    {contributor.firstActivityAt
                      ? formatDate(contributor.firstActivityAt).split(",")[0]
                      : "N/A"}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Last Activity</StatLabel>
                  <StatNumber fontSize="md">
                    {contributor.lastActivityAt
                      ? formatDate(contributor.lastActivityAt).split(",")[0]
                      : "N/A"}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </Grid>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Repository Breakdown
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                {contributor.repositoryStats.map((stat) => (
                  <Box
                    key={stat.repository}
                    p={4}
                    borderWidth={1}
                    borderColor={borderColor}
                    borderRadius="md"
                  >
                    <Text fontWeight="bold" mb={2}>
                      {stat.repository.split("/")[1]}
                    </Text>
                    <VStack align="start" spacing={1} fontSize="sm">
                      <Text>Score: {stat.score}</Text>
                      <Text>Commits: {stat.commits}</Text>
                      <Text>Pull Requests: {stat.pullRequests}</Text>
                      <Text>Reviews: {stat.reviews}</Text>
                      <Text>Comments: {stat.comments}</Text>
                    </VStack>
                  </Box>
                ))}
              </Grid>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                Activity Timeline
              </Heading>

              <HStack spacing={4} mb={4}>
                <Select
                  value={selectedRepo}
                  onChange={(e) => {
                    setSelectedRepo(e.target.value);
                    setPage(1);
                  }}
                  placeholder="All Repositories"
                >
                  {contributor.repositories.map((repo) => (
                    <option key={repo} value={repo}>
                      {repo.split("/")[1]}
                    </option>
                  ))}
                </Select>

                <Select
                  value={activityType}
                  onChange={(e) => {
                    setActivityType(e.target.value);
                    setPage(1);
                  }}
                  placeholder="All Activity Types"
                >
                  <option value="COMMIT">Commits</option>
                  <option value="PR_OPENED">PR Opened</option>
                  <option value="PR_MERGED">PR Merged</option>
                  <option value="REVIEW_APPROVED">Review Approved</option>
                  <option value="REVIEW_COMMENTED">Review Commented</option>
                  <option value="ISSUE_COMMENT">Issue Comments</option>
                  <option value="PR_COMMENT">PR Comments</option>
                </Select>
              </HStack>

              {activitiesLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner size="lg" />
                </Flex>
              ) : activities.length === 0 ? (
                <Text textAlign="center" py={8} color="gray.500">
                  No activities found
                </Text>
              ) : (
                <>
                  <VStack spacing={3} align="stretch">
                    {activities.map((activity) => (
                      <ActivityCard key={activity._id} activity={activity} />
                    ))}
                  </VStack>

                  <Flex justify="center" gap={4} mt={6}>
                    <Button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      isDisabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Text alignSelf="center">Page {page}</Text>
                    <Button
                      onClick={() => setPage((p) => p + 1)}
                      isDisabled={!hasMore}
                    >
                      Next
                    </Button>
                  </Flex>
                </>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
