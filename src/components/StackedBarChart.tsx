// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Box, useColorModeValue, Spinner, Flex, Heading, Button } from "@chakra-ui/react";
// import { useWindowSize } from "react-use";
// import { motion } from "framer-motion";
// import DateTime from "@/components/DateTime";
// import axios from "axios";


// const getCat = (cat: string) => {
//   switch (cat) {
//     case "Standards Track":
//     case "Standard Track":
//     case "Standards Track (Core, Networking, Interface, ERC)":
//     case "Standard":
//     case "Process":
//     case "Core":
//     case "core":
//       return "Core";
//     case "RIP":
//       return "RIPs";
//     case "ERC":
//       return "ERCs";
//     case "Networking":
//       return "Networking";
//     case "Interface":
//       return "Interface";
//     case "Meta":
//       return "Meta";
//     case "Informational":
//       return "Informational";
//     default:
//       return "Core";
//   }
// };
// interface AreaProps {
//   data: MappedDataItem[];
//   xField: string;
//   yField: string;
//   color: string[];
//   seriesField: string;
//   xAxis: {
//     range: number[];
//     tickCount: number;
//   };
//   areaStyle: {
//     fillOpacity: number;
//   };
//   legend: {
//     position: string;
//   };
//   smooth: boolean;
// }

// interface MappedDataItem {
//   category: string;
//   date: string;
//   value: number;
// }

// interface EIP2 {
//   _id: string;
//   eip: string;
//   title: string;
//   author: string;
//   status: string;
//   type: string;
//   category: string;
//   created: string;
//   discussion: string;
//   deadline: string;
//   requires: string;
//   unique_ID: number;
//   __v: number;
//   repo: string;
// }

// interface EIP {
//   status: string;
//   eips: {
//     status: string;
//     month: number;
//     year: number;
//     date: string;
//     count: number;
//     category: string;
//     eips: EIP2[];
//   }[];
// }

// interface FormattedEIP {
//   category: string;
//   date: string;
//   value: number;
// }

// const categoryColors: string[] = [
//   "rgb(255, 99, 132)",
//   "rgb(255, 159, 64)",
//   "rgb(255, 205, 86)",
//   "rgb(75, 192, 192)",
//   "rgb(54, 162, 235)",
//   "rgb(153, 102, 255)",
//   "rgb(255, 99, 255)",
//   "rgb(50, 205, 50)",
//   "rgb(255, 0, 0)",
//   "rgb(0, 128, 0)",
// ];
// const categoryBorder: string[] = [
//   "rgba(255, 99, 132, 0.2)",
//   "rgba(255, 159, 64, 0.2)",
//   "rgba(255, 205, 86, 0.2)",
//   "rgba(75, 192, 192, 0.2)",
//   "rgba(54, 162, 235, 0.2)",
//   "rgba(153, 102, 255, 0.2)",
//   "rgba(255, 99, 255, 0.2)",
//   "rgba(50, 205, 50, 0.2)",
//   "rgba(255, 0, 0, 0.2)",
//   "rgba(0, 128, 0, 0.2)",
// ];

// interface AreaCProps {
//   dataset: APIResponse;
//   status: string;
//   type: string;
// }
// interface APIResponse {
//   eip: EIP[];
//   erc: EIP[];
//   rip: EIP[];
// }

// const StackedColumnChart: React.FC<AreaCProps> = ({ dataset, status, type }) => {
//   const [data, setData] = useState<APIResponse>();
//   const windowSize = useWindowSize();
//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const [isLoading, setIsLoading] = useState(true);
//   console.log(dataset);
//   console.log(status);
//   console.log(type);

//   const [typeData, setTypeData] = useState<EIP[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const jsonData = dataset;
//         setData(jsonData);
//         if (type === "EIPs" && jsonData.eip) {
//           setTypeData(
//             jsonData.eip.filter((item: any) => item.category !== "ERCs")
//           );
//           console.log(jsonData.eip.filter((item: any) => item.category !== "ERCs"));
//         } else if (type === "ERCs" && jsonData.erc) {
//           setTypeData(jsonData.erc);
//         }
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [dataset]);

