import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

interface PRItem {
  prOrIssueNumber: number;
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
  __v: number;
}

interface PRorIssueProps {
  type: string;
}

const SearchBox: React.FC = () => {
  // const [data, setData] = useState<PRItem[]>([]);
  const [prorissue, setPRorIssue] = useState<PRorIssueProps>({
    type: "Pull Request",
  }); // pr or issue
  const [eipData, setEipData] = useState<EIP[]>([]);
  const [query, setQuery] = useState("");
  const router = usePathname();
  const splitPath = router?.split("/") || [];
  const type = splitPath[1] || "eip";

  const data = [];

  for (let i = 1; i <= 8000; i++) {
    data.push({ prOrIssueNumber: i });
  }

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             const response = await fetch(`/api/allprs`);
  //             console.log(response);
  //             const jsonData = await response.json();
  //             setData(jsonData);
  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //         }
  //     };
  //
  //     fetchData();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setEipData(jsonData.eip.concat(jsonData.erc));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredResults = data.filter((item) =>
    item.prOrIssueNumber.toString().includes(query)
  );

  const filteredEIPResults = eipData.filter((item) =>
    item.eip.toString().includes(query)
  );

  const handleSearchResultClick = async (selectedNumber: number) => {
    try {
      const response = await fetch(
        `/api/get-pr-or-issue-details/${selectedNumber}`
      );
      const jsonData = await response.json();

      if (jsonData && typeof jsonData === "object") {
        setPRorIssue(jsonData);

        if (jsonData.type === "Pull Request") {
          window.location.href = `/PR/${selectedNumber}`;
        } else if (jsonData.type === "Issue") {
          window.location.href = `/issue/${selectedNumber}`;
        } else {
          console.error("Invalid data type:", jsonData.type);
        }
      } else {
        console.error("API response is not an object:", jsonData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const EIPhandleSearchResultClick = (
    selectedEIPNumber: string,
    type: string
  ) => {
    if (type === "ERC") window.location.href = `/erc-${selectedEIPNumber}`;
    else window.location.href = `/eip-${selectedEIPNumber}`;
    return selectedEIPNumber;
  };

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Search EIP or ERC or RIP"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded w-full text-center focus:border-blue-100"
        />

        <div className={"grid grid-cols-1"}>
          {/* <div>
                        {query && filteredResults.length === 0 ? (
                            <p className="mt-2 text-red-500 text-center font-bold">Invalid PR number</p>
                        ) : (
                            query && (
                                <select className={`mt-2 border p-2 rounded w-full text-center space-y-5`} size={10}>
                                    {filteredResults.map(result => (
                                        <option key={result.prOrIssueNumber} value={result.prOrIssueNumber} onClick={() => handleSearchResultClick(result.prOrIssueNumber)} className={'py-2'}>
                                            PR & Issue: {result.prOrIssueNumber}
                                        </option>
                                    ))}
                                </select>
                            )
                        )}
                    </div> */}

          <div>
            {query && filteredEIPResults.length === 0 ? (
              <p className="mt-2 text-red-500 text-center font-bold">
                Invalid EIP or ERC number
              </p>
            ) : (
              query && (
                <select
                  className={`mt-2 border p-2 rounded w-full text-center space-y-5`}
                  size={10}
                >
                  {filteredEIPResults.map((result) => (
                    <option
                      key={result.eip}
                      value={result.eip}
                      onClick={() =>
                        EIPhandleSearchResultClick(result.eip, result.category)
                      }
                      className={"py-2"}
                    >
                      {result.category === "ERC" ? "ERC" : "EIP"} Number:{" "}
                      {result.eip}
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
