import React,{useState, useEffect} from "react";
import logoDark from '@/../public/EIPsInsightsDark.gif';
import logo from '@/../public/EIPsInsights.gif';
import Image from 'next/image';
import {useColorModeValue} from "@chakra-ui/react";

function Logo() {
    const bg = useColorModeValue("#f6f6f7", "#171923");
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        if(bg === "#f6f6f7"){
            setIsDarkMode(false);
        }
        else{
            setIsDarkMode(true);
        }
    })
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="20"
    //   height="50"
    //   viewBox="0 0 142 215"
    //   className='font-bold hover:opacity-25 cursor-pointer ease-in duration-150'
    //
    // >
    //   <g transform="translate(-1259.52 -529.088)">
    //     <g>
    //       <g>
    //         <path
    //           fill="#C8B2F5"
    //           stroke="#3441C0"
    //           strokeWidth="2.27"
    //           d="M1394.74 693.463l-64.38-89.439v50.214l64.38 39.225z"
    //           transform="matrix(1.08181 0 0 -1.03277 -108.829 1366.48)"
    //         ></path>
    //         <path
    //           fill="#EECBC0"
    //           stroke="#3441C0"
    //           strokeWidth="2.27"
    //           d="M1394.74 693.463l-64.38-89.439v50.214l64.38 39.225z"
    //           transform="matrix(-1.08181 0 0 -1.03277 2769.57 1366.48)"
    //         ></path>
    //       </g>
    //       <g>
    //         <path
    //           fill="#87A9F0"
    //           stroke="#3441C0"
    //           strokeWidth="2.4"
    //           d="M1398.61 639.614l-69.66-30.973v70.608l69.66-39.635z"
    //           transform="matrix(-1 0 0 1 2659.32 -.026)"
    //         ></path>
    //         <path
    //           fill="#CAB3F5"
    //           stroke="#3441C0"
    //           strokeWidth="2.4"
    //           d="M1398.61 639.614l-69.66-30.973v70.608l69.66-39.635z"
    //           transform="translate(1.416 -.026)"
    //         ></path>
    //         <path
    //           fill="#EECBC0"
    //           stroke="#3441C0"
    //           strokeWidth="2.27"
    //           d="M1394.74 709.855l-64.38-105.831v75.841l64.38 29.99z"
    //           transform="matrix(-1.08181 0 0 1.03277 2769.57 -93.531)"
    //         ></path>
    //         <path
    //           fill="#B8FBF6"
    //           stroke="#3441C0"
    //           strokeWidth="2.27"
    //           d="M1394.74 709.855l-64.38-105.831v75.841l64.38 29.99z"
    //           transform="matrix(1.08181 0 0 1.03277 -108.829 -93.531)"
    //         ></path>
    //       </g>
    //     </g>
    //   </g>
    // </svg>


      <>
        <Image src={isDarkMode ? logo : logoDark} width={100} height={100} alt={'logo'}/>
      </>
  );
}

export default Logo;