//   useEffect(() => {
//     if (type === "EIPs") {
//       setTypeData(data?.eip || []);
//     } else if (type === "ERCs") {
//       setTypeData(data?.erc || []);
//     }
//   });

//   const [isChartReady, setIsChartReady] = useState(false);

//   useEffect(() => {
//     setIsChartReady(true);
//   }, []);

//   const filteredData = typeData.filter((item) => item.status === status);
//   console.log(data);
//   console.log(typeData)
//   console.log(filteredData)

//   const transformedData = filteredData
//     .flatMap((item) =>
//       item.eips.map((eip) => ({
//         category: getCat(eip.category),
//         year: eip.year.toString(),
//         value: eip.count,
//       }))
//     )
//     .filter((item) => item.category !== "ERCs");
//     console.log(transformedData);

//   const Area = dynamic(
//     () => import("@ant-design/plots").then((item) => item.Column),
//     {
//       ssr: false,
//     }
//   );

//   const chartWidth = windowSize.width
//     ? Math.min(windowSize.width * 0.6, 500)
//     : "100%";
//   const chartHeight = windowSize.height
//     ? Math.min(windowSize.height * 0.6, 500)
//     : "100%";

//   const config = {
//     data: transformedData,
//     xField: "year",
//     yField: "value",
//     color: categoryColors,
//     seriesField: "category",
//     isStack: true,
//     areaStyle: { fillOpacity: 0.6 },
//     legend: { position: "top-right" as const },
//     smooth: true,
//     label: {
//       position: "middle",
//       style: {
//         fill: "#FFFFFF",
//         opacity: 0.6,
//       },
//     } as any,
//   };

//   const headingColor = useColorModeValue('black', 'white');

//   const downloadData = () => {
//     // Transform the `typeData` to extract the required details
//     const transformedData = filteredData.flatMap((item) => {
//         return item.eips.flatMap((eipGroup) => {
//             return eipGroup.eips.map((eip) => ({
//                 month: eipGroup.month, // Assuming eipGroup includes 'month'
//                 year: eipGroup.year,  // Assuming eipGroup includes 'year'
//                 category: eipGroup.category, // Category from the group
//                 eip: eip.eip, // EIP number
//                 title: eip.title, // Title of the EIP
//                 status: eip.status, // Status of the EIP
//                 type: eip.type, // Type of the EIP
//                 discussion: eip.discussion, // Discussion link
//                 repo: eip.repo, // Repo type (e.g., "eip", "erc", "rip")
//                 author: eip.author, // Author of the EIP
//                 created: eip.created, // Creation date
//                 deadline: eip.deadline || "", // Deadline if exists, else empty
//             }));
//         });
//     });

//     if (!transformedData.length) {
//         console.error("No data to transform.");
//         alert("No data available for download.");
//         return;
//     }

//     // Define the CSV header
//     const header =
//         "Month,Year,Category,EIP,Title,Author,Status,Type,Created at,Link\n";

//     // Prepare the CSV content
//     const csvContent =
//         "data:text/csv;charset=utf-8," +
//         header +
//         transformedData
//             .map(
//                 ({
//                     month,
//                     year,
//                     category,
//                     repo,
//                     eip,
//                     title,
//                     author,
//                     status,
//                     type,
//                     discussion,
//                     created,
//                     deadline,
//                 }) => {
//                     // Generate the correct URL based on the repo type
//                     const url =
//                         repo === "eip"
//                             ? `https://eipsinsight.com/eips/eip-${eip}`
//                             : repo === "erc"
//                             ? `https://eipsinsight.com/ercs/erc-${eip}`
//                             : `https://eipsinsight.com/rips/rip-${eip}`;

