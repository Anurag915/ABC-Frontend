// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { HiMenu, HiX } from "react-icons/hi";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import axios from "axios";
// import "./Navbar.css";

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false); // for desktop dropdown
//   const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false); // for mobile dropdown

//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, [pathname]);

//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/api/groups/name`)
//       .then((res) => setGroups(res.data))
//       .catch((err) => console.error("Failed to fetch groups:", err));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   const navItems = [
//     { label: "Home", to: "/" },
//     // { label: "Director Profile", to: "/directorprofile" },
//     {
//       label: "Groups",
//       dropdown: true,
//       items: groups.map((group) => ({
//         label: group.name,
//         to: `group/${group._id}`,
//       })),
//     },
//     ...(isLoggedIn
//       ? [
//           // { label: "About ABC", to: "/labs" },
//           { label: "Sign Out", to: "#", action: handleLogout },
//           { label: "View Profile", to: "/profile" },
//         ]
//       : [
//           { label: "Login", to: "/login" },
//           { label: "Register", to: "/register" },
//         ]),
//   ];

//   return (
//     <nav className="main-navbar bg-[#003168] text-white shadow-lg w-full">
//       <div className="flex items-center justify-between h-16 w-full px-2">
//         {/* Desktop Menu */}
//         <div className="hidden md:flex space-x-6 items-center relative">
//           {navItems.map(({ label, to, action, dropdown, items }) => {
//             if (dropdown) {
//               return (
//                 <div key={label} className="relative">
//                   <button
//                     onClick={() => setDropdownOpen((prev) => !prev)}
//                     className={`px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 ${
//                       pathname.startsWith("/groups")
//                         ? "bg-[#0066cc] text-white"
//                         : "text-white hover:bg-[#004b99]"
//                     }`}
//                   >
//                     {label}
//                     {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
//                   </button>
//                   {dropdownOpen && (
//                     <div className="absolute bg-[#004b99] rounded-md mt-1 w-48 shadow-lg z-50">
//                       {items.map(({ label: itemLabel, to: itemTo }) => (
//                         <button
//                           key={itemLabel}
//                           onClick={() => {
//                             setDropdownOpen(false);
//                             navigate(itemTo);
//                           }}
//                           className={`block w-full text-left px-4 py-2 text-white hover:bg-[#0066cc] ${
//                             pathname === itemTo ? "bg-[#0066cc]" : ""
//                           }`}
//                         >
//                           {itemLabel}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             } else {
//               return (
//                 <button
//                   key={label}
//                   onClick={action || (() => navigate(to))}
//                   className={`px-4 py-2 rounded-md text-base font-medium ${
//                     pathname === to
//                       ? "bg-[#0066cc] text-white"
//                       : "text-white hover:bg-[#004b99]"
//                   }`}
//                 >
//                   {label}
//                 </button>
//               );
//             }
//           })}
//         </div>

//         {/* Mobile Menu Icon */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="text-white hover:text-gray-300 focus:outline-none"
//           >
//             {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-[#003168]">
//           <div className="px-4 pt-2 pb-4 space-y-1">
//             {navItems.map(({ label, to, action, dropdown, items }) => {
//               if (dropdown) {
//                 return (
//                   <div key={label}>
//                     <button
//                       onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
//                       className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-[#004b99] ${
//                         pathname.startsWith("/groups") ? "bg-[#0066cc]" : ""
//                       }`}
//                     >
//                       {label}
//                       {mobileDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
//                     </button>
//                     {mobileDropdownOpen && (
//                       <div className="pl-6 mt-1 space-y-1">
//                         {items.map(({ label: itemLabel, to: itemTo }) => (
//                           <button
//                             key={itemLabel}
//                             onClick={() => {
//                               setIsOpen(false);
//                               setMobileDropdownOpen(false);
//                               navigate(itemTo);
//                             }}
//                             className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-[#0066cc] ${
//                               pathname === itemTo ? "bg-[#0066cc]" : ""
//                             }`}
//                           >
//                             {itemLabel}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 );
//               } else {
//                 return (
//                   <button
//                     key={label}
//                     onClick={() => {
//                       setIsOpen(false);
//                       action ? action() : navigate(to);
//                     }}
//                     className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium ${
//                       pathname === to
//                         ? "bg-[#0066cc] text-white"
//                         : "text-white hover:bg-[#004b99]"
//                     }`}
//                   >
//                     {label}
//                   </button>
//                 );
//               }
//             })}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

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
  const [dropdownOpen, setDropdownOpen] = useState(false); // desktop dropdown
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false); // mobile dropdown

  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const role = localStorage.getItem("role");
    setUserRole(role);
  }, [pathname]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/groups/name`)
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Failed to fetch groups:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
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
        to: `group/${group._id}`,
      })),
    },
    ...(isLoggedIn
      ? [
          userRole === "admin" && { label: "Admin Panel", to: "/admin" },
          { label: "Sign Out", to: "#", action: handleLogout },
          { label: "View Profile", to: "/profile" },
        ].filter(Boolean)
      : [
          { label: "Login", to: "/login" },
          { label: "Register", to: "/register" },
        ]),
  ];

  return (
    <nav className="main-navbar bg-[#003168] text-white shadow-lg w-full">
      <div className="flex items-center justify-between h-16 w-full px-2">
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center relative">
          {navItems.map(({ label, to, action, dropdown, items }) => {
            if (dropdown) {
              return (
                <div key={label} className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className={`px-4 py-2 rounded-md text-base font-medium flex items-center gap-1 ${
                      pathname.startsWith("/groups")
                        ? "bg-[#0066cc] text-white"
                        : "text-white hover:bg-[#004b99]"
                    }`}
                  >
                    {label}
                    {dropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute bg-[#004b99] rounded-md mt-1 w-48 shadow-lg z-50">
                      {items.map(({ label: itemLabel, to: itemTo }) => (
                        <button
                          key={itemLabel}
                          onClick={() => {
                            setDropdownOpen(false);
                            navigate(itemTo);
                          }}
                          className={`block w-full text-left px-4 py-2 text-white hover:bg-[#0066cc] ${
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
                  onClick={action || (() => navigate(to))}
                  className={`px-4 py-2 rounded-md text-base font-medium ${
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
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className={`flex justify-between items-center w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-[#004b99] ${
                        pathname.startsWith("/groups") ? "bg-[#0066cc]" : ""
                      }`}
                    >
                      {label}
                      {mobileDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {mobileDropdownOpen && (
                      <div className="pl-6 mt-1 space-y-1">
                        {items.map(({ label: itemLabel, to: itemTo }) => (
                          <button
                            key={itemLabel}
                            onClick={() => {
                              setIsOpen(false);
                              setMobileDropdownOpen(false);
                              navigate(itemTo);
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-md text-base font-medium text-white hover:bg-[#0066cc] ${
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
                );
              }
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
