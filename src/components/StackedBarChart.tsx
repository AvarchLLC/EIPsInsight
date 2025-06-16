// // import React, { useEffect, useState } from "react";
// // import dynamic from "next/dynamic";
// // import { Box, useColorModeValue, Spinner, Flex, Heading, Button } from "@chakra-ui/react";
// // import { useWindowSize } from "react-use";
// // import { motion } from "framer-motion";
// // import DateTime from "@/components/DateTime";
// // import axios from "axios";


// // const getCat = (cat: string) => {
// //   switch (cat) {
// //     case "Standards Track":
// //     case "Standard Track":
// //     case "Standards Track (Core, Networking, Interface, ERC)":
// //     case "Standard":
// //     case "Process":
// //     case "Core":
// //     case "core":
// //       return "Core";
// //     case "RIP":
// //       return "RIPs";
// //     case "ERC":
// //       return "ERCs";
// //     case "Networking":
// //       return "Networking";
// //     case "Interface":
// //       return "Interface";
// //     case "Meta":
// //       return "Meta";
// //     case "Informational":
// //       return "Informational";
// //     default:
// //       return "Core";
// //   }
// // };
// // interface AreaProps {
// //   data: MappedDataItem[];
// //   xField: string;
// //   yField: string;
// //   color: string[];
// //   seriesField: string;
// //   xAxis: {
// //     range: number[];
// //     tickCount: number;
// //   };
// //   areaStyle: {
// //     fillOpacity: number;
// //   };
// //   legend: {
// //     position: string;
// //   };
// //   smooth: boolean;
// // }

// // interface MappedDataItem {
// //   category: string;
// //   date: string;
// //   value: number;
// // }

// // interface EIP2 {
// //   _id: string;
// //   eip: string;
// //   title: string;
// //   author: string;
// //   status: string;
// //   type: string;
// //   category: string;
// //   created: string;
// //   discussion: string;
// //   deadline: string;
// //   requires: string;
// //   unique_ID: number;
// //   __v: number;
// //   repo: string;
// // }

// // interface EIP {
// //   status: string;
// //   eips: {
// //     status: string;
// //     month: number;
// //     year: number;
// //     date: string;
// //     count: number;
// //     category: string;
// //     eips: EIP2[];
// //   }[];
// // }

// // interface FormattedEIP {
// //   category: string;
// //   date: string;
// //   value: number;
// // }

// // const categoryColors: string[] = [
// //   "rgb(255, 99, 132)",
// //   "rgb(255, 159, 64)",
// //   "rgb(255, 205, 86)",
// //   "rgb(75, 192, 192)",
// //   "rgb(54, 162, 235)",
// //   "rgb(153, 102, 255)",
// //   "rgb(255, 99, 255)",
// //   "rgb(50, 205, 50)",
// //   "rgb(255, 0, 0)",
// //   "rgb(0, 128, 0)",
// // ];
// // const categoryBorder: string[] = [
// //   "rgba(255, 99, 132, 0.2)",
// //   "rgba(255, 159, 64, 0.2)",
// //   "rgba(255, 205, 86, 0.2)",
// //   "rgba(75, 192, 192, 0.2)",
// //   "rgba(54, 162, 235, 0.2)",
// //   "rgba(153, 102, 255, 0.2)",
// //   "rgba(255, 99, 255, 0.2)",
// //   "rgba(50, 205, 50, 0.2)",
// //   "rgba(255, 0, 0, 0.2)",
// //   "rgba(0, 128, 0, 0.2)",
// // ];

// // interface AreaCProps {
// //   dataset: APIResponse;
// //   status: string;
// //   type: string;
// // }
// // interface APIResponse {
// //   eip: EIP[];
// //   erc: EIP[];
// //   rip: EIP[];
// // }

// // const StackedColumnChart: React.FC<AreaCProps> = ({ dataset, status, type }) => {
// //   const [data, setData] = useState<APIResponse>();
// //   const windowSize = useWindowSize();
// //   const bg = useColorModeValue("#f6f6f7", "#171923");
// //   const [isLoading, setIsLoading] = useState(true);
// //   console.log(dataset);
// //   console.log(status);
// //   console.log(type);

