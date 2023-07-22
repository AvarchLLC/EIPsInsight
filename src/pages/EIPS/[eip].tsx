import AllLayout from '@/components/Layout'
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import Header from '@/components/Header';
import { Badge, Box, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Wrap, WrapItem } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
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

const EIP = () => {
  const pathname = usePathname();
  const pathnameParts = pathname ? pathname.split("/") : [];
  // const [allData, setAllData] = useState<any[]>([]); // Set initial state as an empty array
  const thirdPart = pathnameParts[2] || ""; // Set a default value if thirdPart is undefined
  const [data, setData] = useState<EIP | null>(null); // Set initial state as null

  // const fetchAllData = async () => {
  //   try {
  //     const res = await fetch(`https://eipsinsight.com/api/rawData`, {
  //       // method: 'GET',
  //       // headers: {
  //       //   Accept: 'application/json',
  //       //   'Content-Type': 'application',
  //       // },
  //       // credentials: 'include',
  //     });
  //     const datas = await res.json();
  //     setData(datas);
  //     console.log(datas)

  //     const filterData = datas.filter(function (e: any) {
  //       return e.data.eip === thirdPart;
  //     });

  //     setAllData(filterData);
  //   } catch (err) {}
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/eips/${thirdPart}`);
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // fetchAllData();
  }, [thirdPart]); // Add thirdPart as a dependency to re-fetch data when it changes

  
  return (
    <AllLayout>
      <Box className="ml-40 mr-40 pl-10 pr-10 mt-10 mb-20">

        {data !== null ? ( // Check if data is not null before rendering
          <>
            <Header title={`EIP : ${thirdPart}`} subtitle={data.title} />
            <TableContainer paddingTop={6}>
              <Table variant="striped" minW="50%" maxH={"50%"} layout="fixed">

                <Tbody>
                  {Object.entries(data).map(([key, value]) => (
                    key !== 'requires' && key !== 'unique_ID' && key !== 'eip' && key !== '_id' && key !=='__v' && value && (
                      <Tr key={key}>
                        <Td>
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </Td>
                        <Td>
                          <Wrap>
                            <WrapItem>
                              <Badge colorScheme="cyan">{value}</Badge>
                            </WrapItem>
                          </Wrap>
                        </Td>
                      </Tr>
                    )
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {/* {allData !== undefined && allData.map((item: any, index: number) => (
                <ReactMarkdown
                key={index}
                children={item?.content ?? ''} // Ensure content is a string or use an empty string as fallback
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h2: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: '17px',
                          fontWeight: 'bold',
                          color: `#339af0`,
                          // borderBottom: `2px solid #339af0`,
                          borderLeft: `4px solid #339af0`,
                          display: 'inline-block',
                        }}
                        className="my-3 px-2 rounded-sm"
                        {...props}
                      />
                    ),
                    h1: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: '22px',
                          fontWeight: 'bold',
                          color: `#339af0`,
                          borderBottom: `2px solid #339af0`,
                          borderLeft: `4px solid #339af0`,
                          display: 'inline-block',
                        }}
                        className="my-3 px-2 rounded-sm"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h2
                        style={{
                          fontSize: '17px',
                          fontWeight: 'bold',
                          color: `#339af0`,
                          // borderBottom: `2px solid #339af0`,
                          borderLeft: `4px solid #339af0`,
                          display: 'inline-block',
                        }}
                        className="my-3 px-2 rounded-sm"
                        {...props}
                      />
                    ),
                  }}
                />
              ))} */}
          </>
        ) : (
          <Text>No data found.</Text>
        )}
      </Box>
    </AllLayout>
  )
}

export default EIP;
