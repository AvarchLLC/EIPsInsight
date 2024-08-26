import { Badge, Box, Link, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { TableContainer } from "@chakra-ui/react";
import { CBadge, CCard, CCardBody, CCardFooter, CCardHeader, CSmartTable } from "@coreui/react-pro";
const statusArr = ['Final', 'Draft', 'Review', 'Last_Call', 'Stagnant', 'Withdrawn', 'Living']

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

const Table = () => {
  const bg = useColorModeValue("#f6f6f7", "#171923");
  const [data, setData] = useState<EIP[]>([]);
  const [type, setType] = useState();
  const [status, setStatus] = useState();
  const [category, setCategory] = useState();
  const [eips, setEips] = useState();
  const [date, setDate] = useState();
  const [name, setName] = useState();
  const fetchColumn = (status : any) => {
    const columns =
      status === 'Last_Call' || status === 'Last Call'
        ? [
            {
              key: 'id',
              _style: { width: '5%', color: `${getBadgeColor(status)}` },
              _props: { className: 'fw-semibold' },
              sorter: true,
            },
            {
              key: 'Number',
              _style: {
                width: '9%',
                color: `${getBadgeColor(status)}`,
              },
              _props: { className: 'fw-semibold' },
              sorter: true,
            },

            {
              key: 'Title',
              _style: {
                width: '30%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Author',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Draft Date',
              _style: {
                width: '11%',
                color: `${getBadgeColor(status)}`,
              },
            },

            { key: 'Type', _style: { width: '8%', color: `${getBadgeColor(status)}` } },
            {
              key: 'Category',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Last-Call Deadline',
              _style: { width: '10%', color: `${getBadgeColor(status)}` },
            },
            {
              key: 'status',
              _style: {
                width: '12%',
                color: `${getBadgeColor(status)}`,
              },
            },
            // {
            //   key: 'PR No.',

            //   _style: { width: '5%', color: `${getBadgeColor(status)}` },
            // },
          ]
        : status === 'Final'
        ? [
            {
              key: 'id',
              _style: { width: '5%', color: `${getBadgeColor(status)}` },
              _props: { className: 'fw-semibold' },
              sorter: true,
            },
            {
              key: 'Number',
              _style: {
                width: '8%',
                color: `${getBadgeColor(status)}`,
              },
              _props: { className: 'fw-semibold' },
              sorter: true,
            },
            {
              key: 'Title',
              _style: {
                width: '25%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Author',
              _style: {
                width: '15%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Draft Date',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Final Date',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },

            { key: 'Type', _style: { width: '10%', color: `${getBadgeColor(status)}` } },
            {
              key: 'Category',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'status',
              _style: { width: '7%', color: `${getBadgeColor(status)}` },
            },
            // {
            //   key: 'PR No.',

            //   _style: {
            //     width: '5%',
            //     color: `${getBadgeColor(status)}`,
            //   },
            // },
          ]
        : [
            {
              key: 'id',
              _style: { width: '5%', color: `${getBadgeColor(status)}` },
              _props: { className: 'fw-semibold' },
              sorter: true,
            },
            {
              key: 'Number',
              _style: {
                width: '8%',
                color: `${getBadgeColor(status)}`,
              },
              _props: { className: 'fw-semibold' },
              sorter: true,
            },
            {
              key: 'Title',
              _style: {
                width: '25%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Author',
              _style: {
                width: '15%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'Draft Date',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },

            { key: 'Type', _style: { width: '10%', color: `${getBadgeColor(status)}` } },
            {
              key: 'Category',
              _style: {
                width: '10%',
                color: `${getBadgeColor(status)}`,
              },
            },
            {
              key: 'status',
              _style: { width: '7%', color: `${getBadgeColor(status)}` },
            },
            // {
            //   key: 'PR No.',

            //   _style: {
            //     width: '5%',
            //     color: `${getBadgeColor(status)}`,
            //   },
            // },
          ]

    return columns
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/alleips`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const sortedData = data.map(({ eip, title, author, status, type, category }) => ({
    eip,
    title,
    author,
    status,
    type,
    category,
  }));

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

  const headers = [
    {
      label: 'EIP No.',
      key: 'Number',
    },
    {
      label: 'Title',
      key: 'Title',
    },
    {
      label: 'Author',
      key: 'Author',
    },
    {
      label: 'Draft Date',
      key: 'Draft Date',
    },
    {
      label: 'Final Date',
      key: 'Final Date',
    },
    {
      label: 'Type',
      key: 'Type',
    },
    {
      label: 'Category',
      key: 'Category',
    },
    { label: 'Last Call Deadline', key: 'Last-Call Deadline' },
    {
      label: 'Status',
      key: 'status',
    },
    {
      label: 'PR No.',
      key: 'Number',
    },
  ]

  const factorAuthor = (data : any) => {
    //
    let list = data.split(',')
    //
    for (let i = 0; i < list.length; i++) {
      list[i] = list[i].split(' ')
    }
    //
    if (list[list.length - 1][list[list.length - 1].length - 1] === 'al.') {
      list.pop()
    }
    return list
  }

  const getString = (data: any) => {
    let ans = ''
    for (let i = 0; i < data.length - 1; i++) {
      ans += data[i] + ' '
    }
    return ans
  }

  const header = (text :any, status : any) => {
    return (
      <CCardHeader
        className="cardHeader flex justify-between items-center"
        style={{
          fontFamily: 'Roboto',
          fontWeight: '800',
          fontSize: '16px',
          color: `${getBadgeColor(status)}`,
          backgroundColor: 'white',
          borderBottom: `2px solid ${getBadgeColor(status)}`,
        }}
      >
        <div className="tracking-wider">{text}</div>
      </CCardHeader>
    )
  }

  return (
    <>
      <CCard className="card-container">
        <CCardBody
          style={{
            overflowX: 'auto',
            overflowY: 'auto',

            fontFamily: 'Roboto',
            fontSize: '15px',
          }}
          className="scrollbarDesign"
        >
          <CSmartTable
            items={data}
            activePage={1}
            clickableRows
            columns={fetchColumn(status)}
            columnFilter
            columnSorter
            itemsPerPage={15}
            pagination
            scopedColumns={{
              eip: (item : any) => (
                <td>
                  <div
                    style={{
                      color: `${getBadgeColor(item.status)}`,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.id}.
                  </div>
                </td>
              ),
              Number: (item : any) => (
                <td>
                  <Link href={`/eips/eip-${item.Number}`}>
                    <div>
                      <label className="relative cursor-pointer">
                        <div
                          className={`h-7
            font-extrabold rounded-[8px] bg-[${getBadge(item.status)}] text-[${getBadgeColor(
                            item.status,
                          )}] text-[12px] inline-block p-[4px] drop-shadow-sm ${getBadgeShadowColor(
                            item.status,
                          )} shadow-md cursor-pointer px-[8px]`}
                          style={{
                            color: `${getBadgeColor(item.status)}`,
                            backgroundColor: `${getBadge(item.status)}`,
                          }}
                        >
                          {item.Number}
                        </div>
                        <div
                          className={`absolute top-0 right-0 -mr-1 -mt-0 w-2 h-2 rounded-full bg-[${getBadgeColor(
                            item.status,
                          )}] animate-ping`}
                          style={{
                            backgroundColor: `${getBadgeColor(item.status)}`,
                          }}
                        ></div>
                        <div
                          className={`absolute top-0 right-0 -mr-1 -mt-0 w-2 h-2 rounded-full bg-[${getBadgeColor(
                            item.status,
                          )}]`}
                          style={{
                            backgroundColor: `${getBadgeColor(item.status)}`,
                          }}
                        ></div>
                      </label>
                    </div>
                  </Link>
                </td>
              ),
              Title: (item :any) => (
                <td
                  style={{
                    // borderBottomWidth: item.id % 2 !== 0 ? '1px' : '',
                    // borderColor: item.id % 2 !== 0 ? `${getBadgeColor(item.status)}` : '',
                    color: `${getBadgeColor(item.status)}`,

                    fontWeight: 'bold',
                    height: '100%',
                  }}
                  className="hover:text-[#1c7ed6]"
                >
                  <Link href={`/eips/eip-${item.Number}`} className="hover:text-[#1c7ed6] text-[13px]">
                    {item.Title}
                  </Link>
                </td>
              ),

              Author: (it : any) => (
                <td>
                  <div>
                    {factorAuthor(it.Author).map((item:any, index:any) => {
                      let t = item[item.length - 1].substring(1, item[item.length - 1].length - 1)

                      return (
                        <CBadge
                          key={index}
                          className={`mr-1 drop-shadow-sm ${getBadgeShadowColor(
                            it.status,
                          )} shadow-sm`}
                          style={{
                            color: `${getBadgeColor(it.status)}`,
                            backgroundColor: `${getBadge(it.status)}`,
                          }}
                        >
                          <a
                            key={index}
                            href={`${
                              item[item.length - 1].substring(item[item.length - 1].length - 1) ===
                              '>'
                                ? 'mailto:' + t
                                : 'https://github.com/' + t.substring(1)
                            }`}
                            target="_blank"
                            rel="noreferrer"
                            className="hoverAuthor text-[10px]"
                            
                          >
                            {item}
                          </a>
                        </CBadge>
                      )
                    })}
                  </div>
                </td>
              ),
              'Draft Date': (item :any) => (
                <td
                  style={{
                    color: `${getBadgeColor(item.status)}`,
                    fontWeight: 'bold',
                  }}
                  className="text-[12px]"
                >
                  <div>{item['Draft Date']}</div>
                </td>
              ),

              'Final Date': (item :any) => (
                <td
                  style={{
                    color: `${getBadgeColor(item.status)}`,
                    fontWeight: 'bold',
                  }}
                  className="text-[12px]"
                >
                  <div>{item['Final Date']}</div>
                </td>
              ),
              'Last-Call Deadline': (item : any) => (
                <td
                  style={{
                    color: `${getBadgeColor(item.status)}`,
                    fontWeight: 'bold',
                  }}
                  className="text-[12px]"
                >
                  <div>{item['Last-Call Deadline']}</div>
                </td>
              ),
              Type: (item : any) => (
                <td
                  style={{
                    color: `${getBadgeColor(item.status)}`,
                    fontWeight: 'bold',
                  }}
                  className="text-[12px]"
                >
                  {item.Type}
                </td>
              ),

              Category: (item : any) => (
                <td
                  style={{
                    color: `${getBadgeColor(item.status)}`,
                    fontWeight: 'bold',
                  }}
                >
                  <div className=" text-[12px]">{item.Category}</div>
                </td>
              ),
              status: (item : any) => (
                <td style={{}}>
                  <CBadge
                    style={{
                      color: `${getBadgeColor(item.status)}`,
                      backgroundColor: `${getBadge(item.status)}`,
                    }}
                    className={`drop-shadow-sm ${getBadgeShadowColor(item.status)} shadow-md`}
                  >
                    {item.status}
                  </CBadge>
                </td>
              ),
              'PR No.': (item : any) => (
                <td>
                  <a
                    href={`https://github.com/ethereum/EIPs/pull/${
                      item['PR No.'] === 0 ? item.Number : item['PR No.']
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CBadge
                      style={{
                        color: `${getBadgeColor('Random')}`,
                        backgroundColor: `${getBadge('Random')}`,
                      }}
                      className={`drop-shadow-sm ${getBadgeShadowColor(
                        'Random',
                      )} shadow-md  z-auto`}
                    >
                      <div>{item['PR No.'] === 0 ? `#` + item.Number : item['PR No.']}</div>
                    </CBadge>
                  </a>
                </td>
              ),
            }}
            // onRowClick={(item : any) => {
            //
            //   navigate('/EIP-' + item.Number)
            // }}
            sorterValue={{ column: 'name', state: 'asc' }}
            tableHeadProps={{}}
            tableProps={{
              // borderless: true,
              // striped: true,
              hover: true,
              responsive: true,
            }}
          />
        </CCardBody>
        <CCardFooter
          className="cardFooter"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: `${getBadgeColor(status)}`,
            backgroundColor: 'white',
          }}
        >
          <label style={{ color: '#1c7ed6', fontSize: '15px', fontWeight: 'bold' }}></label>
          <label
            style={{ fontSize: '10px', fontWeight: 'bold', color: `${getBadgeColor(status)}` }}
            className="tracking-wider"
          >
            {date}
          </label>
        </CCardFooter>
      </CCard>
    </>
  );
};

const getBadgeColor = (status : any) => {
  switch (status) {
    case "Final":
      return "#0ca678";
    case "Last_Call":
      return "#37b24d";
    case "Last Call":
      return "#37b24d";
    case "Draft":
      return "#f08c00";
    case "Stagnant":
      return "#e8590c";
    case "Withdrawn":
      return "#e03131";
    case "Review":
      return "#1971c2";
    case "Living":
      return "#0c8599";
    default:
      return "#1c7ed6";
  }
};

const getBadgeShadowColor = (status : any) => {
  switch (status) {
    case "Final":
      return "shadow-[#0ca678]";
    case "Last_Call":
      return "shadow-[#37b24d]";
    case "Last Call":
      return "shadow-[#37b24d]";
    case "Draft":
      return "shadow-[#f08c00]";
    case "Stagnant":
      return "shadow-[#e8590c]";
    case "Withdrawn":
      return "shadow-[#e03131]";
    case "Review":
      return "shadow-[#1971c2]";
    case "Living":
      return "shadow-[#0c8599]";
    default:
      return "shadow-[#1c7ed6]";
  }
};

const getBadge = (status : any) => {
  switch (status) {
    case "Final":
      return "#c3fae8";
    case "Last_Call":
      return "#d3f9d8";
    case "Last Call":
      return "#d3f9d8";
    case "Draft":
      return "#fff3bf";
    case "Stagnant":
      return "#ffe8cc";
    case "Withdrawn":
      return "#ffe3e3";
    case "Review":
      return "#d0ebff";
    case "Living":
      return "#c5f6fa";
    default:
      return "#e7f5ff";
  }
};

export default Table;