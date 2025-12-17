import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  Icon,
  HStack,
  VStack,
  Collapse,
  Button,
  Link,
  Divider,
  Code,
  Wrap,
  WrapItem,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiGitCommit,
  FiGitPullRequest,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiGitBranch,
  FiUser,
  FiTag,
  FiClock,
  FiEdit,
  FiFile,
} from "react-icons/fi";
import type { Activity } from "@/types/contributors";

const ACTIVITY_ICONS: Record<string, any> = {
  COMMIT: FiGitCommit,
  PR_OPENED: FiGitPullRequest,
  PR_MERGED: FiGitPullRequest,
  PR_CLOSED: FiGitPullRequest,
  REVIEW_APPROVED: FiCheckCircle,
  REVIEW_COMMENTED: FiMessageSquare,
  REVIEW_CHANGES_REQUESTED: FiAlertCircle,
  ISSUE_COMMENT: FiMessageSquare,
  PR_COMMENT: FiMessageSquare,
};

const ACTIVITY_COLORS: Record<string, string> = {
  COMMIT: "blue",
  PR_OPENED: "green",
  PR_MERGED: "purple",
  PR_CLOSED: "red",
  REVIEW_APPROVED: "green",
  REVIEW_COMMENTED: "gray",
  REVIEW_CHANGES_REQUESTED: "orange",
  ISSUE_COMMENT: "cyan",
  PR_COMMENT: "teal",
};

interface ActivityCardProps {
  activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const codeBg = useColorModeValue("gray.100", "gray.900");

  const { metadata, activityType, timestamp, repository } = activity;

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityLabel = (type: string) => {
    return type.split("_").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  };

  const renderCommitDetails = () => (
    <VStack align="start" spacing={3} mt={3}>
      {metadata.message && (
        <Box w="full">
          <Text fontWeight="semibold" fontSize="sm" mb={1}>
            <Icon as={FiMessageSquare} mr={2} />
            Commit Message
          </Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={3}
            borderRadius="md"
            bg={codeBg}
            fontSize="sm"
            w="full"
          >
            {metadata.message}
          </Code>
        </Box>
      )}

      <Flex gap={4} flexWrap="wrap" fontSize="sm">
        {metadata.sha && (
          <HStack>
            <Icon as={FiGitCommit} />
            <Text color="gray.500">SHA:</Text>
            <Code fontSize="xs">{metadata.sha.substring(0, 7)}</Code>
          </HStack>
        )}
        {metadata.verified !== undefined && (
          <Badge colorScheme={metadata.verified ? "green" : "gray"}>
            {metadata.verified ? "✓ Verified" : "Unverified"}
          </Badge>
        )}
      </Flex>

      {(metadata.authorName || metadata.authorEmail) && (
        <HStack fontSize="sm">
          <Icon as={FiUser} />
          <Text color="gray.500">Author:</Text>
          <Text>
            {metadata.authorName}
            {metadata.authorEmail && ` <${metadata.authorEmail}>`}
          </Text>
        </HStack>
      )}

      {metadata.committerName && metadata.committerName !== metadata.authorName && (
        <HStack fontSize="sm">
          <Icon as={FiUser} />
          <Text color="gray.500">Committer:</Text>
          <Text>
            {metadata.committerName}
            {metadata.committerEmail && ` <${metadata.committerEmail}>`}
          </Text>
        </HStack>
      )}
    </VStack>
  );

