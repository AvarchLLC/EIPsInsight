import Image from "next/image";
import React from "react";
import Logo from "../Logo";
import SearchBox from "../SearchBox";

const Navbar = () => {
  return (
    <div className="w-full h-[65px] fixed top-0 z-50 px-10 backdrop-blur-md bg-black/30">
      <div className="w-full h-full flex flex-row items-center justify-between m-auto px-4">
        <a
          href="#about-me"
          className="h-auto w-auto flex flex-row items-center border border-white/30 bg-white/10 mr-4 px-4 py-2 rounded-full text-gray-200"
        >
          <Logo/>
          <span className="ml-2 hidden md:block text-gray-200">
            EIPs Insights
          </span>
        </a>

        <div className="w-[500px] h-full flex flex-row items-center justify-between md:mr-20">
          <div className="flex underline items-center justify-between w-full h-auto border border-white/30 bg-black/70 px-5 py-2 rounded-full text-gray-200">
            <a href="/about" className="cursor-pointer">
              Pectra
            </a>
            <a href="/skills" className="cursor-pointer">
              All EIPs
            </a>
            <a href="/projects" className="cursor-pointer">
              Tools
            </a>
            <a href="/resume" className="cursor-pointer">
              Insights
            </a>
            <a href="/resume" className="cursor-pointer">
              More
            </a>
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <SearchBox />
        </div>
      </div>
    </div>
  );
};

export default Navbar;