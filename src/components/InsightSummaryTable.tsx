import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useColorModeValue,
  Text,
  Spinner,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CSVLink } from "react-csv";
import axios from "axios";

interface StatusChange {
  _id: string;
  count: number;
  statusChanges: {
    [key: string]: any; // Add index signature here
    _id: string;
    eip: string;
    fromStatus: string;
    toStatus: string;
    title: string;
    status: string;
    author: string;
    created: string;
    changeDate: string;
    type: string;
    category: string;
    discussion: string;
    deadline: string;
    requires: string;
    pr: number;
    changedDay: number;
    changedMonth: number;
    changedYear: number;
    createdMonth: number;
    createdYear: number;
    __v: number;
    repo: string;
  }[];
  repo: string;
}

interface APIData {
  erc: StatusChange[];
  eip: StatusChange[];
  rip: StatusChange[];
}

type PR = {
  prNumber: number;
  prTitle: string;
  created_at: Date;
  closed_at: Date | null;
  merged_at: Date | null;
};

type Issue = {
  IssueNumber: number;
  IssueTitle: string;
  state: string;
  created_at: Date;
  closed_at: Date | null;
};

const PR_API_ENDPOINTS = ['/api/eipsprdetails', '/api/ercsprdetails', '/api/ripsprdetails'];
const ISSUE_API_ENDPOINTS = ['/api/eipsissuedetails', '/api/ercsissuedetails', '/api/ripsissuedetails'];

