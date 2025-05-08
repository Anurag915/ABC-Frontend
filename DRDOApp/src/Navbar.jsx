// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { HiMenu, HiX } from "react-icons/hi";

// export default function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const { pathname } = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token); // true if token exists
//   }, [pathname]); // Re-check on route change

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     navigate("/login");
//   };

//   const navItems = [
//     { label: "Home", to: "/" },
//     ...(isLoggedIn
//       ? [{ label: "Sign Out", to: "#", action: handleLogout }]
//       : [
//           { label: "Login", to: "/login" },
//           { label: "Register", to: "/register" },
//         ]),
//   ];

//   return (
//     <nav className="bg-black text-white sticky top-0 z-50 shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <img
//               src="/drdo.jpeg"
//               alt="DRDO Logo"
//               className="h-14 w-14 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
//             />
//             <span className="text-2xl font-bold">DRDO CFEES</span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-6">
//             {navItems.map(({ label, to, action }) => (
//               <button
//                 key={label}
//                 onClick={action || (() => navigate(to))}
//                 className={`
//                   px-3 py-2 rounded-md text-sm font-medium
//                   ${
//                     pathname === to
//                       ? "bg-blue-600 text-white"
//                       : "text-gray-300 hover:bg-gray-700 hover:text-white"
//                   }
//                 `}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>

//           {/* Mobile hamburger */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//             >
//               {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden bg-black">
//           <div className="px-2 pt-2 pb-3 space-y-1">
//             {navItems.map(({ label, to, action }) => (
//               <button
//                 key={label}
//                 onClick={() => {
//                   setIsOpen(false);
//                   action ? action() : navigate(to);
//                 }}
//                 className={`
//                   block w-full text-left px-3 py-2 rounded-md text-base font-medium
//                   ${
//                     pathname === to
//                       ? "bg-blue-600 text-white"
//                       : "text-gray-300 hover:bg-gray-700 hover:text-white"
//                   }
//                 `}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }



import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navItems = [
    { label: "Home", to: "/" },
    ...(isLoggedIn
      ? [{ label: "Sign Out", to: "#", action: handleLogout }]
      : [
          { label: "Login", to: "/login" },
          { label: "Register", to: "/register" },
        ]),
  ];

  return (
    <nav className="bg-[#003168] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/drdo.jpeg"
              alt="DRDO Logo"
              className="h-12 w-12 rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <span className="text-2xl font-bold">DRDO CFEES</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map(({ label, to, action }) => (
              <button
                key={label}
                onClick={action || (() => navigate(to))}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${
                    pathname === to
                      ? "bg-[#0066cc] text-white"  // Lighter blue for active
                      : "text-white hover:bg-[#004b99] hover:text-white" // Darker blue on hover
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#003168]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(({ label, to, action }) => (
              <button
                key={label}
                onClick={() => {
                  setIsOpen(false);
                  action ? action() : navigate(to);
                }}
                className={`
                  block w-full text-left px-3 py-2 rounded-md text-base font-medium
                  ${
                    pathname === to
                      ? "bg-[#0066cc] text-white"  // Lighter blue for active
                      : "text-white hover:bg-[#004b99] hover:text-white" // Darker blue on hover
                  }
                `}
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
