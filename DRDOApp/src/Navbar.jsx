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
  // const [user, setUser] = useState(null); // This state isn't used, can be removed if not fetching user profile here

  // Adjust topOffset based on marquee and top-navbar height
  useEffect(() => {
    const updateOffset = () => {
      // Assuming marquee is the first element on the page
      const marqueeHeight = 40; // You hardcoded this, if it's dynamic, use DOM lookup
      const topNavbarEl = document.querySelector(".top-navbar"); // Replace with actual top-navbar class/id if different
      const topNavbarHeight = topNavbarEl?.offsetHeight || 0;
      setTopOffset(marqueeHeight + topNavbarHeight);
    };

    updateOffset(); // Set initial offset
    window.addEventListener("resize", updateOffset); // Update on resize
    return () => window.removeEventListener("resize", updateOffset); // Cleanup
  }, []);

  // Fetch labs
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/labs`)
      .then((res) => setLabs(res.data))
      .catch((err) => console.error("Failed to fetch labs:", err));
  }, []);

  // Check login status and user role from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    const roleFromStorage = localStorage.getItem("role");
    setUserRole(roleFromStorage);
  }, [pathname]);

  // Fetch groups
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/groups/name`)
      .then((res) => {
        setGroups(res.data);
        console.log("Fetched groups:", res.data); // <--- ADDED LOG
      })
      .catch((err) => console.error("Failed to fetch groups:", err));
  }, []);

  // Handle user logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole(null);
    // Close all menus upon logout
    setOpenAccount(false);
    setIsOpen(false);
    setOpenDesktopMainDropdown(null);
    setOpenDesktopNestedDropdown(null);
    setOpenMobileMainDropdown(null);
    setOpenMobileNestedDropdown(null);
    navigate("/login");
  };

  // Close all menus on route change
  useEffect(() => {
    setIsOpen(false);
    setOpenDesktopMainDropdown(null);
    setOpenDesktopNestedDropdown(null);
    setOpenMobileMainDropdown(null);
    setOpenMobileNestedDropdown(null);
    setOpenAccount(false);
  }, [pathname]);

  // Handle clicks outside to close dropdowns
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     // Close desktop main dropdowns and nested dropdowns
  //     if (navRef.current && !navRef.current.contains(event.target)) {
  //       console.log("handleClickOutside: Closing desktop main dropdowns."); // ADDED LOG
  //       setOpenDesktopMainDropdown(null);
  //       setOpenDesktopNestedDropdown(null);
  //     }
  //     // Close desktop account dropdown
  //     if (
  //       event.target.closest(".my-account-button") === null &&
  //       event.target.closest(".account-dropdown-menu") === null &&
  //       openAccount
  //     ) {
  //       console.log("handleClickOutside: Closing account dropdown."); // ADDED LOG
  //       setOpenAccount(false);
  //     }

  //     // Close mobile menu if clicked outside the mobile menu container and the hamburger icon
  //     if (
  //       mobileMenuRef.current &&
  //       !mobileMenuRef.current.contains(event.target) &&
  //       !event.target.closest(".mobile-menu-toggle")
  //     ) {
  //       console.log("handleClickOutside: Closing mobile menu."); // ADDED LOG
  //       setIsOpen(false);
  //       setOpenMobileMainDropdown(null); // Also close any mobile sub-dropdowns
  //       setOpenMobileNestedDropdown(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [openDesktopMainDropdown, openDesktopNestedDropdown, openAccount, isOpen]);

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click occurred inside the main navigation area.
      // If it did, we assume a button within the nav was clicked,
      // and its specific onClick handler should manage the state.
      // So, we do NOT close anything from this handler.
      if (navRef.current && navRef.current.contains(event.target)) {
        // console.log("handleClickOutside: Click inside navRef. Not closing via this handler."); // For verbose debugging
        return;
      }

      // If the click was NOT inside navRef, then it's genuinely outside.
      // Close all desktop main and nested dropdowns.
      if (
        openDesktopMainDropdown !== null ||
        openDesktopNestedDropdown !== null
      ) {
        console.log(
          "handleClickOutside: Closing ALL desktop dropdowns (clicked outside nav)."
        );
        setOpenDesktopMainDropdown(null);
        setOpenDesktopNestedDropdown(null);
      }

      // Close desktop account dropdown if it's open and the click was outside its specific elements
      if (
        event.target.closest(".my-account-button") === null &&
        event.target.closest(".account-dropdown-menu") === null &&
        openAccount
      ) {
        console.log(
          "handleClickOutside: Closing account dropdown (clicked outside account elements)."
        );
        setOpenAccount(false);
      }

      // Close mobile menu if clicked outside its container and the toggle icon
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-toggle")
      ) {
        console.log(
          "handleClickOutside: Closing mobile menu (clicked outside mobile menu/toggle)."
        );
        setIsOpen(false);
        setOpenMobileMainDropdown(null);
        setOpenMobileNestedDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDesktopMainDropdown, openDesktopNestedDropdown, openAccount, isOpen]); // Dependencies should include states managed

  // Account dropdown items
  const accountItems = [
    { label: "View Profile", to: "/profile" },
    { label: "Sign Out", action: handleLogout },
  ];

  // Main navigation items array - conditionally rendered
  const navItems = [
    { label: "Home", to: "/" },

    ...(isLoggedIn
      ? [
          {
            label: "Groups",
            dropdown: true,
            items: groups.map((group) => ({
              label: group.name,
              to: `/group/id/${group._id}`,
            })),
          },

          // Admin Panel dropdown (only for admin role)
          userRole === "admin" && {
            label: "Admin Panel",
            dropdown: true,
            items: [
              // { label: "Add Lab", to: "/admin/add-labs" },
              labs.length === 0 && { label: "Add Lab", to: "/admin/add-labs" }, // 👈 show only if no lab

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
              { label: "Manage Gallery", to: "/admin/manageGallery" },
              { label: "All Letters", to: "/allLetter" },
              { label: "All Software Repositories", to: "/view-repo" },
              { label: "All Trial Repositories", to: "/view-trialRepo" },
              { label: "Software Repository Upload", to: "/upload-repo" },
              { label: "Trial Repository Upload", to: "/upload-trialRepo" },
              { label: "Manage External Links", to: "/admin/external-Links" },
            ].filter(Boolean),
          },

          // Director Panel dropdown (only for director role)
          userRole === "director" && {
            label: "Director Panel", // New label for directors
            dropdown: true,
            items: [
              { label: "All Letters", to: "/allLetter" },
              { label: "All Software Repositories", to: "/view-repo" },
              { label: "All Trial Repositories", to: "/view-trialRepo" },
            ].filter(Boolean),
          },

          // Associate Director Panel dropdown (only for associate_director role)
          userRole === "associate_director" && {
            label: "Associate Director Panel", // New label for associate directors
            dropdown: true,
            items: [
              { label: "Software Repository Upload", to: "/upload-repo" },
              { label: "Trial Repository Upload", to: "/upload-trialRepo" },
            ].filter(Boolean),
          },

          userRole === "employee" && {
            label: "Upload Letter",
            to: "/dac",
          },
          { label: "Close Group Docs", to: "/closeGroup" },
        ].filter(Boolean) // Removes any 'false' entries from the outer array
      : [{ label: "Login", to: "/login" }]),
  ].filter(Boolean); // Final filter for the entire navItems array

  return (
    <nav
      ref={navRef}
      className="main-navbar bg-[#003168] text-white shadow-lg w-full z-50 overflow-visible"
      style={{ top: `${topOffset}px`, position: "fixed" }}
    >
      <div className="flex items-center justify-between h-24 w-full px-2">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center relative">
          {navItems.map((item) => {
            const isDropdownCurrentlyOpen =
              openDesktopMainDropdown === item.label;
            const isNavLinkActive = item.to && pathname === item.to;

            if (item.dropdown) {
              return (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => {
                      setOpenDesktopMainDropdown((prev) =>
                        prev === item.label ? null : item.label
                      );
                      if (openDesktopMainDropdown !== item.label) {
                        setOpenDesktopNestedDropdown(null);
                      }
                    }}
                    className={`px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 transition duration-300 ${
                      isDropdownCurrentlyOpen
                        ? "bg-[#0066cc] text-white"
                        : "hover:bg-[#004b99]"
                    }`}
                  >
                    {item.label}
                    {isDropdownCurrentlyOpen ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>

                  {isDropdownCurrentlyOpen && (
                    <div
                      className="absolute left-0 top-full mt-1 bg-[#004b99] rounded-md w-56 shadow-lg z-[9999] overflow-visible"
                      style={{
                        maxHeight: `calc(100vh - ${topOffset + 96 + 20}px)`,
                        overflowY: "auto",
                      }}
                    >
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
                                <div
                                  className="absolute left-0 top-full mt-1 bg-[#004b99] rounded-md w-56 shadow-xl z-[9999] min-w-[12rem] overflow-visible"
                                  style={{
                                    maxHeight: `calc(100vh - ${
                                      topOffset + 96 + 20
                                    }px)`,
                                    overflowY: "auto",
                                  }}
                                >
                                  {subItem.items && subItem.items.length > 0 ? (
                                    subItem.items.map((nestedItem) => (
                                      <button
                                        key={nestedItem.to}
                                        onClick={() => {
                                          setOpenDesktopMainDropdown(null);
                                          setOpenDesktopNestedDropdown(null);
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
                                    ))
                                  ) : (
                                    <div className="px-4 py-2 text-sm text-white opacity-75 italic">
                                      No items
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              key={subItem.to}
                              onClick={() => {
                                setOpenDesktopMainDropdown(null);
                                setOpenDesktopNestedDropdown(null);
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
                    setOpenDesktopNestedDropdown(null);
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

          {/* My Account Dropdown */}
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
                <div className="absolute bg-[#004b99] rounded-md mt-1 w-48 shadow-lg z-[9999]">
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

        {/* Mobile Menu Toggle */}
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
                                  <>
                                    {" "}
                                    {/* Added a Fragment here */}
                                    {console.log(
                                      "Mobile Nested Dropdown Rendered:",
                                      subItem.label,
                                      "Items:",
                                      subItem.items
                                    )}{" "}
                                    {/* ADDED LOG */}
                                    <div className="pl-4 mt-1 space-y-1">
                                      {/* FIX APPLIED HERE: Check for subItem.items length */}
                                      {subItem.items &&
                                      subItem.items.length > 0 ? (
                                        subItem.items.map((nestedItem) => (
                                          <button
                                            key={nestedItem.to}
                                            onClick={() => {
                                              setIsOpen(false);
                                              setOpenMobileMainDropdown(null);
                                              setOpenMobileNestedDropdown(null);
                                              setOpenDesktopMainDropdown(null);
                                              setOpenDesktopNestedDropdown(
                                                null
                                              );
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
                                        ))
                                      ) : (
                                        <div className="px-4 py-2 text-sm text-white opacity-75 italic">
                                          No items
                                        </div>
                                      )}
                                    </div>
                                  </>
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
