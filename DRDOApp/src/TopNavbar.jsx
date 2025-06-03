import { Link } from "react-router-dom";

export default function TopNavbar() {
  return (
    <nav className="top-navbar bg-[#003168] text-white px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 shadow-md">
      {/* Logo + Title */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="./drdo.jpeg"
          alt="ABC Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight text-center sm:text-left max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl">
          Centre for Fire, Explosive and Environment Safety (CFEES)
        </span>
      </Link>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-2 rounded-md w-full sm:w-64 text-white bg-[#002655] placeholder-white"
      />
    </nav>
  );
}
