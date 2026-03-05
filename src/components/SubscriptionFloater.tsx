"use client";
import {
  Box,
  IconButton,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  List,
  ListItem,
  Text,
  Flex,
  Button,
  useDisclosure,
  useColorModeValue,
  Badge,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import { FiBell, FiAward } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const SubscriptionFloater = () => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubs = async () => {
      if (!session?.user?.email) return setLoading(false);

      try {
        const res = await fetch(`/api/subscriptions?email=${session.user.email}`);
        const data = await res.json();
        setSubscriptions(data);
      } catch (err) {
        console.error("Failed to fetch subscriptions", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubs();
  }, [session]);

  const handleUnsubscribe = async (sub: any) => {
    setUnsubscribingId(`${sub.type}-${sub.id}`);
    try {
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          type: sub.type,
          id: sub.id,
          filter: sub.filter,
        }),
      });

      setSubscriptions(prev =>
        prev.filter(s => !(s.type === sub.type && s.id === sub.id))
      );
    } catch (err) {
      console.error("Unsubscribe failed", err);
    } finally {
      setUnsubscribingId(null);
    }
  };

  const [filterType, setFilterType] = useState<"all" | "eips" | "ercs" | "rips">("all");

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filterType === "all") return true;
    return sub.type === filterType;
  });


  const iconStyles = {
    boxShadow: `
      0 5px 15px rgba(0, 0, 0, 0.3),
      0 10px 30px rgba(0, 0, 0, 0.2),
      inset 0 -3px 5px rgba(255, 255, 255, 0.2)
    `,
    transform: "perspective(500px) translateZ(20px)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    _hover: {
      transform: "perspective(500px) translateZ(30px)",
    },
  };

  const headingColor = useColorModeValue("#333", "#F5F5F5");
  const headingGradient = useColorModeValue("linear(to-r, #30A0E0, #ffffff)", "linear(to-r, #30A0E0, #F5F5F5)");
  const headingColorLight = "#333";
  const headingColorDark = "#F5F5F5";
  const headingBgGradientLight = "linear(to-r, #30A0E0, #ffffff)";
  const headingBgGradientDark = "linear(to-r, #30A0E0, #F5F5F5)";

  return (
    <>
      <Box
        zIndex="1000"
        borderRadius="50%"
      >
        <Tooltip label="View Subscription" placement="left" zIndex={10001}>
          <IconButton
            aria-label="Subscription"
            icon={<FiAward />}
            size="lg"
            colorScheme="teal"
            borderRadius="50%"
            onClick={onOpen}
            sx={{
              boxShadow: `
                      0 5px 15px rgba(0, 0, 0, 0.3),
                      0 10px 30px rgba(0, 0, 0, 0.2),
                      inset 0 -3px 5px rgba(255, 255, 255, 0.2)
                    `,
              transform: 'perspective(500px) translateZ(20px)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              bgGradient: useColorModeValue(headingBgGradientLight, headingBgGradientDark),
              color: useColorModeValue(headingColorLight, headingColorDark),
              _hover: {
                transform: 'perspective(500px) translateZ(30px)',
                boxShadow: `
                        0 8px 20px rgba(0, 0, 0, 0.4),
                        0 15px 40px rgba(0, 0, 0, 0.3),
                        inset 0 -5px 10px rgba(255, 255, 255, 0.3)
                      `,
              },
            }}
          />
        </Tooltip>
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bgGradient={useColorModeValue(headingBgGradientLight, headingBgGradientDark)}
            color={useColorModeValue(headingColorLight, headingColorDark)}
          >
            <Flex align="center">
              <FiAward style={{ marginRight: "10px" }} />
              Subscriptions
              <Badge ml={2} colorScheme="blue">
                {subscriptions?.length || 0}
              </Badge>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            {loading ? (
              <Text mt={4}>Loading...</Text>
            ) : (
              <>
                {/* FILTER BUTTONS */}
                <Flex justify="center" gap={2} mt={2} mb={4} wrap="wrap">
                  {["all", "eips", "ercs", "rips"].map((key) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={filterType === key ? "solid" : "outline"}
                      colorScheme="blue"
                      onClick={() => setFilterType(key as any)}
                    >
                      {key.toUpperCase()}
                    </Button>
                  ))}
                </Flex>

                {filteredSubscriptions.length === 0 ? (
                  <Text mt={4} color="gray.500" textAlign="center">
                    No {filterType === "all" ? "" : filterType.toUpperCase() + " "}subscriptions.
                  </Text>
                ) : (
                  <List spacing={3} mt={2}>
                    {filteredSubscriptions.map((sub, index) => (
                      <ListItem
                        key={index}
                        p={3}
                        borderRadius="md"
                        _hover={{ bg: "gray.100" }}
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="bold">
                              {sub.type.toUpperCase()}-{sub.id}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {sub.filter === "all" ? "All changes" : "Status only"}
                            </Text>
                          </Box>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            isLoading={unsubscribingId === `${sub.type}-${sub.id}`}
                            onClick={() => handleUnsubscribe(sub)}
                          >
                            Unsubscribe
                          </Button>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                )}
              </>
            )}
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SubscriptionFloater;
