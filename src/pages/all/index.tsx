import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import {
  Box,
  Spinner,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import CatTable from "@/components/CatTable";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import Link from "next/link";

const All = () => {
  const [selected, setSelected] = useState("Meta");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const optionArr = [
    "Meta",
    "Informational",
    "Core",
    "Networking",
    "Interface",
    "ERC",
    "RIP",
  ];
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  const factorAuthor = (data: any) => {
    let list = data.split(",");
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(" ");
    }
    if (list[list.length - 1][list[list.length - 1].length - 1] === "al.") {
      list.pop();
    }
    return list;
  };

  const filteredData = [
    {
      eip: "7212",
      title: "Precompile for secp256r1 Curve Support",
      author: "Ulaş Erdoğan (@ulerdogan), Doğan Alpaslan (@doganalpaslan)",
    },
  ];
  return (
    <>
      <AllLayout>
        <Box
          paddingBottom={{ lg: "10", sm: "10", base: "10" }}
          marginX={{ lg: "40", md: "2", sm: "2", base: "2" }}
          paddingX={{ lg: "10", md: "5", sm: "5", base: "5" }}
          marginTop={{ lg: "10", md: "5", sm: "5", base: "5" }}
        >
          <Box className="flex space-x-12 w-full justify-center items-center text-xl font-semibold py-8">
            <div className="flex justify-between w-full">
              <div className="space-x-12">
                {optionArr.map((item, key) => (
                  <button
                    onClick={() => {
                      setSelected(item);
                    }}
                    className={
                      selected === item ? "underline underline-offset-4" : ""
                    }
                    key={key}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div>
                <SearchBox />
              </div>
            </div>
          </Box>

          {selected === "RIP" ? (
            <>
              <Box
                bgColor={bg}
                marginTop={"12"}
                p="1rem 1rem"
                borderRadius="0.55rem"
                _hover={{
                  border: "1px",
                  borderColor: "#30A0E0",
                }}
                as={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 } as any}
                className=" ease-in duration-200 z-0"
              >
                <CCardBody>
                  <>
                    <h2 className="text-blue-400 font-semibold text-4xl">
                      RIP
                    </h2>
                    <CSmartTable
                      items={filteredData}
                      activePage={1}
                      // clickableRows
                      // columnSorter
                      columnFilter
                      itemsPerPage={5}
                      pagination
                      tableProps={{
                        hover: true,
                        responsive: true,
                      }}
                      scopedColumns={{
                        eip: (item: any) => (
                          <td
                            key={item.eip}
                            style={{ fontWeight: "bold", height: "100%" }}
                            className="hover:text-[#1c7ed6]"
                          >
                            <Link
                              href="rip-7212"
                              className={
                                isDarkMode
                                  ? "hover:text-[#1c7ed6] text-[13px] text-white"
                                  : "hover:text-[#1c7ed6] text-[13px] text-black"
                              }
                            >
                              {item.eip}
                            </Link>
                          </td>
                        ),
                        title: (item: any) => (
                          <td
                            key={item.eip}
                            style={{ fontWeight: "bold", height: "100%" }}
                            className="hover:text-[#1c7ed6]"
                          >
                            <Link
                              href="/rip-7212"
                              className={
                                isDarkMode
                                  ? "hover:text-[#1c7ed6] text-[13px] text-white"
                                  : "hover:text-[#1c7ed6] text-[13px] text-black"
                              }
                            >
                              {item.title}
                            </Link>
                          </td>
                        ),
                        author: (it: any) => (
                          <td key={it.author}>
                            <div>
                              {factorAuthor(it.author).map(
                                (item: any, index: any) => {
                                  let t = item[item.length - 1].substring(
                                    1,
                                    item[item.length - 1].length - 1
                                  );
                                  return (
                                    <Wrap key={index}>
                                      <WrapItem>
                                        <Link
                                          href={`${
                                            item[item.length - 1].substring(
                                              item[item.length - 1].length - 1
                                            ) === ">"
                                              ? "mailto:" + t
                                              : "https://github.com/" +
                                                t.substring(1)
                                          }`}
                                          target="_blank"
                                          className={
                                            isDarkMode
                                              ? "hover:text-[#1c7ed6] text-[13px] text-white"
                                              : "hover:text-[#1c7ed6] text-[13px] text-black"
                                          }
                                        >
                                          {item}
                                        </Link>
                                      </WrapItem>
                                    </Wrap>
                                  );
                                }
                              )}
                            </div>
                          </td>
                        ),
                      }}
                    />
                  </>
                </CCardBody>
              </Box>
            </>
          ) : (
            <Box>
              <CatTable cat={selected} status={"Living"} />
              <CatTable cat={selected} status={"Final"} />
              <CatTable cat={selected} status={"Last Call"} />
              <CatTable cat={selected} status={"Review"} />
              <CatTable cat={selected} status={"Draft"} />
              <CatTable cat={selected} status={"Withdrawn"} />
              <CatTable cat={selected} status={"Stagnant"} />
            </Box>
          )}
        </Box>
      </AllLayout>
    </>
  );
};

export default All;
