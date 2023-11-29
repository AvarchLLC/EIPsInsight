import React, { useState, useEffect } from "react";
import AllLayout from "@/components/Layout";
import { Box, Spinner } from "@chakra-ui/react";
import CatTable from "@/components/CatTable";
import SearchBox from "@/components/SearchBox";

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
  const [isLoading, setIsLoading] = useState(true);

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
              <h1 className="text-3xl text-center h-[70dvh] justify-center items-center flex">
                No Rolling Improvement Proposals have been made yet
              </h1>
            </>
          ) : (
            <Box>
              <CatTable cat={selected} status={"Draft"} />
              <CatTable cat={selected} status={"Review"} />
              <CatTable cat={selected} status={"Last Call"} />
              <CatTable cat={selected} status={"Living"} />
              <CatTable cat={selected} status={"Final"} />
              <CatTable cat={selected} status={"Stagnant"} />
              <CatTable cat={selected} status={"Withdrawn"} />
            </Box>
          )}
        </Box>
      </AllLayout>
    </>
  );
};

export default All;