export default function InsightSummary() {
  const [data, setData] = useState<StatusChange[]>([]);
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const path = usePathname();
  const [csvData, setCsvData] = useState<any[]>([]);
  const [loading2,setLoading2]=useState<boolean>(false);

  let year = "";
  let month = "";

  if (path) {
    const pathParts = path.split("/");
    year = pathParts[2];
    month = pathParts[3].padStart(2, '0');
  }

  const key = `${year}-${month}`; // Combine year and month for the key

  console.log("key:",key);

  const [prData, setPrData] = useState({
    EIPs: { open: 0, created: 0, closed: 0, merged: 0 },
    ERCs: { open: 0, created: 0, closed: 0, merged: 0 },
    RIPs: { open: 0, created: 0, closed: 0, merged: 0 },
  });
  const [issueData, setIssueData] = useState({
    EIPs: { open: 0, created: 0, closed: 0 },
    ERCs: { open: 0, created: 0, closed: 0 },
    RIPs: { open: 0, created: 0, closed: 0 },
  });

  // useEffect(() => {
  //   fetchPRData();
  //   fetchIssueData();
  // }, [key]);

  const fetchPRData = async () => {
    try {
        const prResults = await Promise.all(
            PR_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
          ) as PR[][]; // Define as PR[][] to allow for any number of returned arrays
    
          const [eipsPRs, ercsPRs, ripsPRs] = prResults;

      const transformedEipsData = transformPRData(eipsPRs, key);
      const transformedErcsData = transformPRData(ercsPRs, key);
      const transformedRipsData = transformPRData(ripsPRs, key);

      setPrData({
        EIPs: {
          open: transformedEipsData[key].open.length,
          created: transformedEipsData[key].created.length,
          closed: transformedEipsData[key].closed.length,
          merged: transformedEipsData[key].merged.length,
        },
        ERCs: {
          open: transformedErcsData[key].open.length,
          created: transformedErcsData[key].created.length,
          closed: transformedErcsData[key].closed.length,
          merged: transformedErcsData[key].merged.length,
        },
        RIPs: {
          open: transformedRipsData[key].open.length,
          created: transformedRipsData[key].created.length,
          closed: transformedRipsData[key].closed.length,
          merged: transformedRipsData[key].merged.length,
        },
      });
    } catch (error) {
      console.error('Error fetching PR data:', error);
    }
  };

  const fetchIssueData = async () => {
    try {
        const issueResults = await Promise.all(
            ISSUE_API_ENDPOINTS.map(endpoint => fetch(endpoint).then(res => res.json()))
          ) as Issue[][]; // Define as Issue[][] to allow for any number of returned arrays
    
      const [eipsIssues, ercsIssues, ripsIssues] = issueResults;
      const transformedEipsIssue = transformIssueData(eipsIssues, key);
      const transformedErcsIssue = transformIssueData(ercsIssues, key);
      const transformedRipsIssue = transformIssueData(ripsIssues, key);

      setIssueData({
        EIPs: {
          open: transformedEipsIssue[key].open.length,
          created: transformedEipsIssue[key].created.length,
          closed: transformedEipsIssue[key].closed.length,
        },
        ERCs: {
          open: transformedErcsIssue[key].open.length,
          created: transformedErcsIssue[key].created.length,
          closed: transformedErcsIssue[key].closed.length,
        },
        RIPs: {
          open: transformedRipsIssue[key].open.length,
          created: transformedRipsIssue[key].created.length,
          closed: transformedRipsIssue[key].closed.length,
        },
      });
    } catch (error) {
      console.error('Error fetching issue data:', error);
    }
  };

  const transformPRData = (data: PR[], requiredkey: string): { [key: string]: { created: PR[], closed: PR[], merged: PR[], open:PR[] } } => {
    const monthYearData: { [key: string]: { created: PR[], closed: PR[], merged: PR[] ,open:[]} } = {};
    const res: { [key: string]: { created: PR[], closed: PR[], merged: PR[] ,open:[]} } = {};
    const processedPRs = new Set();
    const incrementMonth = (date: Date) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1); // Reset to the first day of the next month
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };
    const currentDate = new Date();

    const addIfNotExists = (arr: PR[], pr: PR) => {
   
      // Check if the PR has a closing date, and if it is in the current month and year
      const isClosedThisMonth = pr.closed_at &&
        new Date(pr.closed_at).getFullYear() === currentDate.getFullYear() &&
        new Date(pr.closed_at).getMonth() === currentDate.getMonth();
        if (!isClosedThisMonth && !arr.some(existingPr => existingPr.prNumber === pr.prNumber)) {
          arr.push(pr);
        }
    };
    const addReview= (arr: PR[], pr: PR) => {
      if (!arr.some(existingPr => existingPr.prNumber === pr.prNumber)) {
        arr.push(pr);
      }
    };

  

    data.forEach(pr => {
      if (!processedPRs.has(pr.prNumber)) {
      const createdDate = pr.created_at ? new Date(pr.created_at) : null;
      const closedDate = pr.closed_at ? new Date(pr.closed_at) : null;
      const mergedDate = pr.merged_at ? new Date(pr.merged_at) : null;

      processedPRs.add(pr.prNumber);
  
      // Handle created date
      if (createdDate) {
          const key = `${createdDate.getUTCFullYear()}-${String(createdDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open: [] };
          addReview(monthYearData[key].created, pr);
      }
  
      // Handle closed date (only if not merged)
      if (closedDate && !mergedDate) {
          const key = `${closedDate.getUTCFullYear()}-${String(closedDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open: []};
          addReview(monthYearData[key].closed, pr);
      }
  
      // Handle merged date
      if (mergedDate) {
          const key = `${mergedDate.getUTCFullYear()}-${String(mergedDate.getUTCMonth() + 1).padStart(2, '0')}`;
          if (!monthYearData[key]) monthYearData[key] = { created: [], closed: [], merged: [], open: []};
          addReview(monthYearData[key].merged, pr);
      }
  
      // Handle open PRs
      if (createdDate) {
        let createdDateObj = new Date(createdDate);
        let createdYear = createdDateObj.getUTCFullYear();
        let createdMonth = createdDateObj.getUTCMonth(); // 0-indexed month
    
              // Initialize endDate based on closedDate or currentDate
      let endDate;
      if (closedDate) {
          let closedDateObj = new Date(closedDate);
          endDate = new Date(closedDateObj.getUTCFullYear(), closedDateObj.getUTCMonth() + 1, 1); // Set to the 1st of the month after closing
      } else {
          endDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1); // Set to the 1st of the next month
      }

      // Initialize openDate starting from the created date
      let openDate = new Date(createdYear, createdMonth, 1);

      while (openDate < endDate) {
          const openKey = `${openDate.getUTCFullYear()}-${String(openDate.getUTCMonth() + 1).padStart(2, '0')}`;
          // Initialize monthYearData for the current month key if not already present
          if (!monthYearData[openKey]) {
              monthYearData[openKey] = { created: [], closed: [], merged: [], open: [] };
          }
          // Add the PR to the open array for this month
          addIfNotExists(monthYearData[openKey].open, pr);

          // Increment to the next month
          openDate.setUTCMonth(openDate.getUTCMonth() + 1); // Move to the first day of the next month

      }

    }
  }
    
  });
  
  console.log(requiredkey);

  console.log(monthYearData[requiredkey]);

  if (monthYearData[requiredkey]) {
    res[requiredkey] = monthYearData[requiredkey];
  }
  
  // return monthYearData;
  console.log(res);
  return res;
  
  };

  const transformIssueData = (data: Issue[], requiredkey: string): { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } => {
   
    const monthYearData: { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } = {};
    const res: { [key: string]: { created: Issue[], closed: Issue[], open:Issue[] } } = {};
    
    const incrementMonth = (date: Date) => {
      const newDate = new Date(date);
      newDate.setMonth(newDate.getMonth() + 1);
      newDate.setDate(1); // Reset to the first day of the next month
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };
    const currentDate = new Date();

    const addIfNotExists = (arr: Issue[], pr: Issue) => {
   
      // Check if the PR has a closing date, and if it is in the current month and year
      const isClosedThisMonth = pr.closed_at &&
        new Date(pr.closed_at).getFullYear() === currentDate.getFullYear() &&
        new Date(pr.closed_at).getMonth() === currentDate.getMonth();
        if (!isClosedThisMonth && !arr.some(existingPr => existingPr.IssueNumber === pr.IssueNumber)) {
          arr.push(pr);
        }
    };
    const processedIssues = new Set();

    data.forEach(issue => {
      if (!processedIssues.has(issue.IssueNumber)) {
        
        processedIssues.add(issue.IssueNumber);
      const createdDate = new Date(issue.created_at);
      const closedDate = issue.closed_at ? new Date(issue.closed_at) : null;
      if(issue.IssueNumber==8978 || issue.IssueNumber===8982){
        console.log("issue: ",issue.IssueNumber)
        console.log("created date: ",createdDate);
        console.log(issue);
        
      }
      const createdKey = `${createdDate.getUTCFullYear()}-${String(createdDate.getUTCMonth() + 1).padStart(2, '0')}`;
      
      if (!monthYearData[createdKey]) {
          monthYearData[createdKey] = { created: [], closed: [], open: [] };
      }
      monthYearData[createdKey].created.push(issue);
  
      if (issue.closed_at) {
          const closedDate = new Date(issue.closed_at);
          const closedKey = `${closedDate.getUTCFullYear()}-${String(closedDate.getUTCMonth() + 1).padStart(2, '0')}`;
          
          if (!monthYearData[closedKey]) {
              monthYearData[closedKey] = { created: [], closed: [], open: [] };
          }
          monthYearData[closedKey].closed.push(issue);
      }
  


      if (createdDate) {
        let createdDateObj = new Date(createdDate);
        let createdYear = createdDateObj.getUTCFullYear();
        let createdMonth = createdDateObj.getUTCMonth(); // 0-indexed month
    
              // Initialize endDate based on closedDate or currentDate
      let endDate;
      if (closedDate) {
          let closedDateObj = new Date(closedDate);
          endDate = new Date(closedDateObj.getUTCFullYear(), closedDateObj.getUTCMonth() + 1, 1); // Set to the 1st of the month after closing
      } else {
          endDate = new Date(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1); // Set to the 1st of the next month
      }

      // Initialize openDate starting from the created date
      let openDate = new Date(createdYear, createdMonth, 1);

      while (openDate < endDate) {
          const openKey = `${openDate.getUTCFullYear()}-${String(openDate.getUTCMonth() + 1).padStart(2, '0')}`;
          // Initialize monthYearData for the current month key if not already present
          if (!monthYearData[openKey]) {
              monthYearData[openKey] = { created: [], closed: [], open: [] };
          }
          // Add the PR to the open array for this month
          addIfNotExists(monthYearData[openKey].open, issue);

          // Increment to the next month
          openDate.setUTCMonth(openDate.getUTCMonth() + 1); // Move to the first day of the next month

      }

    }
    }
  });
  

  if (monthYearData[requiredkey]) {
      res[requiredkey] = monthYearData[requiredkey];
    }
      // return monthYearData;
      return res;
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/statusChanges/${year}/${month}`);
        const jsonData: APIData = await response.json();

        const removeDuplicatePRs = (statusChangesArray: StatusChange[]): StatusChange[] => {
          return statusChangesArray.map(item => {
            const uniquePRs = item.statusChanges.filter(
              (value, index, self) =>
                index === self.findIndex(v => v.eip === value.eip)
            );
            return {
              ...item,
              statusChanges: uniquePRs,
            };
          });
        };

        const uniqueEip = removeDuplicatePRs(jsonData.eip);
        console.log(uniqueEip)
        const uniqueErc = removeDuplicatePRs(jsonData.erc);
        const uniqueRip = removeDuplicatePRs(jsonData.rip);

        setData(uniqueEip.concat(uniqueErc).concat(uniqueRip));
      }  catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [year, month]);



  const statuses = [
    "Draft",
    "Review",
    "Last Call",
    "Living",
    "Final",
    "Stagnant",
    "Withdrawn",
  ];
  const tableData = statuses.map((status) => {
    console.log("table data:", data);
    const statusData = data.filter((item) => item._id === status);
    return {
      _id: status,
      eipCount: statusData.filter((item) => item.repo === "eip")[0]?.statusChanges.length || 0,
      ercCount: statusData.filter((item) => item.repo === "erc")[0]?.statusChanges.length || 0,
      ripCount: statusData.filter((item) => item.repo === "rip")[0]?.statusChanges.length || 0,
    };
  });

  const generateCSVData = () => {
    console.log("input data", data)
    const csvData = data.flatMap((item) =>
      item.statusChanges.map((statusChange) => ({
        _id: item._id,
        repo: item.repo,
        eip: statusChange.eip,
        title: statusChange.title,
        fromStatus: statusChange.fromStatus,
        toStatus: statusChange.toStatus,
        link: `https://eipsinsight.com/${item.repo === "erc" ? "ercs/erc" : item.repo === "rip" ? "rips/rip" : "eips/eip"}-${statusChange.eip}`,
      }))
    );
    console.log("Oputput data:", csvData)
    setCsvData(csvData)
  
    return csvData;
  };

  return (
    <>
      <Flex 
  justifyContent="center" // Center items horizontally
  alignItems="center" // Align items vertically
  // marginBottom="0.5rem" 
  gap={4} // Add some space between the items
  paddingTop={8}
>
{/* <Text fontSize="3xl" fontWeight="bold" color="blue.400" textAlign="center" paddingTop={8} paddingLeft={8}>
        Summary
      </Text> */}
  <Text
    color="#30A0E0"
    fontSize="2xl"
    fontWeight="bold"
    textAlign="center"
    // marginBottom="0.5rem"
     paddingLeft={8}
  >
    {`Summary`}
  </Text>

  {/* Download button next to the text */}
  <CSVLink 
    data={csvData.length ? csvData : []} 
    filename={`StatusChanges-${year}-${month}.csv`} 
    onClick={async (e: any) => {
      try {
        // Generate the CSV data
        generateCSVData();
  
        // Check if CSV data is empty and prevent default behavior
        if (csvData.length === 0) {
          e.preventDefault();
          console.error("CSV data is empty or not generated correctly.");
          return;
        }
  
        // Trigger the API call to update the download counter
        await axios.post("/api/DownloadCounter");
      } catch (error) {
        console.error("Error triggering download counter:", error);
      }
    }}
  >
    <Button fontSize={{ base: "0.6rem", md: "md" }} colorScheme="blue">
      {loading2 ? <Spinner size="sm" /> : "Download CSV"}
    </Button>
  </CSVLink>
</Flex>
      <TableContainer bg={bg} padding={4} rounded={"xl"} marginTop={8}>
        <Table variant="simple" size="md" bg={bg} padding={8}>
          <TableCaption>eipsinsight.com</TableCaption>
          <Thead>
            <Tr>
              <Th>Status</Th>
              <Th>EIP</Th>
              <Th>ERC</Th>
              <Th>RIP</Th>
              {/* <Th isNumeric>Total</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {tableData.map((item) => {
              return (
                <>
                  <Tr>
                    <Td>{item._id}</Td>
                    <Td>
                      <a
                        href={`/monthly/eip/${year}/${month}/${
                          item._id === "Last Call" ? "LastCall" : item._id
                        }`}
                      >
                        {item.eipCount}
                      </a>
                    </Td>
                    <Td>
                      <a
                        href={`/monthly/erc/${year}/${month}/${
                          item._id === "Last Call" ? "LastCall" : item._id
                        }`}
                      >
                        {item.ercCount}
                      </a>
                    </Td>
                    <Td>
                      <a
                        href={`/monthly/rip/${year}/${month}/${
                          item._id === "Last Call" ? "LastCall" : item._id
                        }`}
                      >
                        {item.ripCount}
                      </a>
                    </Td>
                   
                  </Tr>
                </>
              );
            })}
           
            
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