// //   const [typeData, setTypeData] = useState<EIP[]>([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const jsonData = dataset;
// //         setData(jsonData);
// //         if (type === "EIPs" && jsonData.eip) {
// //           setTypeData(
// //             jsonData.eip.filter((item: any) => item.category !== "ERCs")
// //           );
// //           console.log(jsonData.eip.filter((item: any) => item.category !== "ERCs"));
// //         } else if (type === "ERCs" && jsonData.erc) {
// //           setTypeData(jsonData.erc);
// //         }
// //         setIsLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching data:", error);
// //       }
// //     };

// //     fetchData();
// //   }, [dataset]);

// //   useEffect(() => {
// //     if (type === "EIPs") {
// //       setTypeData(data?.eip || []);
// //     } else if (type === "ERCs") {
// //       setTypeData(data?.erc || []);
// //     }
// //   });

// //   const [isChartReady, setIsChartReady] = useState(false);

// //   useEffect(() => {
// //     setIsChartReady(true);
// //   }, []);

// //   const filteredData = typeData.filter((item) => item.status === status);
// //   console.log(data);
// //   console.log(typeData)
// //   console.log(filteredData)

// //   const transformedData = filteredData
// //     .flatMap((item) =>
// //       item.eips.map((eip) => ({
// //         category: getCat(eip.category),
// //         year: eip.year.toString(),
// //         value: eip.count,
// //       }))
// //     )
// //     .filter((item) => item.category !== "ERCs");
// //     console.log(transformedData);

// //   const Area = dynamic(
// //     () => import("@ant-design/plots").then((item) => item.Column),
// //     {
// //       ssr: false,
// //     }
// //   );

// //   const chartWidth = windowSize.width
// //     ? Math.min(windowSize.width * 0.6, 500)
// //     : "100%";
// //   const chartHeight = windowSize.height
// //     ? Math.min(windowSize.height * 0.6, 500)
// //     : "100%";

// //   const config = {
// //     data: transformedData,
// //     xField: "year",
// //     yField: "value",
// //     color: categoryColors,
// //     seriesField: "category",
// //     isStack: true,
// //     areaStyle: { fillOpacity: 0.6 },
// //     legend: { position: "top-right" as const },
// //     smooth: true,
// //     label: {
// //       position: "middle",
// //       style: {
// //         fill: "#FFFFFF",
// //         opacity: 0.6,
// //       },
// //     } as any,
// //   };

// //   const headingColor = useColorModeValue('black', 'white');

// //   const downloadData = () => {
// //     // Transform the `typeData` to extract the required details
// //     const transformedData = filteredData.flatMap((item) => {
// //         return item.eips.flatMap((eipGroup) => {
// //             return eipGroup.eips.map((eip) => ({
// //                 month: eipGroup.month, // Assuming eipGroup includes 'month'
// //                 year: eipGroup.year,  // Assuming eipGroup includes 'year'
// //                 category: eipGroup.category, // Category from the group
// //                 eip: eip.eip, // EIP number
// //                 title: eip.title, // Title of the EIP
// //                 status: eip.status, // Status of the EIP
// //                 type: eip.type, // Type of the EIP
// //                 discussion: eip.discussion, // Discussion link
// //                 repo: eip.repo, // Repo type (e.g., "eip", "erc", "rip")
// //                 author: eip.author, // Author of the EIP
// //                 created: eip.created, // Creation date
// //                 deadline: eip.deadline || "", // Deadline if exists, else empty
// //             }));
// //         });
// //     });

// //     if (!transformedData.length) {
// //         console.error("No data to transform.");
// //         alert("No data available for download.");
// //         return;
// //     }

// //     // Define the CSV header
// //     const header =
// //         "Month,Year,Category,EIP,Title,Author,Status,Type,Created at,Link\n";

