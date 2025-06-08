import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import "./Navbar.css";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [groups, setGroups] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [topOffset, setTopOffset] = useState(135);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    const updateOffset = () => {
      const marqueeHeight = 40;
      const topNavbarEl = document.querySelector(".top-navbar");
      const topNavbarHeight = topNavbarEl?.offsetHeight || 95;
      setTopOffset(marqueeHeight + topNavbarHeight);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);

    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/labs`)
      .then((res) => setLabs(res.data))
      .catch((err) => console.error("Failed to fetch labs:", err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setUserRole(localStorage.getItem("role"));
  }, [pathname]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/groups/name`)
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Failed to fetch groups:", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", to: "/" },
    {
      label: "Groups",
      dropdown: true,
      items: groups.map((group) => ({
        label: group.name,
        to: `/group/id/${group._id}`,
      })),
    },
    ...(isLoggedIn
      ? [
          userRole === "admin" &&
            labs.length === 0 && { label: "Add Lab", to: "/admin/add-labs" },
          userRole === "admin" && {
            label: "Add Group",
            to: "/admin/add-groups",
          },
          (userRole === "admin" || userRole === "director") && {
            label: "All Letters",
            to: "/dac",
          },
          userRole === "employee" && {
            label: "Upload Letter",
            to: "/dac",
          },
          userRole === "admin" && { label: "Manage Labs", to: "/admin" },
          userRole === "admin" && {
            label: "Manage Groups",
            dropdown: true,
            items: groups.map((group) => ({
              label: group.name,
              to: `/admin/group/${group._id}`,
            })),
          },
          userRole === "admin" && {
            label: "Manage Close Group",
            to: "/admin/closeGroup",
          },
          userRole === "admin" && {
            label: "Approve Users",
            to: "/admin/approval",
          },
          userRole === "admin" && { label: "Logs", to: "/admin/logs" },
          { label: "Close Group Docs", to: "/closeGroup" },
          { label: "View Profile", to: "/profile" },
          { label: "Sign Out", to: "#", action: handleLogout },
        ].filter(Boolean)
      : [
          { label: "Login", to: "/login" },

          // { label: "Register", to: "/register" },
        ]),
  ];

  return (
    <nav
      className="main-navbar bg-[#003168] text-white shadow-lg w-full z-50"
      style={{ top: `${topOffset}px`, position: "fixed" }}
    >
      <div className="flex items-center justify-between h-24 w-full px-2">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center relative">
          {navItems.map(({ label, to, action, dropdown, items }) => {
            const isGroupsDropdown = label === "Groups";
            const isManageGroupsDropdown = label === "Manage Groups";
            const isActiveDropdown =
              (isGroupsDropdown && pathname.startsWith("/group/")) ||
              (isManageGroupsDropdown && pathname.startsWith("/admin/group/"));

            if (dropdown) {
              return (
                <div key={label} className="relative">
                  <button
                    onClick={() => {
                      setOpenDropdown((prev) =>
                        prev === label ? null : label
                      );
                      setOpenMobileDropdown(null);
                    }}
                    className={`px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition duration-300 ${
                      openDropdown === label || isActiveDropdown
                        ? "bg-[#0066cc] text-white"
                        : "hover:bg-[#004b99]"
                    }`}
                  >
                    {label}
                    {openDropdown === label ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {openDropdown === label && (
                    <div className="absolute bg-[#004b99] rounded-md mt-1 w-48 shadow-lg z-50">
                      {items.map(({ label: itemLabel, to: itemTo }) => (
                        <button
                          key={itemTo}
                          onClick={() => {
                            setOpenDropdown(null);
                            setIsOpen(false);
                            navigate(itemTo);
                          }}
                          className={`block w-full text-left px-4 py-2 text-white transition duration-200 hover:bg-[#0066cc] ${
                            pathname === itemTo ? "bg-[#0066cc]" : ""
                          }`}
                        >
                          {itemLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <button
                  key={label}
                  onClick={() => {
                    setOpenDropdown(null);
                    setOpenMobileDropdown(null);
                    action ? action() : navigate(to);
                  }}
                  className={`px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                    pathname === to
                      ? "bg-[#0066cc] text-white"
                      : "hover:bg-[#004b99]"
                  }`}
                >
                  {label}
                </button>
              );
            }
          })}
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
            {navItems.map(({ label, to, action, dropdown, items }) => {
              if (dropdown) {
                return (
                  <div key={label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown((prev) =>
                          prev === label ? null : label
                        )
                      }
                      className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md text-base font-medium text-white transition duration-300 hover:bg-[#004b99] ${
                        openMobileDropdown === label ? "bg-[#0066cc]" : ""
                      }`}
                    >
                      {label}
                      {openMobileDropdown === label ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {openMobileDropdown === label && (
                      <div className="pl-6 mt-1 space-y-1">
                        {items.map(({ label: itemLabel, to: itemTo }) => (
                          <button
                            key={itemTo}
                            onClick={() => {
                              setIsOpen(false);
                              setOpenMobileDropdown(null);
                              setOpenDropdown(null);
                              navigate(itemTo);
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white transition duration-300 hover:bg-[#0066cc] ${
                              pathname === itemTo ? "bg-[#0066cc]" : ""
                            }`}
                          >
                            {itemLabel}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setIsOpen(false);
                      setOpenMobileDropdown(null);
                      setOpenDropdown(null);
                      action ? action() : navigate(to);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                      pathname === to
                        ? "bg-[#0066cc] text-white"
                        : "text-white hover:bg-[#004b99]"
                    }`}
                  >
                    {label}
                  </button>
                );
              }
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
