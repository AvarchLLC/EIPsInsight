import React, { useEffect, useState } from 'react';
import {Badge, Box, Link, useColorModeValue, Wrap, WrapItem} from "@chakra-ui/react";
import {motion} from "framer-motion";
import ReactPaginate from 'react-paginate';
import {DataGrid} from "@mui/x-data-grid";
import {createTheme, ThemeProvider, colors, Typography} from "@mui/material";
import {resolveHref} from "next/dist/shared/lib/router/utils/resolve-href";
import {PARAM_TYPES} from "inversify/lib/constants/metadata_keys";

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
    const [data, setData] = useState<EIP[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/alleips`);
                const jsonData = await response.json();
                setData(jsonData);
                setIsLoading(false); // Set isLoading to false after data is fetched
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false); // Set isLoading to false if there's an error
            }
        };
        fetchData();
    }, []);
    const MuiTheme = createTheme({
        palette: {
            mode: "dark",
        },
        components: {
            MuiGrid: {
                styleOverrides: {
                    root: {
                        border: 1,
                        borderColor: 'green',
                        borderStyle: "solid",
                        borderRadius: 10,
                        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
                        backgroundColor: 'black',
                        color: "#C1C2C5",
                        padding: 10,
                    },
                },
            },
        },
    });


    const columns = [
        {
            field: 'eip',
            headerName: 'EIP',
            width: 100,
            renderCell: (params: any) => (
                <>
                    <Link href={`/EIPS/${params.value.toNumber}`} >
                        <p className={`p-1 rounded-sm`}>
                            {params.value}
                        </p>
                    </Link>
                </>
            )
        },
        {
            field: 'title',
            headerName: 'Title',
            width: 400,
            align: 'left',
        },
        {
            field: 'author',
            headerName: 'Author',
            width:200
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100
        },
        {
            field: 'type',
            headerName: 'Type',
            width: 150
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 200
        }
    ];
    return(
        <>
            <ThemeProvider theme={MuiTheme}>
                <DataGrid
                    getRowId={(row) => row._id}
                    // @ts-ignore
                    columns={columns}
                    rows={data}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 8 },
                        },
                    }}
                    pageSizeOptions={[8,10,12]}

                />
            </ThemeProvider>
        </>
    )
}
const getStatusColor = (status: any) => {
    switch (status) {
        case "Living":
            return "green";
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


export default Table;