// //     // Prepare the CSV content
// //     const csvContent =
// //         "data:text/csv;charset=utf-8," +
// //         header +
// //         transformedData
// //             .map(
// //                 ({
// //                     month,
// //                     year,
// //                     category,
// //                     repo,
// //                     eip,
// //                     title,
// //                     author,
// //                     status,
// //                     type,
// //                     discussion,
// //                     created,
// //                     deadline,
// //                 }) => {
// //                     // Generate the correct URL based on the repo type
// //                     const url =
// //                         repo === "eip"
// //                             ? `https://eipsinsight.com/eips/eip-${eip}`
// //                             : repo === "erc"
// //                             ? `https://eipsinsight.com/ercs/erc-${eip}`
// //                             : `https://eipsinsight.com/rips/rip-${eip}`;

// //                     // Return the CSV line with all fields
// //                     return `${month},${year},"${category.replace(
// //                         /"/g,
// //                         '""'
// //                     )}","${eip}","${title.replace(/"/g, '""')}","${author.replace(
// //                         /"/g,
// //                         '""'
// //                     )}","${status.replace(/"/g, '""')}","${type.replace(
// //                         /"/g,
// //                         '""'
// //                     )}","${created.replace(
// //                         /"/g,
// //                         '""'
// //                     )}","${url}"`;
// //                 }
// //             )
// //             .join("\n");

// //     // Encode the CSV content for downloading
// //     const encodedUri = encodeURI(csvContent);
// //     const link = document.createElement("a");
// //     link.setAttribute("href", encodedUri);
// //     link.setAttribute("download", "eip_data.csv");
// //     document.body.appendChild(link); // Required for Firefox
// //     link.click();
// //     document.body.removeChild(link);
// // };



// //   return (
// //     <>
// //       {isLoading ? ( // Show loader while data is loading
// //         <Box
// //           display="flex"
// //           justifyContent="center"
// //           alignItems="center"
// //           height="200px"
// //         >
// //           <Spinner />
// //         </Box>
// //       ) : (
// //         <Box bgColor={bg} padding={"2rem"} borderRadius={"0.55rem"}>
// //   <Flex justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
// //     <Heading size="md" color={headingColor}>
// //       {`${status}`}
// //     </Heading>
// //     {/* Assuming a download option exists for the yearly data as well */}
// //     {/* <Button 
// //       colorScheme="blue" 
// //       onClick={async () => {
// //         try {
// //           // Trigger the CSV conversion and download
// //           downloadData();

// //           // Trigger the API call
// //           await axios.post("/api/DownloadCounter");
// //         } catch (error) {
// //           console.error("Error triggering download counter:", error);
// //         }
// //       }}
// //     >
// //       Download CSV
// //     </Button> */}
// //   </Flex>

// //   {/* Make the area chart scrollable on smaller screens */}
// //   <Box overflowX="auto">
// //     <Area {...config} />
// //   </Box>

// //   {/* Make the DateTime section scrollable in x-direction if necessary */}
// //   <Box className={"w-full"} overflowX="auto">
// //     <DateTime />
// //   </Box>
// // </Box>

// //       )}
// //     </>
// //   );
// // };

// // export default StackedColumnChart;

// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import {
//   Box,
//   useColorModeValue,
//   Spinner,
//   Flex,
//   Heading,
//   Button,
// } from "@chakra-ui/react";
// import { useWindowSize } from "react-use";
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

// interface AreaCProps {
//   dataset: APIResponse;
//   status: string;
//   type: string;
//   showDownloadButton?: boolean;

// }

// interface APIResponse {
//   eip: EIP[];
//   erc: EIP[];
//   rip: EIP[];
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

// const StackedBarChart: React.FC<AreaCProps> = ({ dataset, status, type }) => {
//   const [data, setData] = useState<any>([]);
//   const [filtered, setFiltered] = useState<any[]>([]);
//   const [fromYear, setFromYear] = useState("");
//   const [toYear, setToYear] = useState("");
//   const bg = useColorModeValue("#f6f6f7", "#171923");
//   const headingColor = useColorModeValue("black", "white");

//   type DatasetKey = "eip" | "erc" | "rip";

//   useEffect(() => {
//     const key = type.toLowerCase() as DatasetKey;
//     if (dataset[key]) {
//       setData(dataset[key]);
//     }
//   }, [dataset, type]);


//   useEffect(() => {
//     const result = data.filter((item: any) => item.status === status);
//     setFiltered(result);
//   }, [data, status]);

