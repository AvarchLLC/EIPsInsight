import AllLayout from "@/components/Layout";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import {
  Badge,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { motion } from "framer-motion";
import Prog from "@/components/Prog";
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
  unique_ID: number;
  __v: number;
}

const getStatus = (status: string) => {
  switch (status) {
    case "Draft":
      return "Draft";
    case "Final" || "Accepted" || "Superseded":
      return "Final";
    case "Last Call":
      return "Last Call";
    case "Withdrawn" || "Abandoned" || "Rejected":
      return "Withdrawn";
    case "Review":
      return "Review";
    case "Living" || "Active":
      return "Living";
    case "Stagnant":
      return "Stagnant";
    default:
      return "Final";
  }
};

interface ContentData {
  content: string;
}
// const StatusContent: React.FC<{ status: string }> = ({ status }) => {
//   const pathname = usePathname();
//   const pathnameParts = pathname ? pathname.split("/") : [];
//   const file = pathnameParts[1] || "";
//   const type = file.split('/');
//   if (status === "Final") {
//     return <Prog num={`${thirdPart}`}/>
//   }
// };

const EIP = () => {
  const pathname = usePathname();
  const pathnameParts = pathname ? pathname.split("/") : [];
  const part = pathnameParts[1] || "";
  const number = part.split("-")[1];
  const cat = part.split("-")[0];
  const [data, setData] = useState<EIP | null>(null); // Set initial state as null
  const [con, setcon] = useState<ContentData | undefined>(undefined);

  const fetchContent = async () => {
    try {
      if (cat === "erc") {
        const response = await fetch(`/api/new/erccontent/${number}`);
        const jsonD = await response.json();
        setcon(jsonD);
      } else {
        const response = await fetch(`/api/new/eipcontent/${number}`);
        const jsonD = await response.json();
        setcon(jsonD);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (cat === "erc") {
          const response = await fetch(`/api/ercs/${number}`);
          const jsonData = await response.json();
          console.log(jsonData);
          setData(jsonData);
        } else {
          const response = await fetch(`/api/eips/${number}`);
          const jsonData = await response.json();
          console.log(jsonData);
          setData(jsonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchContent();
  }, [number]); // Add thirdPart as a dependency to re-fetch data when it changes

  return (
    <AllLayout>
      <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">
        {data !== null ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Header
                title={`${cat === "erc" ? "ERC" : "EIP"} - ${number}`}
                subtitle={data.title}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* <StatusContent status={data.status} /> */}
              <TableContainer paddingTop={6}>
                <Table variant="striped" minW="50%" maxH="50%" layout="fixed">
                  <Tbody>
                    {Object.entries(data).map(
                      ([key, value]) =>
                        key !== "requires" &&
                        key !== "unique_ID" &&
                        key !== "eip" &&
                        key !== "_id" &&
                        key !== "__v" &&
                        value && (
                          <Tr key={key}>
                            <Td>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </Td>
                            <Td>{value}</Td>
                          </Tr>
                        )
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </motion.div>
            {/* ... Other content with animations */}
            {con !== undefined ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="pt-5"
              >
                <ReactMarkdown
                  children={con.content}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: "17px",
                          fontWeight: "bold",
                          color: `#339af0`,
                          // borderBottom: `2px solid #339af0`,
                          borderLeft: `4px solid #339af0`,
                          display: "inline-block",
                        }}
                        className="my-3 px-2 rounded-sm"
                        {...props}
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: "22px",
                          fontWeight: "bold",
                          color: `#339af0`,
                          borderBottom: `2px solid #339af0`,
                          borderLeft: `4px solid #339af0`,
                          display: "inline-block",
                        }}
                        className="my-3 px-2 rounded-sm"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: "17px",
                          fontWeight: "bold",
                          color: `#339af0`,
                          // borderBottom: `2px solid #339af0`,
                          borderLeft: `4px solid #339af0`,
                          display: "inline-block",
                        }}
                        className="my-3 px-2 rounded-sm"
                      >
                        {props.children}
                      </h2>
                    ),
                  }}
                />
              </motion.div>
            ) : (
              <Text>No content found.</Text>
            )}
          </>
        ) : (
          <Text>No data found.</Text>
        )}
      </Box>
    </AllLayout>
  );
};

export default EIP;