  const renderPRDetails = () => (
    <VStack align="start" spacing={3} mt={3}>
      {metadata.body && (
        <Box w="full">
          <Text fontWeight="semibold" fontSize="sm" mb={1}>
            <Icon as={FiMessageSquare} mr={2} />
            Description
          </Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={3}
            borderRadius="md"
            bg={codeBg}
            fontSize="sm"
            w="full"
            maxH="200px"
            overflowY="auto"
          >
            {metadata.body}
          </Code>
        </Box>
      )}

      <Flex gap={4} flexWrap="wrap" fontSize="sm">
        {metadata.state && (
          <Badge
            colorScheme={
              metadata.state === "merged"
                ? "purple"
                : metadata.state === "open"
                ? "green"
                : "red"
            }
            textTransform="uppercase"
          >
            {metadata.state}
          </Badge>
        )}
        {metadata.draft && <Badge colorScheme="yellow">Draft</Badge>}
        {metadata.authorAssociation && (
          <Badge variant="outline">{metadata.authorAssociation}</Badge>
        )}
      </Flex>

      {(metadata.baseBranch || metadata.headBranch) && (
        <HStack fontSize="sm">
          <Icon as={FiGitBranch} />
          <Text color="gray.500">Branches:</Text>
          <Code fontSize="xs">{metadata.headBranch || "unknown"}</Code>
          <Text>→</Text>
          <Code fontSize="xs">{metadata.baseBranch || "unknown"}</Code>
        </HStack>
      )}

      {metadata.labels && metadata.labels.length > 0 && (
        <Box>
          <HStack mb={2}>
            <Icon as={FiTag} />
            <Text fontSize="sm" color="gray.500">
              Labels:
            </Text>
          </HStack>
          <Wrap>
            {metadata.labels.map((label, idx) => (
              <WrapItem key={idx}>
                <Badge colorScheme="blue" fontSize="xs">
                  {label}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      {metadata.assignees && metadata.assignees.length > 0 && (
        <HStack fontSize="sm">
          <Icon as={FiUser} />
          <Text color="gray.500">Assignees:</Text>
          <Text>{metadata.assignees.join(", ")}</Text>
        </HStack>
      )}

      {metadata.requestedReviewers && metadata.requestedReviewers.length > 0 && (
        <HStack fontSize="sm">
          <Icon as={FiUser} />
          <Text color="gray.500">Reviewers:</Text>
          <Text>{metadata.requestedReviewers.join(", ")}</Text>
        </HStack>
      )}

      {metadata.mergedBy && (
        <HStack fontSize="sm">
          <Icon as={FiCheckCircle} />
          <Text color="gray.500">Merged by:</Text>
          <Text fontWeight="medium">{metadata.mergedBy}</Text>
          {metadata.mergedAt && (
            <Text color="gray.400">on {formatDate(metadata.mergedAt)}</Text>
          )}
        </HStack>
      )}

      {metadata.closedAt && !metadata.mergedAt && (
        <HStack fontSize="sm">
          <Icon as={FiXCircle} />
          <Text color="gray.500">Closed at:</Text>
          <Text>{formatDate(metadata.closedAt)}</Text>
        </HStack>
      )}
    </VStack>
  );

  const renderReviewDetails = () => (
    <VStack align="start" spacing={3} mt={3}>
      {metadata.reviewBody && (
        <Box w="full">
          <Text fontWeight="semibold" fontSize="sm" mb={1}>
            <Icon as={FiMessageSquare} mr={2} />
            Review Comment
          </Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={3}
            borderRadius="md"
            bg={codeBg}
            fontSize="sm"
            w="full"
            maxH="200px"
            overflowY="auto"
          >
            {metadata.reviewBody}
          </Code>
        </Box>
      )}

      <Flex gap={4} flexWrap="wrap" fontSize="sm">
        {metadata.reviewState && (
          <Badge
            colorScheme={
              metadata.reviewState === "APPROVED"
                ? "green"
                : metadata.reviewState === "CHANGES_REQUESTED"
                ? "orange"
                : "gray"
            }
          >
            {metadata.reviewState}
          </Badge>
        )}
        {metadata.reviewId && (
          <HStack>
            <Text color="gray.500">Review ID:</Text>
            <Code fontSize="xs">#{metadata.reviewId}</Code>
          </HStack>
        )}
      </Flex>

      {metadata.reviewSubmittedAt && (
        <HStack fontSize="sm">
          <Icon as={FiClock} />
          <Text color="gray.500">Submitted:</Text>
          <Text>{formatDate(metadata.reviewSubmittedAt)}</Text>
        </HStack>
      )}
    </VStack>
  );

  const renderCommentDetails = () => (
    <VStack align="start" spacing={3} mt={3}>
      {metadata.commentBody && (
        <Box w="full">
          <Text fontWeight="semibold" fontSize="sm" mb={1}>
            <Icon as={FiMessageSquare} mr={2} />
            Comment
          </Text>
          <Code
            display="block"
            whiteSpace="pre-wrap"
            p={3}
            borderRadius="md"
            bg={codeBg}
            fontSize="sm"
            w="full"
            maxH="200px"
            overflowY="auto"
          >
            {metadata.commentBody}
          </Code>
        </Box>
      )}

      <Flex gap={4} flexWrap="wrap" fontSize="sm">
        {metadata.isIssueComment !== undefined && (
          <Badge>
            {metadata.isIssueComment ? "Issue Comment" : "PR Review Comment"}
          </Badge>
        )}
        {metadata.commentId && (
          <HStack>
            <Text color="gray.500">Comment ID:</Text>
            <Code fontSize="xs">#{metadata.commentId}</Code>
          </HStack>
        )}
      </Flex>

      {metadata.commentUpdatedAt && metadata.commentCreatedAt && (
        <HStack fontSize="sm">
          <Icon as={FiEdit} />
          <Text color="gray.500">Last edited:</Text>
          <Text>{formatDate(metadata.commentUpdatedAt)}</Text>
        </HStack>
      )}
    </VStack>
  );

  const renderCodeChanges = () => {
    if (!metadata.additions && !metadata.deletions && !metadata.changedFiles) {
      return null;
    }

    return (
      <HStack spacing={4} fontSize="sm" mt={3}>
        {metadata.changedFiles !== undefined && (
          <HStack>
            <Icon as={FiFile} />
            <Text color="gray.500">Files:</Text>
            <Text fontWeight="medium">{metadata.changedFiles}</Text>
          </HStack>
        )}
        {metadata.additions !== undefined && (
          <Tooltip label="Lines added">
            <Text color="green.500" fontWeight="medium">
              +{metadata.additions}
            </Text>
          </Tooltip>
        )}
        {metadata.deletions !== undefined && (
          <Tooltip label="Lines deleted">
            <Text color="red.500" fontWeight="medium">
              -{metadata.deletions}
            </Text>
          </Tooltip>
        )}
        {metadata.totalChanges !== undefined && (
          <HStack>
            <Text color="gray.500">Total:</Text>
            <Text fontWeight="medium">{metadata.totalChanges}</Text>
          </HStack>
        )}
      </HStack>
    );
  };

  return (
    <Box
      p={4}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="md"
      _hover={{ bg: hoverBg }}
      transition="all 0.2s"
    >
      <Flex gap={4} align="start">
        <Icon
          as={ACTIVITY_ICONS[activityType]}
          boxSize={5}
          color={`${ACTIVITY_COLORS[activityType]}.500`}
          mt={1}
        />
        <Box flex={1}>
          <HStack justify="space-between" mb={2} flexWrap="wrap">
            <HStack spacing={2}>
              <Badge colorScheme={ACTIVITY_COLORS[activityType]}>
                {getActivityLabel(activityType)}
              </Badge>
              <Badge variant="outline">{repository.split("/")[1]}</Badge>
              {metadata.number && (
                <Badge colorScheme="gray">#{metadata.number}</Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {formatDate(timestamp)}
            </Text>
          </HStack>

          {(metadata.title || metadata.message) && (
            <Text fontWeight="medium" mb={1} noOfLines={isExpanded ? undefined : 2}>
              {metadata.title || metadata.message?.split("\n")[0]}
            </Text>
          )}

          {renderCodeChanges()}

          {metadata.htmlUrl && (
            <Link href={metadata.htmlUrl} isExternal mt={2}>
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Icon as={FiExternalLink} />}
              >
                View on GitHub
              </Button>
            </Link>
          )}

          <Button
            size="xs"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            leftIcon={<Icon as={isExpanded ? FiChevronUp : FiChevronDown} />}
            mt={2}
          >
            {isExpanded ? "Show Less" : "Show Details"}
          </Button>

          <Collapse in={isExpanded} animateOpacity>
            <Divider my={3} />
            
            {activityType === "COMMIT" && renderCommitDetails()}
            {(activityType === "PR_OPENED" ||
              activityType === "PR_MERGED" ||
              activityType === "PR_CLOSED") &&
              renderPRDetails()}
            {(activityType === "REVIEW_APPROVED" ||
              activityType === "REVIEW_COMMENTED" ||
              activityType === "REVIEW_CHANGES_REQUESTED") &&
              renderReviewDetails()}
            {(activityType === "ISSUE_COMMENT" ||
              activityType === "PR_COMMENT") &&
              renderCommentDetails()}

            {metadata.authorAssociation && (
              <HStack mt={3} fontSize="sm">
                <Icon as={FiUser} />
                <Text color="gray.500">Association:</Text>
                <Badge variant="outline">{metadata.authorAssociation}</Badge>
              </HStack>
            )}
          </Collapse>
        </Box>
      </Flex>
    </Box>
  );
};