//   const transformed = filtered.flatMap((item) =>
//     item.eips?.map((eip: { category: any; year: { toString: () => any; }; count: any; }) => ({
//       category: eip.category,
//       year: eip.year?.toString(),
//       value: eip.count,
//     }))
//   );

//   const years = Array.from(new Set(transformed.map((d) => d.year))).sort();

//   const Area = dynamic(() => import("@ant-design/plots").then((m) => m.Column), {
//     ssr: false,
//   });

//   const config = {
//     data: transformed,
//     xField: "year",
//     yField: "value",
//     color: [
//       "rgb(255, 99, 132)",
//       "rgb(255, 159, 64)",
//       "rgb(255, 205, 86)",
//       "rgb(75, 192, 192)",
//       "rgb(54, 162, 235)",
//       "rgb(153, 102, 255)",
//     ],
//     seriesField: "category",
//     isStack: true,
//     legend: { position: "bottom-right" as const },
//     smooth: true,
//     label: {
//       position: "middle" as "middle",
//       style: {
//         fill: "#FFFFFF",
//         opacity: 0.6,
//       },
//     },
//   };

//   const downloadData = () => {
//     const filteredTransformed = filtered.flatMap((item) =>
//       item.eips
//         .filter((eipGroup: { year: any; }) => {
//           const year = eipGroup.year;
//           const from = fromYear ? parseInt(fromYear) : -Infinity;
//           const to = toYear ? parseInt(toYear) : Infinity;
//           return year >= from && year <= to;
//         })
//         .flatMap((eipGroup: { eips: any[]; year: any; month: any; category: any; }) =>
//           eipGroup.eips.map((eip: any) => ({
//             ...eip,
//             year: eipGroup.year,
//             month: eipGroup.month,
//             category: eipGroup.category,
//           }))
//         )
//     );

//     if (!filteredTransformed.length) {
//       alert("No data for selected years.");
//       return;
//     }

//     const header =
//       "Month,Year,Category,EIP,Title,Author,Status,Type,Created at,Link\n";

//     const csv = header +
//       filteredTransformed
//         .map((d) => {
//           const link = `https://eipsinsight.com/${d.repo}s/${d.repo}-${d.eip}`;
//           return `${d.month},${d.year},"${d.category}","${d.eip}","${d.title.replace(/"/g, '""')}","${d.author.replace(/"/g, '""')}","${d.status}","${d.type}","${d.created}","${link}"`;
//         })
//         .join("\n");

//     const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
//     const link = document.createElement("a");
//     link.setAttribute("href", encoded);
//     link.setAttribute("download", "eip_data.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <>
//       {!filtered.length ? (
//         <Box display="flex" justifyContent="center" alignItems="center" h="200px">
//           <Spinner />
//         </Box>
//       ) : (
//         <Box bgColor={bg} padding="2rem" borderRadius="0.55rem">
//           <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={4}>
//             <Heading size="md" color={headingColor}>
//               {status} Over Time
//             </Heading>

//             <Flex gap={2} align="center" wrap="wrap">
//               <select
//                 value={fromYear}
//                 onChange={(e) => setFromYear(e.target.value)}
//                 className="border rounded px-2 py-1"
//               >
//                 <option value="">From Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>{year}</option>
//                 ))}
//               </select>

//               <select
//                 value={toYear}
//                 onChange={(e) => setToYear(e.target.value)}
//                 className="border rounded px-2 py-1"
//               >
//                 <option value="">To Year</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>{year}</option>
//                 ))}
//               </select>

//               <Button
//                 bg="#40E0D0"
//                 color="white"
//                 _hover={{ bg: "#30c9c9" }}
//                 _active={{ bg: "#1fb8b8" }}
//                 onClick={downloadData}
//                 size="sm"
//               >
//                 Download CSV
//               </Button>
//             </Flex>
//           </Flex>

//           <Box overflowX="auto">
//             <Area {...config} />
//           </Box>

//           <Box overflowX="auto">
//             <DateTime />
//           </Box>
//         </Box>
//       )}
//     </>
//   );
// };

