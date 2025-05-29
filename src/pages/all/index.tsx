// import React, { useState, useEffect } from "react";
// import AllLayout from "@/components/Layout";
// import {
//   Box,
//   Spinner,
//   useColorModeValue,
//   Text, 
//   Button,
//   Wrap,
//   WrapItem,
//   Heading,
// } from "@chakra-ui/react";
// import CatTable from "@/components/CatTable";
// import RipCatTable from "@/components/RipCatTable";
// import SearchBox from "@/components/SearchBox";
// import Link from "next/link";
// import axios from "axios";
// import { DownloadIcon } from "@chakra-ui/icons";
// import { motion } from "framer-motion";

// const sections = [
//   { id: "living", text: "Living" },
//   { id: "final", text: "Final" },
//   { id: "last-call", text: "Last Call" },
//   { id: "review", text: "Review" },
//   { id: "draft", text: "Draft" },
//   { id: "withdrawn", text: "Withdrawn" },
//   { id: "stagnant", text: "Stagnant" },
// ];

// const MotionBox = motion(Box);


// interface EIP {
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
//   repo:string;
//   unique_ID: number;
//   __v: number;
// }

// const All = () => {
//   const [selected, setSelected] = useState("All");
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [data, setData] = useState<EIP[]>([]);
//   const [data2, setData2] = useState<EIP[]>([]);
//   const [data3, setData3] = useState<EIP[]>([]);
//   const [loading, setLoading] = useState(false); 

//     const [isVisible, setIsVisible] = useState(false);
//     let timeout: string | number | NodeJS.Timeout | undefined;

//     useEffect(() => {
//       const handleScroll = () => {
//         setIsVisible(true);
//         clearTimeout(timeout);
//         timeout = setTimeout(() => setIsVisible(false), 1000); // Hide after 1s of no scroll
//       };

//       window.addEventListener("scroll", handleScroll);
//       return () => {
//         window.removeEventListener("scroll", handleScroll);
//         clearTimeout(timeout);
//       };
//     }, []);

//   useEffect(() => {
//     // Check if a hash exists in the URL
//     const hash = window.location.hash.slice(1); // Remove the '#' character
//     if (hash && optionArr.includes(hash)) {
//       setSelected(hash);
//     }
//   }, []); // Empty dependency array to run only on component mount

//   const handleSelection = (item:any) => {
//     setSelected(item);
//     window.location.hash = item; // Update the hash in the URL
//   };

