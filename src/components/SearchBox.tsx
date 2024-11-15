import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface PRItem {
  prNumber: number;
  repo:string;
}

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
  repo: string;
  __v: number;
}

interface PRProps {
  type: string;
}

const SearchBox: React.FC = () => {
  const [data, setData] = useState<PRItem[]>([]);
  const [pr, setPR] = useState<PRProps>({
    type: "Pull Request",
  }); 
  const [eipData, setEipData] = useState<EIP[]>([]);
  const [query, setQuery] = useState("");
  const router = usePathname();
  const splitPath = router?.split("/") || [];
  const type = splitPath[1] || "eip";
  const [filteredResults, setFilteredResults] = useState<PRItem[]>([]);
  const [filteredEIPResults, setFilteredEIPResults] = useState<EIP[]>([]);

  // const data = [];

  // for (let i = 1; i <= 8000; i++) {
  //   data.push({ prOrIssueNumber: i });
  // }

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await fetch(`/api/allprs`);
              console.log(response);
              const jsonData = await response.json();
              setData(jsonData);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
  
      fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setEipData(jsonData.eip.concat(jsonData.erc.concat(jsonData.rip)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const queryStr = query.trim();

    if (queryStr) {
      // Deduplicate using a Set to track unique (prNumber, repo) combinations
      const seenPRs = new Set<string>();

      // Filter PR results based on exact match first
      const exactMatches = data.filter((item) => {
        const key = `${item.prNumber}-${item.repo}`;
        if (seenPRs.has(key)) return false; // Skip if already seen
        seenPRs.add(key); // Mark as seen
        return item.prNumber.toString() === queryStr;
      });

      // Filter PR results for partial matches (those that start with the query)
      const partialMatches = data
        .filter((item) => item.prNumber.toString().startsWith(queryStr))
        .filter((item) => item.prNumber.toString() !== queryStr) // Exclude exact matches
        .filter((item) => {
          const key = `${item.prNumber}-${item.repo}`;
          if (seenPRs.has(key)) return false; // Skip if already seen
          seenPRs.add(key); // Mark as seen
          return true;
        });

      // Combine exact matches and partial matches, sorting by length
      const newFilteredResults = [
        ...exactMatches,
        ...partialMatches.sort((a, b) => {
          const aLength = a.prNumber.toString().length;
          const bLength = b.prNumber.toString().length;
          return bLength - aLength; // Sort by the length of the prNumber in descending order
        }),
      ];

      // Deduplicate for EIP data
      const seenEIPs = new Set<string>();

      // Filter EIP results based on exact match first
      const exactEIPMatches = eipData.filter((item) => {
        const key = `${item.eip}-${item.repo}`;
        if (seenEIPs.has(key)) return false; // Skip if already seen
        seenEIPs.add(key); // Mark as seen
        return item.eip === queryStr;
      });

      // Filter EIP results for partial matches (those that start with the query)
      const partialEIPMatches = eipData
        .filter((item) => item.eip.startsWith(queryStr))
        .filter((item) => item.eip !== queryStr) // Exclude exact matches
        .filter((item) => {
          const key = `${item.eip}-${item.repo}`;
          if (seenEIPs.has(key)) return false; // Skip if already seen
          seenEIPs.add(key); // Mark as seen
          return true;
        });

      // Combine exact EIP matches and partial matches, sorting by length
      const newFilteredEIPResults = [
        ...exactEIPMatches,
        ...partialEIPMatches.sort((a, b) => {
          const aLength = a.eip.length;
          const bLength = b.eip.length;
          return bLength - aLength; // Sort by the length of the eip in descending order
        }),
      ];

      // Update the state with the filtered and sorted results
      setFilteredResults(newFilteredResults);
      setFilteredEIPResults(newFilteredEIPResults);
    } else {
      // If query is empty, clear the results
      setFilteredResults([]);
      setFilteredEIPResults([]);
    }
  }, [query]);



  const handleSearchResultClick = async (selectedNumber: number,repo:string) => {
    try {
          window.location.href = `/PR/${repo}/${selectedNumber}`;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const EIPhandleSearchResultClick = (selectedEIPNumber: string, type: string) => {
    console.log(selectedEIPNumber);
    console.log(type);
  
    if (type === "erc") {
      window.location.href = `/ercs/erc-${selectedEIPNumber}`;
    } else if (type === "rip") {
      window.location.href = `/rips/rip-${selectedEIPNumber}`;
    } else if (type === "eip") {
      window.location.href = `/eips/eip-${selectedEIPNumber}`;
    } else {
      console.error("Unknown type: ", type);
    }
  
    return selectedEIPNumber;
  };
  

  return (
    <>
  <div>
    <input
      type="text"
      placeholder="Search EIP/ERC/RIP/PR"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border p-2 rounded w-full text-center focus:border-blue-100"
    />

    <div className={"grid grid-cols-1"}>
      <div>
        {query && filteredResults.length === 0 && filteredEIPResults.length === 0 ? (
          <p className="mt-2 text-red-500 text-center font-bold">Invalid EIP/ERC/RIP/PR number</p>
        ) : (
          query && (
            <select
              className="mt-2 border p-2 rounded w-full text-center space-y-5"
              size={10}
            >
              {filteredResults.map(result => (
                <option
                  key={result.prNumber}
                  value={result.prNumber}
                  onClick={() => handleSearchResultClick(result.prNumber, result.repo)}
                  className="py-2"
                >
                  {result.repo} PR: {result.prNumber}
                </option>
              ))}
              {filteredEIPResults.map(result => (
                <option
                  key={result.eip}
                  value={result.eip}
                  onClick={() => EIPhandleSearchResultClick(result.eip, result.repo)}
                  className="py-2"
                >
                  {result.repo.toUpperCase()} Number: {result.eip}
                </option>
              ))}
            </select>
          )
        )}
      </div>
    </div>
  </div>
</>

  );
};

export default SearchBox;