// export default StackedBarChart;

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

interface AreaCProps {
  dataset: APIResponse;
  status: string;
  type: string;
}

interface APIResponse {
  eip: EIP[];
  erc: EIP[];
  rip: EIP[];
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
    eips: EIPDetails[];
  }[];
}

interface EIPDetails {
  eip: string;
  title: string;
  author: string;
  status: string;
  type: string;
  category: string;
  created: string;
  discussion: string;
  deadline: string;
  repo: string;
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
    case "ERC":
      return "ERCs";
    case "RIP":
      return "RIPs";
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

const StackedBarChart: React.FC<AreaCProps> = ({ dataset, status, type }) => {
  const [typeData, setTypeData] = useState<EIP[]>([]);
  const [fromYear, setFromYear] = useState<string>("");
  const [toYear, setToYear] = useState<string>("");
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const headingColor = useColorModeValue("black", "white");

  useEffect(() => {
    if (type === "EIPs") {
      setTypeData(dataset.eip || []);
    } else if (type === "ERCs") {
      setTypeData(dataset.erc || []);
    } else if (type === "RIPs") {
      setTypeData(dataset.rip || []);
    }
  }, [dataset, type]);

  const filteredData = typeData.filter((item) => item.status === status);

  const transformedData = filteredData.flatMap((item) =>
    item.eips.map((group) => ({
      category: getCat(group.category),
      year: group.year.toString(),
      value: group.count,
    }))
  );

  const Area = dynamic(() => import("@ant-design/plots").then((mod) => mod.Column), {
    ssr: false,
  });

  const config = {
    data: transformedData,
    xField: "year",
    yField: "value",
    color: categoryColors,
    seriesField: "category",
    isStack: true,
    legend: { position: "bottom-right" as const },
    smooth: true,
    label: {
      position: "middle" as "middle", // ✅ correct TS type
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
  };

  const years = Array.from(new Set(transformedData.map((d) => d.year))).sort();

  const downloadData = () => {
    const filtered = filteredData.filter((item) =>
      item.eips.some((group) => {
        const year = group.year;
        const from = fromYear ? parseInt(fromYear) : -Infinity;
        const to = toYear ? parseInt(toYear) : Infinity;
        return year >= from && year <= to;
      })
    );

    const all = filtered.flatMap((item) =>
      item.eips
        .filter((group) => {
          const year = group.year;
          return (
            (!fromYear || year >= parseInt(fromYear)) &&
            (!toYear || year <= parseInt(toYear))
          );
        })
        .flatMap((group) =>
          group.eips.map((eip) => ({
            ...eip,
            month: group.month,
            year: group.year,
            category: group.category,
          }))
        )
    );

    if (!all.length) {
      alert("No data available for the selected year range.");
      return;
    }

    const header = "Month,Year,Category,EIP,Title,Author,Status,Type,Created,Link\n";
    const csv = header + all
      .map((d) => {
        const link = `https://eipsinsight.com/${d.repo}s/${d.repo}-${d.eip}`;
        return `${d.month},${d.year},"${d.category}","${d.eip}","${d.title.replace(/"/g, '""')}","${d.author.replace(/"/g, '""')}","${d.status}","${d.type}","${d.created}","${link}"`;
      })
      .join("\n");

    const encoded = encodeURI("data:text/csv;charset=utf-8," + csv);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `EIP_Data_${status}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {!filteredData.length ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner />
        </Box>
      ) : (
        <Box bgColor={bg} padding="2rem" borderRadius="0.55rem">
          <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={4}>
            <Heading size="md" color={headingColor}>
              {status} Over Time
            </Heading>

            <Flex gap={2} align="center" wrap="wrap">
              <select
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">From Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="">To Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <Button
                bg="#40E0D0"
                color="white"
                _hover={{ bg: "#30c9c9" }}
                _active={{ bg: "#1fb8b8" }}
                onClick={downloadData}
                size="sm"
              >
                Download CSV
              </Button>
            </Flex>
          </Flex>

          <Box overflowX="auto">
            <Area {...config} />
          </Box>

          <Box mt={4} overflowX="auto">
            <DateTime />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StackedBarChart;