//   const optionArr = [
//     "All",
//     "EIP",
//     "ERC",
//     "RIP",
//   ];
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     if (bg === "#f6f6f7") {
//       setIsDarkMode(false);
//     } else {
//       setIsDarkMode(true);
//     }
//   },);

//   useEffect(() => {
//     const fetchData = async () => {
//       try { 
//         setLoading(true);
//         const response = await fetch(`/api/new/all`);
//         const jsonData = await response.json();
//         setData(jsonData.eip.concat(jsonData.erc).concat(jsonData.rip));
//         const alldata=jsonData.eip.concat(jsonData.erc).concat(jsonData.rip);
//         let filteredData = alldata
//         .filter((item:any) => item.category === selected);
//         if(selected==="All"){
//           filteredData=alldata;
//         }

//         setData2(filteredData);
//         console.log("all data:",alldata);
//         console.log("filtered data:", filteredData);

//         let filteredData2 = alldata
//         .filter((item:any) => item.repo === 'rip');

//         setData3(filteredData2);

//         setLoading(false);
//         setIsLoading(false); // Set isLoading to false after data is fetched
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsLoading(false); // Set isLoading to false if there's an error
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(()=>{
//         let filteredData = data
//         .filter((item:any) => item.category === selected);
//         if(selected==="All"){
//           filteredData=data;
//         }
//         console.log("main data:", filteredData);

//         setData2(filteredData);
//   },[selected]);

//   const handleDownload = () => {
//     // Filter data based on the selected category
//     let filteredData;
//     if(selected!=='RIP'){
//     filteredData = data
//         .filter((item) => (selected==="All"||item.category === selected))
//         .map((item) => {
//             const { repo, eip, title, author, discussion, status, deadline, type, category,created } = item;
//             return { repo, eip, title, author, discussion, status, deadline, type, category,created };
//         });
//       }
//     else{
//     filteredData=data
//     .filter((item) => item.repo === 'rip')
//         .map((item) => {
//             const { repo, eip, title, author, discussion, status, deadline, type, category,created } = item;
//             return { repo, eip, title, author, discussion, status, deadline, type, category,created };
//         });
//     }

//     // Check if there's any data to download
//     if (filteredData.length === 0) {
//         console.log("No data available for download.");
//         return; // Exit if no data is present
//     }

//     // Define the CSV header
//     const header = "Repo, EIP, Title, Author,Status, deadline, Type, Category, Discussion, Created at, Link\n";

//     // Prepare the CSV content
//     const csvContent = "data:text/csv;charset=utf-8,"
//     + header
//     + filteredData.map(({ repo, eip, title, author, discussion, status, deadline, type, category, created }) => {
//         // Generate the correct URL based on the repo type
//         const url = repo === "eip"
//             ? `https://eipsinsight.com/eips/eip-${eip}`
//             : repo === "erc"
//             ? `https://eipsinsight.com/ercs/erc-${eip}`
//             : `https://eipsinsight.com/rips/rip-${eip}`;

//         // Wrap title and author in double quotes to handle commas
//         return `"${repo}","${eip}","${title.replace(/"/g, '""')}","${author.replace(/"/g, '""')}","${status.replace(/"/g, '""')}","${deadline ? deadline.replace(/"/g, '""') : '-'}","${type.replace(/"/g, '""')}","${category.replace(/"/g, '""')}","${discussion.replace(/"/g, '""')}","${created.replace(/"/g, '""')}","${url}"`; }).join("\n");


//     // Check the generated CSV content before download
//     console.log("CSV Content:", csvContent);

//     // Encode the CSV content for downloading
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `${selected}.csv`); // Name your CSV file here
//     document.body.appendChild(link); // Required for Firefox
//     link.click();
//     document.body.removeChild(link);
// };




//   const bg = useColorModeValue("#f6f6f7", "#171923");




//   return (
//     <>
//       <AllLayout>
//         <Box
//           paddingBottom={{ lg: "10", sm: "10", base: "10" }}
//           marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
//           paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
//           marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
//         >
//     <Box
//       as="aside"
//       p={4}
//       bg="gray.100"
//       borderRadius="lg"
//       position="fixed"
//       right="20px"
//       top="80px"
//       width="250px"
//       maxHeight="80vh"
//       overflowY="auto"
//       boxShadow="md"
//       zIndex="10"
//       display={{ base: "none", lg: "block" }} // Hide on mobile
//       opacity={isVisible ? 1 : 0}
//       transition="opacity 0.3s ease-in-out"
//       pointerEvents={isVisible ? "auto" : "none"} // Prevent interaction when hidden
//     >
//       <Heading as="h3" size="md" mb={2}>
//         On this page
//       </Heading>
//       <ul style={{ listStyleType: "none", padding: 0 }}>
//         {sections.map(({ id, text }) => (
//           <li key={id} style={{ marginBottom: "8px" }}>
//             <Link href={`#${id}`} color="blue.600" style={{ textDecoration: "none" }}>
//               {text}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </Box>
//           <Box className="flex space-x-12 w-full justify-center items-center text-xl font-semibold py-8">
//             <div className="flex justify-between w-full">
//             <Box>
//               {/* For larger screens, render buttons */}
//               <Box display={{ base: "none", md: "flex" }} className="space-x-6">
//               {optionArr.map((item, key) => {
//                 if (item === "All") {
//                   return (
//                     <button
//                       key={key}
//                       className="underline underline-offset-4"
//                     >
//                       {item}
//                     </button>
//                   );
//                 }

//                 const link = `/${item.toLowerCase()}`;

//                 return (
//                   <a
//                     href={link}
//                     key={key}
//                     className="mr-4"
//                   >
//                     <button>
//                       {item}
//                     </button>
//                   </a>
//                 );
//               })}
//               </Box>

//               {/* For smaller screens, render a dropdown */}
//               <Box display={{ base: "block", md: "none" }}
//               className="w-full max-w-md" 
//               mx="auto" // Horizontal centering
//               textAlign="center" 
//               >
//                 <select
//                   value={selected}
//                   onChange={(e) => setSelected(e.target.value)}
//                   style={{
//                     padding: "8px",
//                     borderRadius: "4px",
//                     borderColor: "gray",
//                     fontSize: "16px",
//                   }}
//                 >
//                   {optionArr.map((item, key) => (
//                     <option value={item} key={key}>
//                       {item}
//                     </option>
//                   ))}
//                 </select>
//               </Box>
//             </Box>

//             {/* <Box 
//               display={{ base: "none", lg: "block" }} 
//               className="w-full max-w-md" 
//               ml={4} // Adjust the value as needed
//             >
//               <SearchBox />
//             </Box> */}

//             </div>
//           </Box>
//           <Box 
//           display={{ base: "block", md: "block", lg: "none" }} 
//           className="w-full max-w-md" 
//           mx="auto" // Horizontal centering
//           textAlign="center" // Ensures content inside the box is centered
//         >
//           <SearchBox />
//         </Box>

//           <>
//       {loading ? (
//         <MotionBox
//           mt={8}
//           textAlign="center"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.8 }}
//           transition={{
//             duration: 0.5,
//             repeat: Infinity,
//             repeatType: "reverse", // Pulsating effect
//           }}
//         >
//           <Spinner size="xl" color="blue.500" />
//           <Text
//             mt={4}
//             fontSize="lg"
//             color={useColorModeValue("gray.700", "gray.300")}
//           >
//             Fetching data...
//           </Text>
//         </MotionBox>
//       ) : (
//         <></>
//       )}
//     </>

//           {selected === "RIP" ? (
//             <Box>
//               {!loading && (
//     <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center">
//       <Button
//         colorScheme="blue"
//         fontSize={{ base: "0.6rem", md: "md" }}
//         onClick={async () => {
//           try {
//             // Trigger the CSV conversion and download
//             handleDownload();

//             // Trigger the API call
//             await axios.post("/api/DownloadCounter");
//           } catch (error) {
//             console.error("Error triggering download counter:", error);
//           }
//         }}
//         isLoading={loading} // Show loading spinner on button
//         loadingText="Downloading" // Optional loading text
//         isDisabled={loading} // Disable button when loading
//       >
//        <DownloadIcon marginEnd={"1.5"} /> Download CSV
//       </Button>

// </Box>)}

// <div id="living">
//   <RipCatTable dataset={data3} cat={selected} status={"Living"} />
// </div>
// <div id="final">
//   <RipCatTable dataset={data3} cat={selected} status={"Final"} />
// </div>
// <div id="lastcall">
//   <RipCatTable dataset={data3} cat={selected} status={"Last Call"} />
// </div>
// <div id="review">
//   <RipCatTable dataset={data3} cat={selected} status={"Review"} />
// </div>
// <div id="draft">
//   <RipCatTable dataset={data3} cat={selected} status={"Draft"} />
// </div>
// <div id="withdrawn">
//   <RipCatTable dataset={data3} cat={selected} status={"Withdrawn"} />
// </div>
// <div id="stagnant">
//   <RipCatTable dataset={data3} cat={selected} status={"Stagnant"} />
// </div>

//           </Box>
//           ) : (
//             <Box>
//               <Box>
//   {selected === "Meta" || selected === "All" ? (
//     <Box>
//      {!loading && (
//       <Box  mt={2} display="flex" justifyContent="space-between" alignItems="center">
//       <Box color="gray.500" fontStyle="italic">
//         * EIP-1 is available both on EIP GitHub and ERC GitHub, so the count can vary by 1.
//       </Box>
//       <Button
//         colorScheme="blue"
//         onClick={async () => {
//           try {
//             // Trigger the CSV conversion and download
//             handleDownload();

//             // Trigger the API call
//             await axios.post("/api/DownloadCounter");
//           } catch (error) {
//             console.error("Error triggering download counter:", error);
//           }
//         }}
//         isLoading={loading} // Show loading spinner on button
//         loadingText="Downloading" // Optional loading text
//         isDisabled={loading} // Disable button when loading
//       >
//        <DownloadIcon marginEnd={"1.5"} /> Download CSV
//       </Button>
//     </Box> )}
//     </Box>
//   ) : (

//     <Box mt={2} display="flex" justifyContent="flex-end" alignItems="center">
//       <Button
//         colorScheme="blue"
//         onClick={async () => {
//           try {
//             // Trigger the CSV conversion and download
//             handleDownload();

//             // Trigger the API call
//             await axios.post("/api/DownloadCounter");
//           } catch (error) {
//             console.error("Error triggering download counter:", error);
//           }
//         }}
//         isLoading={loading} // Show loading spinner on button
//         loadingText="Downloading" // Optional loading text
//         isDisabled={loading} // Disable button when loading
//       >
//         Download CSV
//       </Button>
//     </Box>
//   )}
// </Box>

// <div id="living">
//   <CatTable dataset={data2} cat={selected} status={"Living"} />
// </div>
// <div id="final">
//   <CatTable dataset={data2} cat={selected} status={"Final"} />
// </div>
// <div id="lastcall">
//   <CatTable dataset={data2} cat={selected} status={"Last Call"} />
// </div>
// <div id="review">
//   <CatTable dataset={data2} cat={selected} status={"Review"} />
// </div>
// <div id="draft">
//   <CatTable dataset={data2} cat={selected} status={"Draft"} />
// </div>
// <div id="withdrawn">
//   <CatTable dataset={data2} cat={selected} status={"Withdrawn"} />
// </div>
// <div id="stagnant">
//   <CatTable dataset={data2} cat={selected} status={"Stagnant"} />
// </div>

//             </Box>
//           )}
//         </Box>
//       </AllLayout>
//     </>
//   );
// };

// export default All;
import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  Text,
  Button,
  useColorModeValue,
  Badge,
  Wrap,
  WrapItem,
  Link as ChakraLink,
} from "@chakra-ui/react";
import SearchBox from "@/components/SearchBox";
import { DownloadIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { CSmartTable, CCardBody } from "@coreui/react-pro";
import "@coreui/coreui/dist/css/coreui.min.css";
import axios from "axios";


const MotionBox = motion(Box);
interface EIP {
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
  repo: string;
  unique_ID: number;
  __v: number;
}


const All = () => {
  const [selected, setSelected] = useState("All");
  const [data, setData] = useState<EIP[]>([]);
  const [filteredData, setFilteredData] = useState<EIP[]>([]);
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("#f6f6f7", "#171923");
  const isDarkMode = bg !== "#f6f6f7";

  const categories = ["All", "EIP", "ERC", "RIP"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        const allData = [...jsonData.eip, ...jsonData.erc, ...jsonData.rip];
        setData(allData);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selected === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) => item.repo.toLowerCase() === selected.toLowerCase()
      );
      setFilteredData(filtered);
    }
  }, [selected, data]);

  const handleDownload = () => {
    const exportData =
      selected === "All"
        ? data
        : data.filter((item) => item.repo === selected.toLowerCase());

    if (exportData.length === 0) return;

    const header =
      "Repo,EIP,Title,Author,Status,Deadline,Type,Category,Discussion,Created at,Link\n";
    const csvContent =
      "data:text/csv;charset=utf-8," +
      header +
      exportData
        .map(
          ({
            repo,
            eip,
            title,
            author,
            discussion,
            status,
            deadline,
            type,
            category,
            created,
          }) => {
            const url =
              repo === "eip"
                ? `https://eipsinsight.com/eips/eip-${eip}`
                : repo === "erc"
                  ? `https://eipsinsight.com/ercs/erc-${eip}`
                  : `https://eipsinsight.com/rips/rip-${eip}`;
            return `"${repo}","${eip}","${(title || "").replace(/"/g, '""')}","${(author || "").replace(/"/g, '""')}","${(status || "").replace(/"/g, '""')}","${(deadline || "-").replace(/"/g, '""')}","${(type || "").replace(/"/g, '""')}","${(category || "").replace(/"/g, '""')}","${(discussion || "").replace(/"/g, '""')}","${(created || "").replace(/"/g, '""')}","${url}"`;
          }
        )

        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selected}_eips.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const factorAuthor = (data: string): string[][] => {
    const authors = data.split(",").map((a) => a.trim().split(" "));
    if (
      authors.length &&
      authors[authors.length - 1][authors[authors.length - 1].length - 1] === "al."
    ) {
      authors.pop(); // Remove "et al." if present
    }
    return authors;
  };


  const getStatusColor = (status: any) => {
    switch (status) {
      case "Meta":
      case "Informational":
        return "blue";
      case "Core":
        return "purple";
      case "Networking":
        return "orange";
      case "Interface":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <AllLayout>
      <Box
        px={{ base: 4, md: 10 }}
        mt={{ base: 5, md: 10 }}
        pb={10}
        mx={{ lg: "40", base: "2" }}
      >
        {/* Filters */}
        <Box
          className="flex justify-between items-center flex-wrap gap-4"
          pb={6}
        >
          <Box display={{ base: "none", md: "flex" }} gap={4}>
            {categories.map((item) => (
              <Button
                key={item}
                variant={item === selected ? "solid" : "ghost"}
                colorScheme="blue"
                onClick={() => setSelected(item)}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box display={{ base: "block", md: "none" }}>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                fontSize: "16px",
                width: "100%",
              }}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Box>

          <Box flex={1}>
            <SearchBox />
          </Box>
        </Box>

        {/* Download Button */}
        <Box display="flex" justifyContent="flex-end" mb={4}>
          <Button
            colorScheme="blue"
            onClick={async () => {
              handleDownload();
              await axios.post("/api/DownloadCounter");
            }}
          >
            <DownloadIcon mr={2} />
            Download CSV
          </Button>
        </Box>

        {/* Table */}
        {loading ? (
          <MotionBox
            mt={8}
            textAlign="center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Spinner size="xl" color="blue.500" />
            <Text mt={4} fontSize="lg">
              Fetching data...
            </Text>
          </MotionBox>
        ) : (
          <Box bg={bg} borderRadius="md" p={4} overflowX="auto">
            <CCardBody>
              <CSmartTable
                items={filteredData}
                clickableRows
                columnFilter
                columnSorter
                pagination={false}
                tableProps={{
                  hover: true,
                  responsive: true,
                }}

                columns={[
                  { key: "repo", label: "Repo" },
                  { key: "eip", label: "EIP" },
                  { key: "title", label: "Title" },
                  { key: "author", label: "Author" },
                  { key: "type", label: "Type" },
                  { key: "category", label: "Category" },
                  { key: "status", label: "Status" },
                ]}
                scopedColumns={{
                  eip: (item: { repo: string; eip: any; status: any }) => (
                    <td className={isDarkMode ? "text-white" : "text-black"}>
                      <ChakraLink
                        href={`/${item.repo === "erc"
                            ? "ercs/erc"
                            : item.repo === "rip"
                              ? "rips/rip"
                              : "eips/eip"
                          }-${item.eip}`}
                        target="_blank"
                      >
                        <Badge colorScheme={getStatusColor(item.status)}>
                          {`${item.repo.toUpperCase()}-${item.eip}`}
                        </Badge>
                      </ChakraLink>
                    </td>
                  ),
                  title: (item: { repo: string; eip: any; title: string }) => (
                    <td>
                      <ChakraLink
                        href={`/${item.repo === "erc"
                          ? "ercs/erc"
                          : item.repo === "rip"
                            ? "rips/rip"
                            : "eips/eip"
                          }-${item.eip}`}
                        target="_blank"
                        className={isDarkMode ? "text-white" : "text-black"} // Adjust text color based on theme
                      >
                        {item.title}
                      </ChakraLink>
                    </td>
                  ),
                  author: (item: { author: string }) => (
                    <td
                      style={{
                        backgroundColor: isDarkMode ? "#2D3748" : "#F7FAFC", // Adjust background color based on theme
                      }}
                      className={isDarkMode ? "text-white" : "text-black"} // Adjust text color based on theme
                    >
                      <div>
                        {factorAuthor(item.author).map((authorPart, index) => {
                          const lastToken = authorPart[authorPart.length - 1];
                          const isEmail = lastToken.endsWith(">");
                          const clean = lastToken.substring(1, lastToken.length - 1);

                          const link = isEmail && clean.includes("@")
                            ? `mailto:${clean}`
                            : `https://github.com/${clean.replace(/^@/, "")}`;

                          return (
                            <Wrap key={index}>
                              <WrapItem>
                                <ChakraLink
                                  href={link}
                                  target="_blank"
                                  className={
                                    isDarkMode
                                      ? "hover:text-[#1c7ed6] text-[13px] text-white"
                                      : "hover:text-[#1c7ed6] text-[13px] text-black"
                                  } // Adjust text color based on theme
                                >
                                  {authorPart.join(" ")}
                                </ChakraLink>
                              </WrapItem>
                            </Wrap>
                          );
                        })}
                      </div>
                    </td>
                  ),
                  type: (item: { type: string }) => (
                    <td className={isDarkMode ? "text-white" : "text-black"}> // Adjust text color based on theme
                      {item.type}
                    </td>
                  ),
                  category: (item: { category: string }) => (
                    <td className={isDarkMode ? "text-white" : "text-black"}> // Adjust text color based on theme
                      {item.category}
                    </td>
                  ),
                  status: (item: { status: string }) => (
                    <td>
                      <Badge colorScheme={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </td>
                  ),
                  repo: (item: { repo: string }) => (
                    <td>
                      <Badge colorScheme="cyan">{item.repo.toUpperCase()}</Badge>
                    </td>
                  ),
                }}

              />
            </CCardBody>
          </Box>
        )}
      </Box>
    </AllLayout>
  );
};

export default All;
