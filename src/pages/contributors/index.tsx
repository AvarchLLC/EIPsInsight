import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Select,
  Button,
  Grid,
  Avatar,
  Badge,
  Flex,
  Spinner,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Card,
  CardBody,
  Link,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { Contributor } from "@/types/contributors";

interface ContributorStats {
  totalContributors: number;
  activeContributors: number;
  totalActivities: number;
  repositoryBreakdown: {
    repository: string;
    contributors: number;
    activities: number;
  }[];
  topContributors: any[];
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}

const REPOSITORIES = [
  { value: "", label: "All Repositories" },
  { value: "ethereum/EIPs", label: "EIPs" },
  { value: "ethereum/ERCs", label: "ERCs" },
  { value: "ethereum/RIPs", label: "RIPs" },
];

const SORT_OPTIONS = [
  { value: "totalScore", label: "Activity Score" },
  { value: "totalActivities", label: "Total Activities" },
  { value: "lastActivityAt", label: "Recent Activity" },
];

export default function ContributorsPage() {
  const router = useRouter();
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [stats, setStats] = useState<ContributorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("");
  const [sortBy, setSortBy] = useState("totalScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchContributors();
  }, [searchTerm, selectedRepo, sortBy, sortOrder, page]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch("/api/contributors/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchContributors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        sortBy,
        sortOrder,
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedRepo) params.append("repository", selectedRepo);

      const response = await fetch(`/api/contributors/list?${params}`);
      const data = await response.json();

      setContributors(data.contributors || []);
      setHasMore(data.hasMore || false);
    } catch (error) {
      console.error("Failed to fetch contributors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRepo(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setPage(1);
  };

  const getRepoScore = (contributor: Contributor, repo: string) => {
    if (!repo) return contributor.totalScore;
    const repoStat = contributor.repositoryStats?.find(
      (s) => s.repository === repo
    );
    return repoStat?.score || 0;
  };

  const getRepoActivities = (contributor: Contributor, repo: string) => {
    if (!repo) return contributor.totalActivities;
    const repoStat = contributor.repositoryStats?.find(
      (s) => s.repository === repo
    );
    return (
      (repoStat?.commits || 0) +
      (repoStat?.pullRequests || 0) +
      (repoStat?.reviews || 0) +
      (repoStat?.comments || 0)
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh" py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading size="2xl" mb={2}>
              Contributors
            </Heading>
            <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
              Discover top contributors across ethereum/EIPs, ethereum/ERCs, and
              ethereum/RIPs repositories
            </Text>
          </Box>

          {statsLoading ? (
            <Flex justify="center" py={4}>
              <Spinner size="lg" />
            </Flex>
          ) : stats ? (
            <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Contributors</StatLabel>
                    <StatNumber>{stats.totalContributors}</StatNumber>
                    <StatHelpText>Across all repositories</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Active Contributors</StatLabel>
                    <StatNumber>{stats.activeContributors}</StatNumber>
                    <StatHelpText>Last 30 days</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Total Activities</StatLabel>
                    <StatNumber>
                      {stats.totalActivities.toLocaleString()}
                    </StatNumber>
                    <StatHelpText>Commits, PRs, reviews</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Recent Activity</StatLabel>
                    <StatNumber>{stats.recentActivity.last24h}</StatNumber>
                    <StatHelpText>Last 24 hours</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </Grid>
          ) : null}

          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search contributors by username or name..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>

                <HStack spacing={4}>
                  <Select value={selectedRepo} onChange={handleRepoChange}>
                    {REPOSITORIES.map((repo) => (
                      <option key={repo.value} value={repo.value}>
                        {repo.label}
                      </option>
                    ))}
                  </Select>

                  <Select value={sortBy} onChange={handleSortChange}>
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>

                  <Button onClick={toggleSortOrder} minW="100px">
                    {sortOrder === "desc" ? "↓ Desc" : "↑ Asc"}
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {loading ? (
            <Flex justify="center" py={8}>
              <Spinner size="xl" />
            </Flex>
          ) : contributors.length === 0 ? (
            <Card>
              <CardBody>
                <Text textAlign="center" py={8} color="gray.500">
                  No contributors found matching your criteria
                </Text>
              </CardBody>
            </Card>
          ) : (
            <>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                {contributors.map((contributor, index) => (
                  <Card
                    key={contributor._id}
                    _hover={{ bg: hoverBg, transform: "translateY(-2px)" }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={() => router.push(`/contributors/${contributor.username}`)}
                  >
                    <CardBody>
                      <Flex gap={4} align="start">
                        <Avatar
                          src={contributor.avatarUrl}
                          name={contributor.username}
                          size="lg"
                        />
                        <Box flex={1}>
                          <HStack justify="space-between" mb={2}>
                            <Box>
                              <Heading size="md">{contributor.username}</Heading>
                              {contributor.name && (
                                <Text color="gray.500" fontSize="sm">
                                  {contributor.name}
                                </Text>
                              )}
                            </Box>
                            <Badge colorScheme="blue" fontSize="lg" px={3} py={1}>
                              {getRepoScore(contributor, selectedRepo)}
                            </Badge>
                          </HStack>

                          {contributor.bio && (
                            <Text fontSize="sm" color="gray.600" noOfLines={2} mb={2}>
                              {contributor.bio}
                            </Text>
                          )}

                          <HStack spacing={4} fontSize="sm" color="gray.600" mb={2}>
                            {contributor.company && (
                              <Text>🏢 {contributor.company}</Text>
                            )}
                            {contributor.location && (
                              <Text>📍 {contributor.location}</Text>
                            )}
                          </HStack>

                          <Flex gap={2} flexWrap="wrap" mb={2}>
                            {contributor.repositories.map((repo) => (
                              <Badge key={repo} colorScheme="purple" fontSize="xs">
                                {repo.split("/")[1]}
                              </Badge>
                            ))}
                          </Flex>

                          <Divider my={2} />

                          <HStack spacing={4} fontSize="sm">
                            <Text>
                              <strong>
                                {getRepoActivities(contributor, selectedRepo)}
                              </strong>{" "}
                              activities
                            </Text>
                            {contributor.lastActivityAt && (
                              <Text color="gray.500">
                                Last: {formatDate(contributor.lastActivityAt)}
                              </Text>
                            )}
                          </HStack>
                        </Box>
                      </Flex>
                    </CardBody>
                  </Card>
                ))}
              </Grid>

              <Flex justify="center" gap={4}>
                <Button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  isDisabled={page === 1}
                >
                  Previous
                </Button>
                <Text alignSelf="center">Page {page}</Text>
                <Button onClick={() => setPage((p) => p + 1)} isDisabled={!hasMore}>
                  Next
                </Button>
              </Flex>
            </>
          )}

          <Card>
            <CardBody>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                ⚙️ Contributor data is automatically updated every 24 hours. Activity
                scores are calculated based on commits, pull requests, reviews, and
                other contributions across all repositories.
              </Text>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
