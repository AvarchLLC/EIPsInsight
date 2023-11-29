import {
  Box,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
  Badge,
  Link,
  Button,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@chakra-ui/react";
import {
  Column,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import "@coreui/coreui/dist/css/coreui.min.css";
interface TabProps {
  cat: string;
}

interface TableProps {
  cat: string;
  status: string;
}

const CatTable: React.FC<TableProps> = ({ cat, status }) => {
  const [data, setData] = useState<EIP[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/new/all`);
        const jsonData = await response.json();
        setData(jsonData.eip.concat(jsonData.erc));
        setIsLoading(false); // Set isLoading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Set isLoading to false if there's an error
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (bg === "#f6f6f7") {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }
  });

  function DefaultColumnFilter({
    // @ts-ignore
    column: { filterValue, setFilter, preFilteredRows },
  }) {
    const count = preFilteredRows.length;

    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    );
  }

  const filteredData = data
    .filter((item) => item.category === cat && item.status === status)
    .map((item) => {
      const { eip, title, author } = item;
      return {
        eip,
        title,
        author,
      };
    });

  const columns = [
    {
      header: "Number",
      accessorKey: "eip",
      Filter: DefaultColumnFilter,
    },
    {
      header: "Title",
      accessorKey: "title",
      Filter: DefaultColumnFilter,
    },
    {
      header: "Author",
      accessorKey: "author",
    },
  ];

  const bg = useColorModeValue("#f6f6f7", "#171923");

  const table = useReactTable({
    data: filteredData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  } as any);

  return (
    <>
      {filteredData.length > 0 ? (
        <>
          <Box
            bg={bg}
            marginY={8}
            padding={"1rem"}
            _hover={{
              border: "1px",
              borderColor: "#30A0E0",
            }}
            as={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 } as any}
            className=" ease-in duration-200 rounded-xl"
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-white">
                        <>
                          <div className="flex flex-col space-y-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <Filter column={header.column} table={table} />
                          </div>
                        </>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="h-2" />
            <div className="flex items-center gap-2">
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                {"<"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {">"}
              </button>
              <button
                className="border rounded p-1"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </button>
              <span className="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </strong>
              </span>
              <span className="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  defaultValue={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </Box>
        </>
      ) : (
        <></>
      )}
    </>
  );

  // return (
  //   <>
  //     {filteredData.length > 0 ? (
  //       <Box
  //         bgColor={bg}
  //         marginTop={"12"}
  //         p="1rem 1rem"
  //         borderRadius="0.55rem"
  //         _hover={{
  //           border: "1px",
  //           borderColor: "#30A0E0",
  //         }}
  // as={motion.div}
  // initial={{ opacity: 0, y: -20 }}
  // animate={{ opacity: 1, y: 0 }}
  // transition={{ duration: 0.5 } as any}
  // className=" ease-in duration-200"
  //       >
  //         <CCardBody>
  //           <>
  //             <h2 className="text-blue-400 font-semibold text-4xl">
  //               {" "}
  //               {status}
  //             </h2>
  //             <CSmartTable
  //               items={filteredData}
  //               activePage={1}
  //               // clickableRows
  //               // columnSorter
  //               itemsPerPage={5}
  //               pagination
  //               tableProps={{
  //                 hover: true,
  //                 responsive: true,
  //               }}
  //               scopedColumns={{
  //                 eip: (item: any) => (
  //                   <td
  //                     key={item.eip}
  //                     style={{ fontWeight: "bold", height: "100%" }}
  //                     className="hover:text-[#1c7ed6]"
  //                   >
  //                     <Link
  //                       href={`/eip-${item.eip}`}
  //                       className={
  //                         isDarkMode
  //                           ? "hover:text-[#1c7ed6] text-[13px] text-white"
  //                           : "hover:text-[#1c7ed6] text-[13px] text-black"
  //                       }
  //                     >
  //                       {item.eip}
  //                     </Link>
  //                   </td>
  //                 ),
  //                 title: (item: any) => (
  //                   <td
  //                     key={item.eip}
  //                     style={{ fontWeight: "bold", height: "100%" }}
  //                     className="hover:text-[#1c7ed6]"
  //                   >
  //                     <Link
  //                       href={`/eip-${item.eip}`}
  //                       className={
  //                         isDarkMode
  //                           ? "hover:text-[#1c7ed6] text-[13px] text-white"
  //                           : "hover:text-[#1c7ed6] text-[13px] text-black"
  //                       }
  //                     >
  //                       {item.title}
  //                     </Link>
  //                   </td>
  //                 ),
  //                 author: (it: any) => (
  //                   <td key={it.author}>
  //                     <div>
  //                       {factorAuthor(it.author).map(
  //                         (item: any, index: any) => {
  //                           let t = item[item.length - 1].substring(
  //                             1,
  //                             item[item.length - 1].length - 1
  //                           );
  //                           return (
  //                             <Wrap key={index}>
  //                               <WrapItem>
  //                                 <Link
  //                                   href={`${
  //                                     item[item.length - 1].substring(
  //                                       item[item.length - 1].length - 1
  //                                     ) === ">"
  //                                       ? "mailto:" + t
  //                                       : "https://github.com/" + t.substring(1)
  //                                   }`}
  //                                   target="_blank"
  //                                   className={
  //                                     isDarkMode
  //                                       ? "hover:text-[#1c7ed6] text-[13px] text-white"
  //                                       : "hover:text-[#1c7ed6] text-[13px] text-black"
  //                                   }
  //                                 >
  //                                   {item}
  //                                 </Link>
  //                               </WrapItem>
  //                             </Wrap>
  //                           );
  //                         }
  //                       )}
  //                     </div>
  //                   </td>
  //                 ),
  //               }}
  //             />
  //           </>
  //         </CCardBody>
  //       </Box>
  //     ) : (
  //       <></>
  //     )}
  //   </>
  // );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Living":
      return "blue";
    case "Final":
      return "blue";
    case "Stagnant":
      return "purple";
    case "Draft":
      return "orange";
    case "Withdrawn":
      return "red";
    case "Last Call":
      return "yellow";
    default:
      return "gray";
  }
};

function Filter({ column, table }: { column: Column<any, any>; table: any }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search`}
      className="w-36 border shadow rounded"
    />
  );
}

export default CatTable;
