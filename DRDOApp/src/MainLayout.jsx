import TopNavbar from "./TopNavbar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DocumentMarquee from "./DocumentMarquee";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import InfiniteLabPhotos from "./InfiniteLabPhotos";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function MainLayout() {
  const [labId, setLabId] = useState(null);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/labs/only`);
        setLabId(res.data._id);
      } catch (err) {
        console.error("Failed to load lab", err);
      }
    };
    fetchLab();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <DocumentMarquee />
      <TopNavbar />
      <Navbar />
      <InfiniteLabPhotos labId={labId} />
      <main className="flex-grow mt-[230px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
