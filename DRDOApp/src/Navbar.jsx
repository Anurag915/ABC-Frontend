import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axios from "axios";
import "./Navbar.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu open/close
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [groups, setGroups] = useState([]);
  const [labs, setLabs] = useState([]);
  // State for desktop main dropdowns (e.g., "Groups", "Admin")
  const [openDesktopMainDropdown, setOpenDesktopMainDropdown] = useState(null);
  // State for desktop nested dropdowns (e.g., "Manage Groups" within "Admin")
  const [openDesktopNestedDropdown, setOpenDesktopNestedDropdown] =
    useState(null);
  // State for mobile main dropdowns
  const [openMobileMainDropdown, setOpenMobileMainDropdown] = useState(null);
  // State for mobile nested dropdowns
  const [openMobileNestedDropdown, setOpenMobileNestedDropdown] =
    useState(null);

  const [openAccount, setOpenAccount] = useState(false); // State for desktop/mobile account dropdown
  const [topOffset, setTopOffset] = useState(135);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const updateOffset = () => {
      const marqueeHeight = 40;
      const topNavbarEl = document.querySelector(".top-navbar");
      const topNavbarHeight = topNavbarEl?.offsetHeight || 0;
      setTopOffset(marqueeHeight + topNavbarHeight);
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

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
    setOpenAccount(false);
    setIsOpen(false);
    setOpenDesktopMainDropdown(null);
    setOpenDesktopNestedDropdown(null);
    setOpenMobileMainDropdown(null);
    setOpenMobileNestedDropdown(null);
    navigate("/login");
  };

  useEffect(() => {
    // Close all menus on route change
    setIsOpen(false);
    setOpenDesktopMainDropdown(null);
    setOpenDesktopNestedDropdown(null);
    setOpenMobileMainDropdown(null);
    setOpenMobileNestedDropdown(null);
    setOpenAccount(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close desktop main dropdowns and nested dropdowns
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDesktopMainDropdown(null);
        setOpenDesktopNestedDropdown(null);
      }
      // Close desktop account dropdown
      if (
        event.target.closest(".my-account-button") === null &&
        event.target.closest(".account-dropdown-menu") === null &&
        openAccount
      ) {
        setOpenAccount(false);
      }

      // Close mobile menu if clicked outside the mobile menu container and the hamburger icon
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        setIsOpen(false);
        setOpenMobileMainDropdown(null); // Also close any mobile sub-dropdowns
        setOpenMobileNestedDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDesktopMainDropdown, openDesktopNestedDropdown, openAccount, isOpen]);

  const accountItems = [
    { label: "View Profile", to: "/profile" },
    { label: "Sign Out", action: handleLogout },
  ];

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
          userRole === "admin" && {
            label: "Admin",
            dropdown: true,
            items: [
              { label: "Add Lab", to: "/admin/add-labs" },
              { label: "Add Group", to: "/admin/add-groups" },
              { label: "Manage Labs", to: "/admin" },
              {
                label: "Manage Groups",
                dropdown: true, // This is the nested dropdown
                items: groups.map((group) => ({
                  label: group.name,
                  to: `/admin/group/${group._id}`,
                })),
              },
              { label: "Manage Close Group", to: "/admin/closeGroup" },
              { label: "Approve Users", to: "/admin/approval" },
              { label: "Logs", to: "/admin/logs" },
            ].filter(Boolean),
          },
          (userRole === "admin" || userRole === "director") && {
            label: "All Letters",
            to: "/allLetter",
          },
          (userRole === "admin" || userRole === "director") && {
            label: "All Software Repositories",
            to: "/view-repo",
          },
          (userRole === "admin" || userRole === "associate_director") && {
            label: "Software Repository Upload",
            to: "/upload-repo",
          },

          userRole === "employee" && {
            label: "Upload Letter",
            to: "/dac",
          },
          { label: "Close Group Docs", to: "/closeGroup" },
        ].filter(Boolean)
      : [{ label: "Login", to: "/login" }]),
  ].filter(Boolean);

  return (
    <nav
      ref={navRef}
      className="main-navbar bg-[#003168] text-white shadow-lg w-full z-50"
      style={{ top: `${topOffset}px`, position: "fixed" }}
    >
      <div className="flex items-center justify-between h-24 w-full px-2">
        {/* Logo */}
        {/* <div
          className="text-2xl font-bold text-white cursor-pointer"
          onClick={() => {
            setIsOpen(false);
            setOpenDesktopMainDropdown(null);
            setOpenDesktopNestedDropdown(null);
            setOpenMobileMainDropdown(null);
            setOpenMobileNestedDropdown(null);
            setOpenAccount(false);
            navigate("/");
          }}
        >
          DRDO
        </div> */}

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center relative">
          {navItems.map((item) => {
            const isNavLinkActive = item.to && pathname === item.to;
            const isDropdownActive =
              item.dropdown &&
              item.items.some(
                (subItem) =>
                  pathname === subItem.to ||
                  (subItem.dropdown &&
                    subItem.items.some(
                      (nestedItem) => pathname === nestedItem.to
                    ))
              );

            if (item.dropdown) {
              return (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => {
                      setOpenDesktopMainDropdown((prev) =>
                        prev === item.label ? null : item.label
                      );
                      // Close nested dropdown if main dropdown is changing
                      if (openDesktopMainDropdown !== item.label) {
                        setOpenDesktopNestedDropdown(null);
                      }
                    }}
                    className={`px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition duration-300 ${
                      openDesktopMainDropdown === item.label ||
                      isDropdownActive ||
                      isNavLinkActive
                        ? "bg-[#0066cc] text-white"
                        : "hover:bg-[#004b99]"
                    }`}
                  >
                    {item.label}
                    {openDesktopMainDropdown === item.label ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  {openDesktopMainDropdown === item.label && (
                    <div className="absolute bg-[#004b99] rounded-md mt-1 w-56 shadow-lg z-50">
                      {item.items && item.items.length > 0 ? (
                        item.items.map((subItem) =>
                          subItem.dropdown ? (
                            <div key={subItem.label} className="relative">
                              <button
                                onClick={() =>
                                  setOpenDesktopNestedDropdown((prev) =>
                                    prev === subItem.label
                                      ? null
                                      : subItem.label
                                  )
                                }
                                className={`block w-full text-left px-4 py-2 text-white flex justify-between items-center transition duration-200 hover:bg-[#0066cc] ${
                                  openDesktopNestedDropdown === subItem.label
                                    ? "bg-[#0066cc]"
                                    : ""
                                }`}
                              >
                                {subItem.label}
                                {openDesktopNestedDropdown === subItem.label ? (
                                  <FaChevronUp className="ml-2" />
                                ) : (
                                  <FaChevronDown className="ml-2" />
                                )}
                              </button>
                              {openDesktopNestedDropdown === subItem.label && (
                                <div className="absolute left-full top-0 ml-1 bg-[#004b99] rounded-md w-56 shadow-lg z-50">
                                  {subItem.items.map((nestedItem) => (
                                    <button
                                      key={nestedItem.to}
                                      onClick={() => {
                                        setOpenDesktopMainDropdown(null);
                                        setOpenDesktopNestedDropdown(null); // Close nested too
                                        setOpenAccount(false);
                                        setIsOpen(false);
                                        setOpenMobileMainDropdown(null);
                                        setOpenMobileNestedDropdown(null);
                                        navigate(nestedItem.to);
                                      }}
                                      className={`block w-full text-left px-4 py-2 text-white transition duration-200 hover:bg-[#0066cc] ${
                                        pathname === nestedItem.to
                                          ? "bg-[#0066cc]"
                                          : ""
                                      }`}
                                    >
                                      {nestedItem.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              key={subItem.to}
                              onClick={() => {
                                setOpenDesktopMainDropdown(null);
                                setOpenDesktopNestedDropdown(null); // Close nested too
                                setOpenAccount(false);
                                navigate(subItem.to);
                              }}
                              className={`block w-full text-left px-4 py-2 text-white transition duration-200 hover:bg-[#0066cc] ${
                                pathname === subItem.to ? "bg-[#0066cc]" : ""
                              }`}
                            >
                              {subItem.label}
                            </button>
                          )
                        )
                      ) : (
                        <div className="px-4 py-2 text-sm text-white opacity-75 italic">
                          No items
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setOpenDesktopMainDropdown(null);
                    setOpenDesktopNestedDropdown(null); // Close nested too
                    setOpenAccount(false);
                    item.action ? item.action() : navigate(item.to);
                  }}
                  className={`px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                    isNavLinkActive
                      ? "bg-[#0066cc] text-white"
                      : "hover:bg-[#004b99]"
                  }`}
                >
                  {item.label}
                </button>
              );
            }
          })}

          {/* My Account Desktop Dropdown */}
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setOpenAccount((prev) => !prev)}
                className={`my-account-button px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition duration-300 ${
                  openAccount ? "bg-[#0066cc] text-white" : "hover:bg-[#004b99]"
                }`}
              >
                My Account
                {openAccount ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              {openAccount && (
                <div className="account-dropdown-menu absolute bg-[#004b99] rounded-md mt-1 w-48 shadow-lg z-50">
                  {accountItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        setOpenAccount(false);
                        item.action ? item.action() : navigate(item.to);
                      }}
                      className={`block w-full text-left px-4 py-2 text-white transition duration-200 hover:bg-[#0066cc] ${
                        pathname === item.to ? "bg-[#0066cc]" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Icon (Hamburger/X) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mobile-menu-toggle text-white hover:text-gray-300 focus:outline-none"
          >
            {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-[#003168] pb-4 overflow-y-auto"
          style={{ maxHeight: `calc(100vh - ${topOffset + 96}px)` }}
        >
          <div className="px-4 pt-2 space-y-1">
            {navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => {
                        setOpenMobileMainDropdown((prev) =>
                          prev === item.label ? null : item.label
                        );
                        // Close nested dropdown if main dropdown is changing
                        if (openMobileMainDropdown !== item.label) {
                          setOpenMobileNestedDropdown(null);
                        }
                      }}
                      className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md text-base font-medium text-white transition duration-300 hover:bg-[#004b99] ${
                        openMobileMainDropdown === item.label
                          ? "bg-[#0066cc]"
                          : ""
                      }`}
                    >
                      {item.label}
                      {openMobileMainDropdown === item.label ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                    {openMobileMainDropdown === item.label && (
                      <div className="pl-6 mt-1 space-y-1">
                        {item.items && item.items.length > 0 ? (
                          item.items.map((subItem) =>
                            subItem.dropdown ? (
                              <div key={subItem.label}>
                                <button
                                  onClick={() =>
                                    setOpenMobileNestedDropdown((prev) =>
                                      prev === subItem.label
                                        ? null
                                        : subItem.label
                                    )
                                  }
                                  className={`block w-full text-left px-4 py-2 text-white flex justify-between items-center transition duration-200 hover:bg-[#0066cc] ${
                                    openMobileNestedDropdown === subItem.label
                                      ? "bg-[#0066cc]"
                                      : ""
                                  }`}
                                >
                                  {subItem.label}
                                  {openMobileNestedDropdown ===
                                  subItem.label ? (
                                    <FaChevronUp className="ml-2" />
                                  ) : (
                                    <FaChevronDown className="ml-2" />
                                  )}
                                </button>
                                {openMobileNestedDropdown === subItem.label && (
                                  <div className="pl-4 mt-1 space-y-1">
                                    {subItem.items.map((nestedItem) => (
                                      <button
                                        key={nestedItem.to}
                                        onClick={() => {
                                          setIsOpen(false);
                                          setOpenMobileMainDropdown(null);
                                          setOpenMobileNestedDropdown(null);
                                          setOpenDesktopMainDropdown(null);
                                          setOpenDesktopNestedDropdown(null);
                                          setOpenAccount(false);
                                          navigate(nestedItem.to);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-white transition duration-200 hover:bg-[#0066cc] ${
                                          pathname === nestedItem.to
                                            ? "bg-[#0066cc]"
                                            : ""
                                        }`}
                                      >
                                        {nestedItem.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                key={subItem.to}
                                onClick={() => {
                                  setIsOpen(false);
                                  setOpenMobileMainDropdown(null);
                                  setOpenMobileNestedDropdown(null);
                                  setOpenDesktopMainDropdown(null);
                                  setOpenDesktopNestedDropdown(null);
                                  setOpenAccount(false);
                                  navigate(subItem.to);
                                }}
                                className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white transition duration-300 hover:bg-[#0066cc] ${
                                  pathname === subItem.to ? "bg-[#0066cc]" : ""
                                }`}
                              >
                                {subItem.label}
                              </button>
                            )
                          )
                        ) : (
                          <div className="px-4 py-2 text-sm text-white opacity-75 italic">
                            No items
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setIsOpen(false);
                      setOpenMobileMainDropdown(null);
                      setOpenMobileNestedDropdown(null);
                      setOpenDesktopMainDropdown(null);
                      setOpenDesktopNestedDropdown(null);
                      setOpenAccount(false);
                      item.action ? item.action() : navigate(item.to);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium transition duration-300 ${
                      pathname === item.to
                        ? "bg-[#0066cc] text-white"
                        : "text-white hover:bg-[#004b99]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }
            })}

            {/* My Account Mobile Dropdown */}
            {isLoggedIn && (
              <div>
                <button
                  onClick={() => setOpenAccount((prev) => !prev)}
                  className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md text-base font-medium text-white transition duration-300 hover:bg-[#004b99] ${
                    openAccount ? "bg-[#0066cc]" : ""
                  }`}
                >
                  My Account
                  {openAccount ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {openAccount && (
                  <div className="pl-6 mt-1 space-y-1">
                    {accountItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setIsOpen(false);
                          setOpenAccount(false);
                          navigate(item.to);
                        }}
                        className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white transition duration-300 hover:bg-[#0066cc] ${
                          pathname === item.to ? "bg-[#0066cc]" : ""
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