//                     // Return the CSV line with all fields
//                     return `${month},${year},"${category.replace(
//                         /"/g,
//                         '""'
//                     )}","${eip}","${title.replace(/"/g, '""')}","${author.replace(
//                         /"/g,
//                         '""'
//                     )}","${status.replace(/"/g, '""')}","${type.replace(
//                         /"/g,
//                         '""'
//                     )}","${created.replace(
//                         /"/g,
//                         '""'
//                     )}","${url}"`;
//                 }
//             )
//             .join("\n");

//     // Encode the CSV content for downloading
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", "eip_data.csv");
//     document.body.appendChild(link); // Required for Firefox
//     link.click();
//     document.body.removeChild(link);
// };



//   return (
//     <>
//       {isLoading ? ( // Show loader while data is loading
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height="200px"
//         >
//           <Spinner />
//         </Box>
//       ) : (
//         <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
//   <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
//     <Heading size="md" color={headingColor}>
//       {`${status}`}
//     </Heading>
//     {/* Assuming a download option exists for the yearly data as well */}
//     {/* <Button 
//       colorScheme="blue" 
//       onClick={async () => {
//         try {
//           // Trigger the CSV conversion and download
//           downloadData();

//           // Trigger the API call
//           await axios.post("/api/DownloadCounter");
//         } catch (error) {
//           console.error("Error triggering download counter:", error);
//         }
//       }}
//     >
//       Download CSV
//     </Button> */}
//   </Flex>

//   {/* Make the area chart scrollable on smaller screens */}
//   <Box overflowX="auto">
//     <Area {...config} />
//   </Box>

//   {/* Make the DateTime section scrollable in x-direction if necessary */}
//   <Box className={"w-full"} overflowX="auto">
//     <DateTime />
//   </Box>
// </Box>

//       )}
//     </>
//   );
// };

// export default StackedColumnChart;

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  useColorModeValue,
  Spinner,
  Flex,
  Heading,
  Button,
} from "@chakra-ui/react";
import { useWindowSize } from "react-use";
import DateTime from "@/components/DateTime";
import axios from "axios";

const getCat = (cat: string) => {
  switch (cat) {
    case "Standards Track":
    case "Standard Track":
    case "Standards Track (Core, Networking, Interface, ERC)":
    case "Standard":
    case "Process":
    case "Core":
    case "core":
      return "Core";
    case "RIP":
      return "RIPs";
    case "ERC":
      return "ERCs";
    case "Networking":
      return "Networking";
    case "Interface":
      return "Interface";
    case "Meta":
      return "Meta";
    case "Informational":
      return "Informational";
    default:
      return "Core";
  }
};

interface AreaCProps {
  dataset: APIResponse;
  status: string;
  type: string;
  showDownloadButton?: boolean;

}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
}

interface EIP2 {
  _id: string;
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  requires: string;
  unique_ID: number;
  __v: number;
  repo: string;
}


interface EIP {
  status: string;
  eips: {
    status: string;
    month: number;
    year: number;
    date: string;
    count: number;
    category: string;
    eips: EIP2[];
  }[];
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

const StackedColumnChart: React.FC<AreaCProps> = ({ dataset, status, type, showDownloadButton = true, }) => {
  const [data, setData] = useState<APIResponse>();
  const windowSize = useWindowSize();
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const headingColor = useColorModeValue("black", "white");
  const [isLoading, setIsLoading] = useState(true);
  const [typeData, setTypeData] = useState<EIP[]>([]);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonData = dataset;
        setData(jsonData);
        if (type === "EIPs" && jsonData.eip) {
          setTypeData(jsonData.eip.filter((item: any) => item.category !== "ERCs"));
        } else if (type === "ERCs" && jsonData.erc) {
          setTypeData(jsonData.erc);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dataset, type]);

  useEffect(() => {
    if (type === "EIPs") {
      setTypeData(data?.eip || []);
    } else if (type === "ERCs") {
      setTypeData(data?.erc || []);
    }
  }, [data, type]);

  useEffect(() => {
    setIsChartReady(true);
  }, []);

  const filteredData = typeData.filter((item) =>
    status === "All" ? true : item.status === status
  );

