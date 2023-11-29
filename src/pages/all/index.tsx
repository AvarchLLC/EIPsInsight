import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import { Box } from "@chakra-ui/react";
import CatTable from "@/components/CatTable";

const All = () => {
  const [selected, setSelected] = useState("Meta");
  const optionArr = [
    "Meta",
    "Informational",
    "Core",
    "Networking",
    "Interface",
    "ERC",
    "RIP",
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
          </Box>

          <Box>
            <CatTable cat={selected} status={"Draft"} />
            <CatTable cat={selected} status={"Review"} />
            <CatTable cat={selected} status={"Last Call"} />
            <CatTable cat={selected} status={"Living"} />
            <CatTable cat={selected} status={"Final"} />
            <CatTable cat={selected} status={"Stagnant"} />
            <CatTable cat={selected} status={"Withdrawn"} />
          </Box>
        </Box>
      </AllLayout>
    </>
  );
};

export default All;
