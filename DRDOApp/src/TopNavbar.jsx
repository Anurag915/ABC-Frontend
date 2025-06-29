// import { Link } from "react-router-dom";

// export default function TopNavbar() {
//   return (
//     <nav className="top-navbar bg-[#003168] text-white px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 shadow-md">
//       {/* Logo + Title */}
//       <Link to="/" className="flex items-center gap-3">
//         <img
//           src="./drdo.jpeg"
//           alt="ABC Logo"
//           className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
//         />
//         <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight text-center sm:text-left max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl">
//           Centre for Fire, Explosive and Environment Safety (CFEES)
//         </span>
//       </Link>

//       {/* Search bar */}
//       <input
//         type="text"
//         placeholder="Search..."
//         className="px-3 py-2 rounded-md w-full sm:w-64 text-white bg-[#002655] placeholder-white"
//       />
//     </nav>
//   );
// }

import { Link } from "react-router-dom";
import React from "react";

export default function TopNavbar() {
  return (
    <nav className="top-navbar bg-[#003168] text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md leading-none">
      {/* Left Section: Logo, Text, Separator, CFEES */}
      <div className="flex flex-col sm:flex-row items-center w-full sm:w-auto mb-0">
        {/* DRDO Logo and Text */}
        <Link
          to="/"
          className="flex items-center gap-3 pr-0 sm:pr-4"
          title="Go to Home - Defence Research & Development Organisation"
        >
          <img
            src="./drdo.jpeg"
            alt="DRDO Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 flex-shrink-0"
          />
          <div className="flex flex-col text-left leading-none flex-grow min-w-0">
            <span className="font-semibold text-white text-[12px] sm:text-[13px] md:text-sm lg:text-base whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              रक्षा अनुसंधान एवं विकास संगठन
            </span>
            <span className="text-gray-200 text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              रक्षा मंत्रालय, भारत सरकार
            </span>
            <span className="font-semibold text-white text-[12px] sm:text-[13px] md:text-sm lg:text-base mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              DEFENCE RESEARCH & DEVELOPMENT ORGANISATION
            </span>
            <span className="text-gray-200 text-[10px] sm:text-[11px] md:text-xs whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              Ministry of Defence, Government of India
            </span>
          </div>
        </Link>

        {/* Vertical Separator */}
        <div className="hidden sm:block h-12 sm:h-14 md:h-16 w-px bg-white mx-3 sm:mx-4 flex-shrink-0"></div>

        {/* CFEES Title */}
        <Link
          to="/"
          className="flex items-center mt-2 sm:mt-0 pl-0 sm:pl-4"
          title="Go to Centre for Fire, Explosive and Environment Safety (CFEES)"
        >
          <span className="font-bold text-white text-sm sm:text-base md:text-lg lg:text-xl whitespace-nowrap overflow-hidden text-ellipsis leading-none">
            Centre for Fire, Explosive and Environment Safety (CFEES)
          </span>
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative flex-shrink-0 w-full sm:w-64 max-w-sm ml-auto mt-3 sm:mt-0">
        <input
          type="text"
          placeholder="Search"
          aria-label="Search"
          className="px-4 py-2 pl-10 rounded-full w-full text-white bg-transparent border border-white placeholder-white focus:border-blue-400 focus:ring-blue-400 focus:outline-none transition-all duration-200 text-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
    </nav>
  );
}
