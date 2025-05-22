// AdminLayout.jsx
import { Outlet } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import DocumentMarquee from "./DocumentMarquee";
const AdminLayout = () => {
  return (
    <>
      <TopNavbar />
      <Navbar />
      <DocumentMarquee />
      <div className="flex">
        <div  className="w-64 bg-gray-100 min-h-screen">
          {/* <Sidebar /> */}
        </div>
        <div className="flex-1 p-6 bg-white min-h-screen">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
