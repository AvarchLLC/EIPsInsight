import React, { useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface PRItem {
  prNumber: number;
  repo: string;
}

interface IssueItem {
  issueNumber: number;
  repo: string;
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

interface EIP2 {
  _id: string;
  eip: string;
  type: string;
  title: string;
  category: string;
  author: string;
  repo: string;
}

interface PRProps {
  type: string;
}

interface AuthorCount {
  name: string;
  count: number;
}

const SearchBox: React.FC = () => {
  const [data, setData] = useState<PRItem[]>([]);
  const [authordata, setauthorData] = useState<EIP2[]>([]);
  const [authorCounts, setAuthorCounts] = useState<AuthorCount[]>([]);
  const [IssueData, setIssueData] = useState<IssueItem[]>([]);
  const [eipData, setEipData] = useState<EIP[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = usePathname();
  const splitPath = router?.split("/") || [];
  const type = splitPath[1] || "eip";
  const [filteredResults, setFilteredResults] = useState<PRItem[]>([]);
  const [filteredIssueResults, setFilteredIssueResults] = useState<IssueItem[]>([]);
  const [filteredEIPResults, setFilteredEIPResults] = useState<EIP[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/graphsv4`);
        const jsonData = await response.json();

        const getEarliestEntries = (data: any[], key: string) => {
          const uniqueEntries: Record<string, any> = {};
          data.forEach((entry) => {
            const entryKey = entry[key];
            if (!uniqueEntries[entryKey] || new Date(entry.changeDate) > new Date(uniqueEntries[entryKey].changeDate)) {
              uniqueEntries[entryKey] = entry;
            }
          });
          return Object.values(uniqueEntries);
        };

        let filteredData = [
          ...getEarliestEntries(jsonData.eip, "eip"),
          ...getEarliestEntries(jsonData.erc, "eip"),
          ...getEarliestEntries(jsonData.rip, "eip"),
        ];
        filteredData = filteredData.filter(
          (entry: EIP, index: number, self: EIP2[]) =>
            entry.eip !== "1" || index === self.findIndex((e: EIP2) => e.eip === "1")
        );

        setauthorData(filteredData);
        console.log("author data: ", filteredData);
        // setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const authorMap: Record<string, number> = {};

    authordata.forEach((eip) => {
      const authors = eip.author.split(",").map((author) => author.trim());
      authors.forEach((author) => {
        if (author) {
          // Match GitHub handle in the format: Vitalik Buterin (@vbuterin)
          const handleMatch = author.match(/(.+?)\s\(@([a-zA-Z0-9-_]+)\)$/);

          if (handleMatch) {
            // Add counts for the full name and the GitHub handle
            const fullName = handleMatch[1].trim(); // Extract full name
            const handle = handleMatch[2].trim(); // Extract handle

            authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            authorMap[`@${handle}`] = (authorMap[`@${handle}`] || 0) + 1;
          } else {
            // Match email address in the format: Vitalik Buterin <vitalik.buterin@ethereum.org>
            const emailMatch = author.match(/(.+?)\s<.+?>$/);

            if (emailMatch) {
              const fullName = emailMatch[1].trim(); // Ignore email part, extract only the name
              authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            } else {
              // If no special format is found, count the entire string as the author's name
              authorMap[author] = (authorMap[author] || 0) + 1;
            }
          }
        }
      });
    });

    const authorArray = Object.entries(authorMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    setAuthorCounts(authorArray);
  }, [authordata]);

  // Debounce the query to optimize performance
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150); // 150ms delay
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query]);

  // const filteredAuthorData = query
  // ? authordata.filter(item =>
  //     item.author.toLowerCase().includes(query.toLowerCase())
  //   )
  // : [];

  const filteredAuthors = authorCounts.filter((author) =>
    author.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  console.log("filtered author data:", filteredAuthors);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/allprs`);
        // console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/allissues`);
        // console.log(response);
        const jsonData = await response.json();
        setIssueData(jsonData);
        // console.log('IssueData:', jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    var queryStr = debouncedQuery.trim();
    let queryStr2 = ''; // To store the non-numeric part at the beginning

    // Regular expression to split the query into numeric and non-numeric parts
    const match = queryStr.match(/^(\D+)?(\d+)?/);

    if (match) {
      queryStr2 = match[1]?.trim() || ''; // Non-numeric prefix
      queryStr = match[2]?.trim() || '';  // Numeric part
    }

    console.log('Query Numeric Part:', queryStr);
    console.log('Query Non-Numeric Part:', queryStr2);


    if (queryStr ||queryStr2) {
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
      console.log(newFilteredResults);

      const seenIssues = new Set<string>();

      // Filter PR results based on exact match first
      const exactIssueMatches = IssueData.filter((item) => {
        const key = `${item.issueNumber}-${item.repo}`;
        if (seenIssues.has(key)) return false; // Skip if already seen
        seenIssues.add(key); // Mark as seen
        return item.issueNumber.toString() === queryStr;
      });

      // Filter PR results for partial matches (those that start with the query)
      const partialIssueMatches = IssueData
        .filter((item) => item.issueNumber.toString().startsWith(queryStr))
        .filter((item) => item.issueNumber.toString() !== queryStr) // Exclude exact matches
        .filter((item) => {
          const key = `${item.issueNumber}-${item.repo}`;
          if (seenIssues.has(key)) return false; // Skip if already seen
          seenIssues.add(key); // Mark as seen
          return true;
        });

      // Combine exact matches and partial matches, sorting by length
      const newFilteredIssueResults = [
        ...exactIssueMatches,
        ...partialIssueMatches.sort((a, b) => {
          const aLength = a.issueNumber.toString().length;
          const bLength = b.issueNumber.toString().length;
          return bLength - aLength; // Sort by the length of the prNumber in descending order
        }),
      ];
      // console.log(newFilteredIssueResults);

      // Replace the EIP filtering section with this:

// Deduplicate for EIP data
const seenEIPs = new Set<string>();

// Filter EIP results based on exact match first
const exactEIPMatches = eipData.filter((item) => {
  const key = `${item.eip}-${item.repo}`;
  if (seenEIPs.has(key)) return false;
  
  // Check if query is numeric - then match EIP numbers
  if (/^\d+$/.test(queryStr)) {
    const eipNum = item.eip.replace(/\D/g, '');
    if (eipNum === queryStr) {
      seenEIPs.add(key);
      return true;
    }
  } 
  // For non-numeric queries, match title or author
  else {
    if (item.title.toLowerCase().includes(queryStr.toLowerCase()) || 
        item.author.toLowerCase().includes(queryStr.toLowerCase())) {
      seenEIPs.add(key);
      return true;
    }
  }
  return false;
});

// Filter EIP results for partial matches
const partialEIPMatches = queryStr 
  ? eipData.filter((item) => {
      const key = `${item.eip}-${item.repo}`;
      if (seenEIPs.has(key)) return false;
      
      // For numeric queries - match EIP numbers starting with query
      if (/^\d+$/.test(queryStr)) {
        const eipNum = item.eip.replace(/\D/g, '');
        if (eipNum.startsWith(queryStr) && eipNum !== queryStr) {
          seenEIPs.add(key);
          return true;
        }
      }
      // For non-numeric queries - match title or author containing query
      else {
        if (item.title.toLowerCase().includes(queryStr.toLowerCase()) || 
            item.author.toLowerCase().includes(queryStr.toLowerCase())) {
          seenEIPs.add(key);
          return true;
        }
      }
      return false;
    })
  : eipData;


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
      // Update the state with the filtered and sorted results
// if (["p", "pr", ""].includes(queryStr2.toLowerCase())) {
  setFilteredResults(newFilteredResults);
// }

// if (["i", "is", "iss", "issu", "issue", ""].includes(queryStr2.toLowerCase())) {
  setFilteredIssueResults(newFilteredIssueResults);
// }
console.log("final data:",newFilteredEIPResults)

if (queryStr2.toLowerCase() === "e") {
  setFilteredEIPResults(newFilteredEIPResults.filter((item) => ["eip", "erc"].includes(item.repo)));
} else if (["r", "ri", "rip", "rip n", "rip nu", "rip num", "rip numb", "rip number"].includes(queryStr2)) {
  setFilteredEIPResults(newFilteredEIPResults.filter((item) => item.repo === "rip"));
} else if (["e", "ei", "eip", "eip n", "eip nu", "eip num", "eip numb", "eip number"].includes(queryStr2)) {
  setFilteredEIPResults(newFilteredEIPResults.filter((item) => item.repo === "eip"));
} else if (["er", "erc", "erc n", "erc nu", "erc num", "erc numb", "erc number"].includes(queryStr2)) {
  setFilteredEIPResults(newFilteredEIPResults.filter((item) => item.repo === "erc"));
} else {
  setFilteredEIPResults(newFilteredEIPResults);
}

      
      
    } else {
      // If query is empty, clear the results
      setFilteredResults([]);
      setFilteredEIPResults([]);
      setFilteredIssueResults([]);
    }
  }, [debouncedQuery, data, IssueData, eipData]);

  // Auto-select first result when query changes
  useEffect(() => {
    if (query.trim() && (filteredEIPResults.length > 0 || filteredAuthors.length > 0)) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [query, filteredEIPResults.length, filteredAuthors.length]);
  const handleSearchResultClick = async (selectedNumber: number, repo: string) => {
    try {
      window.location.href = `/PR/${repo}/${selectedNumber}`;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchIssueResultClick = async (selectedNumber: number, repo: string) => {
    try {
      window.location.href = `/issue/${repo}/${selectedNumber}`;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAuthorSearchResultClick = async (author: string) => {
    try {
      window.location.href = `/authors/${author}`;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const EIPhandleSearchResultClick = (selectedEIPNumber: string, type: string) => {
    // console.log(selectedEIPNumber);
    // console.log(type);

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

  const queryStr = query.trim(); // Remove spaces from the query string

  const uniqueResults = filteredResults.filter((result, index, self) => {
    // Remove spaces from the PR number for comparison
    const prNumberStr = result.prNumber.toString().trim();

    // Ensure the PR number length is greater than or equal to the query string length
    const isLengthValid = prNumberStr.length >= queryStr.length;

    // Ensure the PR is unique based on both repo and PR number
    const isUnique = index === self.findIndex((r) => r.prNumber === result.prNumber && r.repo === result.repo);

    return isLengthValid && isUnique;
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as HTMLDivElement).contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events when search dropdown is open
      if (!showDropdown || !query) return;
      
      const totalResults = filteredEIPResults.length + filteredAuthors.length + filteredResults.length + filteredIssueResults.length;
      
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          const newIndex = prevIndex < totalResults - 1 ? prevIndex + 1 : 0; // Wrap to first
          scrollToSelectedOption(newIndex);
          return newIndex;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : totalResults - 1; // Wrap to last
          scrollToSelectedOption(newIndex);
          return newIndex;
        });
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectResult(selectedIndex);
        }
      } else if (event.key === "Escape") {
        setShowDropdown(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
    };

    const scrollToSelectedOption = (index: number) => {
      if (dropdownRef.current) {
        const options = dropdownRef.current.querySelectorAll("option");
        const option = options[index];
        if (option) {
          option.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }
    };

    const handleSelectResult = (index: number) => {
      const allResults = [
        ...filteredEIPResults,
        ...filteredAuthors,
        ...filteredResults,
        ...filteredIssueResults,
      ];
      const selectedResult = allResults[index];
      
      if (selectedResult) {
        if ("name" in selectedResult) {
          handleAuthorSearchResultClick(selectedResult.name);
        } else if ("prNumber" in selectedResult) {
          handleSearchResultClick(selectedResult.prNumber, selectedResult.repo);
        } else if ("issueNumber" in selectedResult) {
          handleSearchIssueResultClick(selectedResult.issueNumber, selectedResult.repo);
        } else if ("eip" in selectedResult) {
          EIPhandleSearchResultClick(selectedResult.eip, selectedResult.repo);
        }
        setShowDropdown(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, filteredAuthors, filteredResults, filteredIssueResults, filteredEIPResults, showDropdown, query]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search EIP/ERC/RIP/Author"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true); // Show dropdown when typing
        }}
        onFocus={() => {
          if (query.trim()) {
            setShowDropdown(true);
          }
        }}
        className="border p-2 rounded w-full text-center focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
      />

      {showDropdown && query && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-full bg-white border rounded shadow-lg z-50 overflow-y-auto"
        >
          {filteredEIPResults.length === 0 &&
          filteredAuthors.length === 0 ? (
            <p className="p-2 text-red-500 text-center font-bold">
              Invalid EIP/ERC/RIP/Author
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto">
              {/* EIP Results */}
              {filteredEIPResults.map((result, index) => (
                <div
                  key={`eip-${result.eip}-${result.repo}`}
                  onClick={() => {
                    EIPhandleSearchResultClick(result.eip, result.repo);
                    setShowDropdown(false);
                    setQuery("");
                  }}
                  className={`cursor-pointer p-3 hover:bg-blue-50 border-b ${
                    selectedIndex === index ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="text-lg font-medium">
                    {result.repo.toUpperCase()}-{result.eip}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {result.title}
                  </div>
                </div>
              ))}
              
              {/* Author Results */}
              {filteredAuthors.map((result, index) => (
                <div
                  key={`author-${result.name}`}
                  onClick={() => {
                    handleAuthorSearchResultClick(result.name);
                    setShowDropdown(false);
                    setQuery("");
                  }}
                  className={`cursor-pointer p-3 hover:bg-blue-50 border-b ${
                    selectedIndex === filteredEIPResults.length + index ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="text-lg font-medium">
                    {result.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.count} contribution{result.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
              
              {/* PR Results (commented out but keeping structure) */}
              {/* {uniqueResults.map((result, index) => (
                <div
                  key={`pr-${result.prNumber}-${result.repo}`}
                  onClick={() => {
                    handleSearchResultClick(result.prNumber, result.repo);
                    setShowDropdown(false);
                    setQuery("");
                  }}
                  className={`cursor-pointer p-3 hover:bg-blue-50 border-b ${
                    selectedIndex === filteredEIPResults.length + filteredAuthors.length + index ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="text-lg font-medium">
                    {result.repo.toUpperCase()} PR: {result.prNumber}
                  </div>
                </div>
              ))} */}
              
              {/* Issue Results (commented out but keeping structure) */}
              {/* {filteredIssueResults.map((result, index) => (
                <div
                  key={`issue-${result.issueNumber}-${result.repo}`}
                  onClick={() => {
                    handleSearchIssueResultClick(result.issueNumber, result.repo);
                    setShowDropdown(false);
                    setQuery("");
                  }}
                  className={`cursor-pointer p-3 hover:bg-blue-50 border-b ${
                    selectedIndex === filteredEIPResults.length + filteredAuthors.length + uniqueResults.length + index ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="text-lg font-medium">
                    {result.repo.toUpperCase()} ISSUE: {result.issueNumber}
                  </div>
                </div>
              ))} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;