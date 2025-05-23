import TopNavbar from "./TopNavbar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DocumentMarquee from "./DocumentMarquee";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <DocumentMarquee />
      <TopNavbar />
      <Navbar />
      <div style={{ marginTop: "200px" }}>
        <Outlet />
        <Footer />
      </div>
    </>
  );
}