  const transformedData = filteredData
    .flatMap((item) =>
      item.eips.map((eip) => ({
        category: getCat(eip.category),
        year: eip.year.toString(),
        value: eip.count,
      }))
    )
    .filter((item) => item.category !== "ERCs");

  const Area = dynamic(() => import("@ant-design/plots").then((mod) => mod.Column), {
    ssr: false,
  });

  // Responsive chart sizing with smaller max limits
  const chartWidth = windowSize.width
    ? Math.min(windowSize.width * 0.5, 600) // target ~50% screen width, max 600px
    : 500;

  const chartHeight = windowSize.height
    ? Math.min(windowSize.height * 0.55, 400)
    : 350;

  const config = {
    data: transformedData,
    xField: "year",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    isStack: true,
    areaStyle: { fillOpacity: 0.6 },
    legend: { position: "bottom-right" as const },
    smooth: true,
    label: {
      position: "middle",
      content: (originData: any) => {
        return originData.value >= 3 ? `${originData.value}` : '';
      },
      style: {
        fill: "#FFFFFF",
        opacity: 0.9,
        fontWeight: "600",
        fontSize: 12,
      },
    } as any,
    width: chartWidth,
    height: chartHeight,
  };

  const downloadData = () => {
    const transformedData = filteredData.flatMap((item) => {
      return item.eips.flatMap((eipGroup) => {
        return eipGroup.eips.map((eip) => ({
          month: eipGroup.month,
          year: eipGroup.year,
          category: eipGroup.category,
          eip: eip.eip,
          title: eip.title,
          status: eip.status,
          type: eip.type,
          discussion: eip.discussion,
          repo: eip.repo,
          author: eip.author,
          created: eip.created,
          deadline: eip.deadline || "",
        }));
      });
    });

    if (!transformedData.length) {
      alert("No data available for download.");
      return;
    }

    const header =
      "Month,Year,Category,EIP,Title,Author,Status,Type,Created at,Link\n";

    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      transformedData
        .map(
          ({
            month,
            year,
            category,
            repo,
            eip,
            title,
            author,
            status,
            type,
            discussion,
            created,
            deadline,
          }) => {
            const url =
              repo === "eip"
                ? `https://eipsinsight.com/eips/eip-${eip}`
                : repo === "erc"
                  ? `https://eipsinsight.com/ercs/erc-${eip}`
                  : `https://eipsinsight.com/rips/rip-${eip}`;

            return `${month},${year},"${category.replace(
              /"/g,
              '""'
            )}","${eip}","${title.replace(/"/g, '""')}","${author.replace(
              /"/g,
              '""'
            )}","${status.replace(/"/g, '""')}","${type.replace(
              /"/g,
              '""'
            )}","${created.replace(/"/g, '""')}","${url}"`;
          }
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eip_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box
          bgColor={bg}
          padding={{ base: "1.5rem", md: "2rem", lg: "2.5rem" }}
          borderRadius="0.75rem"
          maxW="full"
          boxShadow="md"
          mx="auto"
          maxWidth="900px"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb={{ base: 4, md: 6 }}
            flexWrap="wrap"
            gap={{ base: 2, md: 0 }}
          >
            <Heading
              size={{ base: "md", md: "lg" }}
              color={headingColor}
              flex="1"
              minW="150px"
            >
              {`${status}`}
            </Heading>
            {showDownloadButton && (
              <Button
                colorScheme="blue"
                onClick={async () => {
                  try {
                    downloadData();
                    await axios.post("/api/DownloadCounter");
                  } catch (error) {
                    console.error("Error triggering download counter:", error);
                  }
                }}
                size={{ base: "sm", md: "md" }}
                whiteSpace="nowrap"
              >
                Download CSV
              </Button>
            )}

          </Flex>

          <Box
            overflowX={{ base: "auto", md: "visible" }}
            paddingBottom={{ base: 4, md: 0 }}
            w="100%"
          >
            <Area {...config} />
          </Box>

          <Box overflowX={{ base: "auto", md: "visible" }} mt={6}>
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedColumnChart;
