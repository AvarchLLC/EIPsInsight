import React, { useState, useEffect, useRef } from "react";
import Chart, { ChartItem } from "chart.js/auto";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import AllLayout from "@/components/Layout";
import DateTime from "@/components/DateTime";
import {
  Input,
  Box,
  Button,
  Flex,
  Spacer,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  CardBody,
  Stack,
  StackDivider,
  Card,
  CardHeader,
  Heading,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowRight } from "react-feather";
import Eip from "../api/time-to-final/[eip]";

const defaultHandles = [
  "axic",
  "gcolvin",
  "lightclient",
  "SamWilsn",
  "xinbenlv",
  "g11tech"
];
const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

type EIPsReview = {
  title: string;
  url: string;
  date: string;
  html_url: string;
  closed_at: string;
};

type ERCsReview = {
  title: string;
  url: string;
  date: string;
  html_url: string;
  closed_at: string;
};

// reivews will be an array where first item will be the array of EIPs reviews and second item will be the array of ERCs reviews
type Reviews = EIPsReview[] | ERCsReview[];

type DefaultEipReview = {
  title: string;
  url: string;
  date: string;
};

type DefaultErcReview = {
  title: string;
  url: string;
  date: string;
};

const GitHubPRTracker = () => {
  const [reviewsCount, setReviewsCount] = useState<[Number[], Number[]]>();
  const [randomEipsReviews, setRandomEipsReviews] = useState<
    Array<DefaultEipReview>
  >([]);
  const [randomErcsReviews, setRandomErcsReviews] = useState<
    Array<DefaultErcReview>
  >([]);
  const [reviewsTitle, setReviewsTitle] = useState<string>("");
  const defaultChartRef = useRef<HTMLCanvasElement>(null);
  const handleChartRef = useRef<HTMLCanvasElement>(null);
  const [handle, setHandle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [handleReviewsCount, setHandleReviewsCount] =
    useState<[Number[], Number[]]>();
  const [randomChart, setRandomChart] =
    useState<Chart<"bar", Number[], string>>();
  const [dynamicChart, setDynamicChart] =
    useState<Chart<"bar", Number[], string>>();
  const bg = useColorModeValue("#171923", "#171923");

  // const showRandomReviews = async () => {
  //   let eipRandomReviews: Array<DefaultEipReview> = [];
  //   let ercRandomReviews: Array<DefaultErcReview> = [];
  //   let randomHandle =
  //     defaultHandles[Math.floor(Math.random() * defaultHandles.length)];

  //   const reviewsEIPs = await fetchAllReviews(
  //     randomHandle,
  //     "",
  //     "",
  //     "ethereum/EIPs"
  //   );
  //   const reviewsERCs = await fetchAllReviews(
  //     randomHandle,
  //     "",
  //     "",
  //     "ethereum/ERCs"
  //   );

  //   reviewsEIPs.forEach((review) => {
  //     eipRandomReviews.push({
  //       title: review.title,
  //       url: review.html_url,
  //       date: new Date(review.closed_at).toLocaleString(),
  //     });
  //   });

  //   reviewsERCs.forEach((review) => {
  //     ercRandomReviews.push({
  //       title: review.title,
  //       url: review.html_url,
  //       date: new Date(review.closed_at).toLocaleString(),
  //     });
  //   });

  //   setRandomEipsReviews(eipRandomReviews);
  //   setRandomErcsReviews(ercRandomReviews);
  //   setReviewsTitle(
  //     `Total Reviews by ${randomHandle}: ${reviewsEIPs.length} (EIPs), ${reviewsERCs.length} (ERCs)`
  //   );
  // };

  const updateDefaultReviewCounts = async () => {
    const reviewCountsEIPs: Number[] = await Promise.all(
      defaultHandles.map((handle) => fetchReviewCount(handle, "ethereum/EIPs"))
    );
    const reviewCountsERCs: Number[] = await Promise.all(
      defaultHandles.map((handle) => fetchReviewCount(handle, "ethereum/ERCs"))
    );

    const ctx = defaultChartRef?.current?.getContext("2d") as ChartItem;

    if (randomChart) {
      randomChart.destroy();
    }

    let chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: defaultHandles,
        datasets: [
          {
            label: "Number of Reviews (EIPs)",
            data: reviewCountsEIPs,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Number of Reviews (ERCs)",
            data: reviewCountsERCs,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setReviewsCount([reviewCountsEIPs, reviewCountsERCs]);
    setRandomChart(chart);
  };

  const fetchReviewCount = async (handle: string, repo: string) => {
    const response = await fetch(
      `https://api.github.com/search/issues?q=is:pr reviewed-by:${handle} repo:${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${token}`,
        },
      }
    );

    if (!response.ok) {
      window.location.reload();
    }

    const data = await response.json();

    return data.total_count;
  };

  const fetchAllReviews = async (
    handle: string,
    startDate: string,
    endDate: string,
    repo: string
  ) => {
    let query = `is:pr reviewed-by:${handle} repo:${repo}`;
    if (startDate) {
      query += ` created:>=${startDate}`;
    }
    if (endDate) {
      query += ` updated:<=${endDate}`;
    }

    let page = 1;
    let perPage = 100;
    let reviews: Reviews = [];
    let moreResults = true;

    while (moreResults) {
      const response = await fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(
          query
        )}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: `token ${token}`,
          },
        }
      );

      if (!response.ok) {
        window.location.reload();
      }

      let data = await response.json();
      reviews = reviews.concat(data.items);
      moreResults = data.total_count != reviews.length;
      page++;
    }

    return reviews;
  };

  const onSubmitForm = async () => {
    if (handle.length == 0) {
      alert("Please enter a valid github handle");
    }
    if (startDate.length == 0) {
      alert("Please enter a valid start date");
    }
    if (endDate.length == 0) {
      alert("Please enter a valid end date");
    }

    let eipRandomReviews: Array<DefaultEipReview> = [];
    let ercRandomReviews: Array<DefaultErcReview> = [];

    const reviewsEIPs = await fetchAllReviews(
      handle,
      startDate,
      endDate,
      "ethereum/EIPs"
    );
    const reviewsERCs = await fetchAllReviews(
      handle,
      startDate,
      endDate,
      "ethereum/ERCs"
    );

    reviewsEIPs.forEach((review) => {
      eipRandomReviews.push({
        title: review.title,
        url: review.html_url,
        date: new Date(review.closed_at).toLocaleString(),
      });
    });

    reviewsERCs.forEach((review) => {
      ercRandomReviews.push({
        title: review.title,
        url: review.html_url,
        date: new Date(review.closed_at).toLocaleString(),
      });
    });

    setRandomEipsReviews(eipRandomReviews);
    setRandomErcsReviews(ercRandomReviews);
    setReviewsTitle(
      `Total Reviews by ${handle}: ${reviewsEIPs.length} (EIPs), ${reviewsERCs.length} (ERCs)`
    );

    const reviewCountsEIPs: Number[] = await Promise.all(
      defaultHandles.map((handle) =>
        fetchReviewCountBetweenDates(
          handle,
          "ethereum/EIPs",
          startDate,
          endDate
        )
      )
    );
    const reviewCountsERCs: Number[] = await Promise.all(
      defaultHandles.map((handle) =>
        fetchReviewCountBetweenDates(
          handle,
          "ethereum/ERCs",
          startDate,
          endDate
        )
      )
    );

    const ctx = handleChartRef?.current?.getContext("2d") as ChartItem;

    // destory the canvas if already exists
    if (dynamicChart) {
      dynamicChart.destroy();
    }

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: defaultHandles,
        datasets: [
          {
            label: "Number of Reviews (EIPs)",
            data: reviewCountsEIPs,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Number of Reviews (ERCs)",
            data: reviewCountsERCs,
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setHandleReviewsCount([reviewCountsEIPs, reviewCountsERCs]);
    setDynamicChart(chart);
  };

  const fetchReviewCountBetweenDates = async (
    handle: string,
    repo: string,
    startDate: string,
    endDate: string
  ) => {
    let query = `is:pr reviewed-by:${handle} repo:${repo}`;
    if (startDate) {
      query += ` created:>=${startDate}`;
    }
    if (endDate) {
      query += ` updated:<=${endDate}`;
    }

    const response = await fetch(
      `https://api.github.com/search/issues?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `token ${token}`,
        },
      }
    );

    if (!response.ok) {
      alert(response.statusText);
      window.location.reload();
    }

    const data = await response.json();

    return data.total_count;
  };

  useEffect(() => {
    updateDefaultReviewCounts();
    // showRandomReviews();
  }, []);

  function downloadCSV(
    data: DefaultEipReview[] | DefaultErcReview[],
    filename: string
  ) {
    let csvFileData: string = "Title,URL,Date\n";

    data.forEach((review) => {
      Object.values(review).forEach((value, index) => {
        // Check if the value includes a comma or a quote
        if (value.includes(",") || value.includes('"')) {
          // Escape double quotes by doubling them
          value = `"${value.replace(/"/g, '""')}"`;
        }

        if (index === 2) {
          csvFileData += `${value}\n`;
        } else {
          csvFileData += `${value},`;
        }
      });
    });

    const blob = new Blob([csvFileData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click(); // Uncomment this to actually trigger the download
  }

  const categoryColors: string[] = [
    "rgb(255, 99, 132)",
    "rgb(255, 159, 64)",
    "rgb(255, 205, 86)",
    "rgb(75, 192, 192)",
    "rgb(54, 162, 235)",
    "rgb(153, 102, 255)",
    "rgb(255, 99, 255)",
    "rgb(50, 205, 50)",
    "rgb(255, 0, 0)",
    "rgb(0, 128, 0)",
  ];

  // have to convert this reviesCount to [{handle: "axic", value: 10, category: "EIPs"}, {handle: "axic", value: 10, category: "ERCs"}]
  let reviewsData: { handle: string; value: number; category: string }[] = [];
  if (reviewsCount) {
    reviewsCount[0].forEach((count, index) => {
      reviewsData.push({
        handle: defaultHandles[index],
        value: count as number,
        category: "EIPs",
      });
    });

    reviewsCount[1].forEach((count, index) => {
      reviewsData.push({
        handle: defaultHandles[index],
        value: count as number,
        category: "ERCs",
      });
    });
  }

  // have to convert handle reviews count to [{handle: "axic", value: 10, category: "EIPs"}, {handle: "axic", value: 10, category: "ERCs"}]
  let handleReviewsData: { handle: string; value: number; category: string }[] =
    [];
  if (handleReviewsCount) {
    handleReviewsCount[0].forEach((count, index) => {
      handleReviewsData.push({
        handle: defaultHandles[index],
        value: count as number,
        category: "EIPs",
      });
    });

    handleReviewsCount[1].forEach((count, index) => {
      handleReviewsData.push({
        handle: defaultHandles[index],
        value: count as number,
        category: "ERCs",
      });
    });
  }

  const config = {
    data: reviewsData,
    xField: "handle",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "top-right" as const },
    smooth: true,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    } as any,
  };

  const config2 = {
    data: handleReviewsData,
    xField: "handle",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "top-right" as const },
    smooth: true,
    label: {
      position: "middle",
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    } as any,
  };

  const Area = dynamic(
    () => import("@ant-design/plots").then((item) => item.Column),
    {
      ssr: false,
    }
  );

  return (
    <AllLayout>
      <Box paddingLeft={20} paddingRight={20} marginTop={20} marginBottom={10}>
  <Heading
    size="xl"
    marginTop={30}
    marginBottom={10}
    textAlign="center"
    style={{
      color: '#42a5f5', // Color matching the heading in the image
      fontSize: '2.5rem', // Adjust size if necessary to match the image
      fontWeight: 'bold' // Assuming bold weight based on the image
    }}
  >
    EIP Editor's Review tracker 
  </Heading>
  <Heading as="label" htmlFor="monthFilter" size="md">
  How to Use:
</Heading>
<ol>
  <li>1. The default chart shows total reviews by editors.</li>
  <li>2. Click "TOTAL REVIEW BY EDITORS" to view the detailed table.</li>
  <li>3. Click on any editor's name in the table to see their specific review data on GitHub.</li>
  <li>4. A chart for reviews of all the Editors between two dates will appear after using filter between two dates. </li>
  <li>e.g.- "Enter Editor Github Handle" - axic </li>
</ol>

</Box>

      <Box minHeight={"100vh"}>
        <Flex gap={30} direction={"row"} padding={20}>
          <Input
            placeholder="Enter Editor Github handle"
            onChange={(e) => {
              setHandle(e.target.value);
            }}
            value={handle}
          />
          <Input
            type="date"
            w={300}
            onChange={(e) => {
              setStartDate(e.target.value.toString());
            }}
            value={startDate}
          />
          <Input
            type="date"
            w={300}
            onChange={(e) => {
              setEndDate(e.target.value.toString());
            }}
          />
          <Button
            onClick={async () => {
              await onSubmitForm();
            }}
          >
            Search
          </Button>
        </Flex>

        <Flex
          direction={"row"}
          height={400}
          width={"100%"}
          paddingLeft={20}
          paddingRight={20}
          gap={5}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Box
            bgColor={bg}
            marginTop={"2rem"}
            p="0.5rem"
            borderRadius="0.35rem"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height={400}
            overflowX="auto"
            overflowY="hidden"
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className="hover: cursor-pointer ease-in duration-200 h-max"
          >
            <Link href={"#table-data"}>
              <Heading size="md" textTransform="uppercase" marginBottom={4}>
                Total Review by Editors
              </Heading>
            </Link>
            <Area {...config} />
            <Box>
              <DateTime />
            </Box>
          </Box>

          {handleReviewsCount && (
            <Box
              bgColor={bg}
              marginTop={"2rem"}
              p="0.5rem"
              borderRadius="0.35rem"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              height={400}
              overflowX="auto"
              overflowY="hidden"
              as={motion.div}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 } as any}
              className="hover: cursor-pointer ease-in duration-200 h-max"
            >
              <Heading size="md" textTransform="uppercase" marginBottom={4}>
                Review by Editors
              </Heading>
              <Area {...config2} />
              <Box>
                <DateTime />
              </Box>
            </Box>
          )}
        </Flex>

        <Box
          paddingLeft={20}
          paddingRight={20}
          marginTop={20}
          marginBottom={10}
        >
          <Heading size="xl" marginTop={30} marginBottom={10}>
            {reviewsTitle}
          </Heading>

          <Flex
            flexDirection={"row"}
            gap={5}
            alignItems={"end"}
            justifyContent={"end"}
            marginTop={5}
            marginBottom={10}
          >
            {randomEipsReviews.length > 0 && (
              <Button
                onClick={() => {
                  downloadCSV(randomEipsReviews, "EIPs.csv");
                }}
              >
                Download EIPs.csv
              </Button>
            )}

            {randomErcsReviews.length > 0 && (
              <Button
                onClick={() => {
                  downloadCSV(randomErcsReviews, "ERCs.csv");
                }}
              >
                Download ERCs.csv
              </Button>
            )}
          </Flex>

          {randomEipsReviews.length > 0 && (
            <Card>
              <CardHeader>
                <Heading size="md" textTransform="uppercase">
                  EIPs
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {randomEipsReviews.map((review, index) => (
                    <Box key={index}>
                      <Text pt="2" fontSize="sm">
                        {index + 1}. {review.title} {"Reviewed On"}{" "}
                        {review.date}
                      </Text>
                      <Link href={review.url} target="_blank">
                        <Flex>
                          <Text color={"blu"}>Link</Text> <ArrowRight />
                        </Flex>
                      </Link>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}

          {randomErcsReviews.length > 0 && (
            <Card marginTop={10}>
              <CardHeader>
                <Heading size="md" textTransform="uppercase">
                  ERCs
                </Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {randomErcsReviews.map((review, index) => (
                    <Box key={index}>
                      <Text pt="2" fontSize="sm">
                        {index + 1}. {review.title} {"Reviewed On"}
                        {review.date}
                      </Text>
                      <Link href={review.url} target="_blank">
                        <Flex>
                          <Text>Link</Text> <ArrowRight />
                        </Flex>
                      </Link>
                    </Box>
                  ))}
                </Stack>
              </CardBody>
            </Card>
          )}
        </Box>

        <Box
  paddingLeft={20}
  paddingRight={20}
  marginTop={20}
  marginBottom={10}
  id="table-data"
>
  {reviewsCount && (
    <TableContainer>
      <Table variant={"striped"}>
        <TableCaption>Total EIPs By Github Handle</TableCaption>
        <Thead>
          <Tr>
            <Th>Github Handle</Th>
            <Th>Number of Reviews</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviewsCount[0].map((count, index) => (
            <Tr key={index}>
              <Td>
                <a
                  href={`https://github.com/ethereum/EIPs/pulls?q=is%3Apr+reviewed-by%3A${defaultHandles[index]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {defaultHandles[index]}
                </a>
              </Td>
              <Td isNumeric>{count as React.ReactNode}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )}
</Box>

<Box
  paddingLeft={20}
  paddingRight={20}
  marginTop={20}
  marginBottom={10}
>
  {reviewsCount && (
    <TableContainer>
      <Table variant={"striped"}>
        <TableCaption>Total ERCs By Github Handle</TableCaption>
        <Thead>
          <Tr>
            <Th>Github Handle</Th>
            <Th>Number of Reviews</Th>
          </Tr>
        </Thead>
        <Tbody>
          {reviewsCount[1].map((count, index) => (
            <Tr key={index}>
              <Td>
                <a
                  href={`https://github.com/ethereum/ERCs/pulls?q=is%3Apr+reviewed-by%3A${defaultHandles[index]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {defaultHandles[index]}
                </a>
              </Td>
              <Td isNumeric>{count as React.ReactNode}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )}
</Box>

      </Box>
    </AllLayout>
  );
};

export default GitHubPRTracker;
