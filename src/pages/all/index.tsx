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
import RipCatTable from "@/components/RipCatTable";
import SearchBox from "@/components/SearchBox";
import { CCardBody, CSmartTable } from "@coreui/react-pro";
import { motion } from "framer-motion";
import Link from "next/link";

const All = () => {
  const [selected, setSelected] = useState("Meta");
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
  },);

  const bg = useColorModeValue("#f6f6f7", "#171923");

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
            <Box>
            <RipCatTable cat={selected} status={"Living"} />
            <RipCatTable cat={selected} status={"Final"} />
            <RipCatTable cat={selected} status={"Last Call"} />
            <RipCatTable cat={selected} status={"Review"} />
            <RipCatTable cat={selected} status={"Draft"} />
            <RipCatTable cat={selected} status={"Withdrawn"} />
            <RipCatTable cat={selected} status={"Stagnant"} />
          </Box>
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
