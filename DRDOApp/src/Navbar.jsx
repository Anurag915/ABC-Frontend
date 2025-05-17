import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import "./Navbar.css";

import Profile from "./pages/Profile.jsx";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "View Director Profile", to: "/directorprofile" },

    ...(isLoggedIn
      ? [
          { label: "About ABC", to: "/labs" },
          { label: "Sign Out", to: "#", action: handleLogout },
          { label: "View Profile", to: "/profile" },
        ]
      : [
          { label: "Login", to: "/login" },
          { label: "Register", to: "/register" },
        ]),
  ];

  return (
    <nav className="bg-[#003168] text-white sticky top-0 z-50 shadow-lg w-full">
      <div className="flex items-center justify-between h-16 w-full px-4 sm:px-6 lg:px-8">
        {/* Logo aligned to left edge */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/Logo.jpg"
            alt="DRDO Logo"
            className="h-12 w-12 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <span className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">
            ABC Company
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {navItems.map(({ label, to, action }) => (
            <button
              key={label}
              onClick={action || (() => navigate(to))}
              className={`px-4 py-2 rounded-md text-base font-medium ${
                pathname === to
                  ? "bg-[#0066cc] text-white"
                  : "text-white hover:bg-[#004b99]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#003168]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map(({ label, to, action }) => (
              <button
                key={label}
                onClick={() => {
                  setIsOpen(false);
                  action ? action() : navigate(to);
                }}
                className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium ${
                  pathname === to
                    ? "bg-[#0066cc] text-white"
                    : "text-white hover:bg-[#004b99]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
