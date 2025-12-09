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
      } catch (error) {
        console.error("Error fetching data:", error);
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
          const handleMatch = author.match(/(.+?)\s\(@([a-zA-Z0-9-_]+)\)$/);

          if (handleMatch) {
            const fullName = handleMatch[1].trim();
            const handle = handleMatch[2].trim();

            authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            authorMap[`@${handle}`] = (authorMap[`@${handle}`] || 0) + 1;
          } else {
            const emailMatch = author.match(/(.+?)\s<.+?>$/);

            if (emailMatch) {
              const fullName = emailMatch[1].trim();
              authorMap[fullName] = (authorMap[fullName] || 0) + 1;
            } else {
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

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 150);
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query]);

  const filteredAuthors = authorCounts.filter((author) =>
    author.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  console.log("filtered author data:", filteredAuthors);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/allprs`);
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
        const jsonData = await response.json();
        setIssueData(jsonData);
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
    const queryStr = debouncedQuery.trim().toLowerCase();

    if (queryStr) {
      const seenPRs = new Set<string>();

      const exactMatches = data.filter((item) => {
        const key = `${item.prNumber}-${item.repo}`;
        if (seenPRs.has(key)) return false;
        seenPRs.add(key);
        return item.prNumber.toString() === queryStr;
      });

      const partialMatches = data
        .filter((item) => item.prNumber.toString().startsWith(queryStr))
        .filter((item) => item.prNumber.toString() !== queryStr)
        .filter((item) => {
          const key = `${item.prNumber}-${item.repo}`;
          if (seenPRs.has(key)) return false;
          seenPRs.add(key);
          return true;
        });

      const newFilteredResults = [
        ...exactMatches,
        ...partialMatches.sort((a, b) => {
          const aLength = a.prNumber.toString().length;
          const bLength = b.prNumber.toString().length;
          return aLength - bLength;
        }),
      ];

      const seenIssues = new Set<string>();

      const exactIssueMatches = IssueData.filter((item) => {
        const key = `${item.issueNumber}-${item.repo}`;
        if (seenIssues.has(key)) return false;
        seenIssues.add(key);
        return item.issueNumber.toString() === queryStr;
      });

      const partialIssueMatches = IssueData
        .filter((item) => item.issueNumber.toString().startsWith(queryStr))
        .filter((item) => item.issueNumber.toString() !== queryStr)
        .filter((item) => {
          const key = `${item.issueNumber}-${item.repo}`;
          if (seenIssues.has(key)) return false;
          seenIssues.add(key);
          return true;
        });

      const newFilteredIssueResults = [
        ...exactIssueMatches,
        ...partialIssueMatches.sort((a, b) => {
          const aLength = a.issueNumber.toString().length;
          const bLength = b.issueNumber.toString().length;
          return aLength - bLength;
        }),
      ];

      const seenEIPs = new Set<string>();
      
      const matchesSearch = (item: EIP, query: string): boolean => {
        const q = query.toLowerCase();
        const eipNum = item.eip.replace(/\D/g, '');
        
        if (eipNum.includes(q) || item.eip.toLowerCase().includes(q)) {
          return true;
        }
        
        if (item.title.toLowerCase().includes(q)) {
          return true;
        }
        
        if (item.author.toLowerCase().includes(q)) {
          return true;
        }
        
        if (item.category && item.category.toLowerCase().includes(q)) {
          return true;
        }
        
        if (item.type && item.type.toLowerCase().includes(q)) {
          return true;
        }
        
        if (item.status && item.status.toLowerCase().includes(q)) {
          return true;
        }
        
        if (item.repo.toLowerCase().includes(q)) {
          return true;
        }
        
        return false;
      };
      
      const scoreEIP = (item: EIP, query: string): number => {
        let score = 0;
        const q = query.toLowerCase();
        const eipNum = item.eip.replace(/\D/g, '');
        
        if (eipNum === q || item.eip.toLowerCase() === q) {
          score += 1000;
        } else if (eipNum.startsWith(q)) {
          score += 500;
        } else if (eipNum.includes(q)) {
          score += 100;
        }
        
        if (item.title.toLowerCase() === q) {
          score += 800;
        } else if (item.title.toLowerCase().startsWith(q)) {
          score += 400;
        } else if (item.title.toLowerCase().includes(q)) {
          score += 50;
        }
        
        if (item.author.toLowerCase().includes(q)) {
          score += 30;
        }
        
        if (item.category?.toLowerCase().includes(q)) score += 20;
        if (item.type?.toLowerCase().includes(q)) score += 20;
        if (item.status?.toLowerCase().includes(q)) score += 20;
        
        return score;
      };

      const scoredEIPs = eipData
        .map((item) => ({
          item,
          score: matchesSearch(item, queryStr) ? scoreEIP(item, queryStr) : 0,
          key: `${item.eip}-${item.repo}`
        }))
        .filter((result) => {
          if (result.score === 0) return false;
          if (seenEIPs.has(result.key)) return false;
          seenEIPs.add(result.key);
          return true;
        })
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          const aNum = parseInt(a.item.eip.replace(/\D/g, '')) || 0;
          const bNum = parseInt(b.item.eip.replace(/\D/g, '')) || 0;
          return aNum - bNum;
        });

      const newFilteredEIPResults = scoredEIPs.map(result => result.item);

      setFilteredResults(newFilteredResults);
      setFilteredIssueResults(newFilteredIssueResults);
      setFilteredEIPResults(newFilteredEIPResults);
      
      console.log("Filtered EIP results:", newFilteredEIPResults.length);
      
    } else {
      setFilteredResults([]);
      setFilteredEIPResults([]);
      setFilteredIssueResults([]);
    }
  }, [debouncedQuery, data, IssueData, eipData]);

  useEffect(() => {
    if (query.trim() && (filteredEIPResults.length > 0 || filteredAuthors.length > 0)) {
      setSelectedIndex(0);
    } else {
      setSelectedIndex(-1);
    }
  }, [query, filteredEIPResults.length, filteredAuthors.length]);

  useEffect(() => {
    if (selectedIndex >= 0 && showDropdown) {
      requestAnimationFrame(() => {
        scrollToSelectedOption(selectedIndex);
      });
    }
  }, [selectedIndex, showDropdown]);

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

  const queryStr = query.trim();

  const uniqueResults = filteredResults.filter((result, index, self) => {
    const prNumberStr = result.prNumber.toString().trim();
    const isLengthValid = prNumberStr.length >= queryStr.length;
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

  const scrollToSelectedOption = (index: number) => {
    if (dropdownRef.current) {
      const targetItem = dropdownRef.current.querySelector(`[data-index="${index}"]`) as HTMLElement;
      
      if (targetItem) {
        targetItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showDropdown || !query) return;
      
      const totalResults = filteredEIPResults.length + filteredAuthors.length + filteredResults.length + filteredIssueResults.length;
      
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          const newIndex = prevIndex < totalResults - 1 ? prevIndex + 1 : 0;
          return newIndex;
        });
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : totalResults - 1;
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

  // Helper function to get status badge color
  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'Final': 'bg-green-100 text-green-800 border-green-200',
      'Draft': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Review': 'bg-blue-100 text-blue-800 border-blue-200',
      'Last Call': 'bg-orange-100 text-orange-800 border-orange-200',
      'Stagnant': 'bg-gray-100 text-gray-800 border-gray-200',
      'Withdrawn': 'bg-red-100 text-red-800 border-red-200',
      'Living': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search EIP number, title, author, status..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setShowDropdown(true);
            }
          }}
          className="w-full pl-12 pr-12 py-3.5 text-base border-2 border-gray-300 rounded-xl bg-white shadow-sm hover:border-blue-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400"
        />
        
        {/* Clear Button */}
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowDropdown(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && query && (
        <div
          ref={dropdownRef}
          className="absolute mt-3 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden focus:outline-none"
          style={{ maxHeight: '480px' }}
        >
          {filteredEIPResults.length === 0 &&
          filteredAuthors.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 font-semibold text-lg mb-1">
                No results found
              </p>
              <p className="text-gray-500 text-sm">
                Try searching for an EIP number, title, author, or status
              </p>
            </div>
          ) : (
            <div className="max-h-[480px] overflow-y-auto">
              {/* EIP Results Section */}
              {filteredEIPResults.length > 0 && (
                <div className="border-b-2 border-gray-100">
                  <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Proposals ({filteredEIPResults.length})
                    </h3>
                  </div>
                  {filteredEIPResults.map((result, index) => {
                    const statusColor = getStatusColor(result.status);
                    
                    return (
                      <div
                        key={`eip-${result.eip}-${result.repo}`}
                        data-index={index}
                        onClick={() => {
                          EIPhandleSearchResultClick(result.eip, result.repo);
                          setShowDropdown(false);
                          setQuery("");
                        }}
                        className={`cursor-pointer p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-b border-gray-100 transition-all duration-200 ${
                          selectedIndex === index ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-l-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-base font-bold text-gray-900">
                                {result.repo.toUpperCase()}-{result.eip}
                              </span>
                              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${statusColor}`}>
                                {result.status}
                              </span>
                              {result.category && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                                  {result.category}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700 font-medium mb-1 line-clamp-2">
                              {result.title}
                            </div>
                            {result.author && (
                              <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {result.author.split(',')[0]}
                                {result.author.split(',').length > 1 && ` +${result.author.split(',').length - 1} more`}
                              </div>
                            )}
                          </div>
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Author Results Section */}
              {filteredAuthors.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200">
                    <h3 className="text-xs font-semibold text-purple-700 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Authors ({filteredAuthors.length})
                    </h3>
                  </div>
                  {filteredAuthors.map((result, index) => (
                    <div
                      key={`author-${result.name}`}
                      data-index={filteredEIPResults.length + index}
                      onClick={() => {
                        handleAuthorSearchResultClick(result.name);
                        setShowDropdown(false);
                        setQuery("");
                      }}
                      className={`cursor-pointer p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-b border-gray-100 transition-all duration-200 ${
                        selectedIndex === filteredEIPResults.length + index ? "bg-gradient-to-r from-purple-100 to-pink-100 border-l-4 border-l-purple-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {result.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-semibold text-gray-900 truncate">
                              {result.name}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {result.count} contribution{result.count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Keyboard hints */}
              {(filteredEIPResults.length > 0 || filteredAuthors.length > 0) && (
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-slate-50 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono font-semibold">↑</kbd>
                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono font-semibold">↓</kbd>
                        <span className="ml-1">Navigate</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono font-semibold">↵</kbd>
                        <span>Select</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono font-semibold">Esc</kbd>
                        <span>Close</span>
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {filteredEIPResults.length + filteredAuthors.length} result{filteredEIPResults.length + filteredAuthors.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
