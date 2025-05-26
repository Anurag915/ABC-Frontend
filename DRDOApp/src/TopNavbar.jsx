// TopNavbar.js
import { Link } from "react-router-dom";
export default function TopNavbar() {
  return (
    <nav className="top-navbar bg-[#003168] text-white px-4 py-2 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center space-x-3">
        <img
          src="./drdo.jpeg"
          alt="ABC Logo"
          className="h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
        />
        <span className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
          Centre for Fire, Explosive and Environment Safety (CFEES){" "}
        </span>
      </Link>

      <input
        type="text"
        placeholder="Search..."
        className="px-3 py-2 rounded-md w-48 sm:w-64 text-white"
      />
    </nav>
  );
}
