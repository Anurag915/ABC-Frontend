// import { useState } from "react";
import RoleOfHonourTable from "./RoleOfHonourTable";
import LabDetails from "./pages/Labs";
import DirectorProfile from "./pages/DirectorProfile";
import VisionMission from "./VisionMission";
import Contact from "./Contact";
import NoticesAndCirculars from "./NoticesAndCirculars";
import ProductsAndAdvertisements from "./ProductsAndAdvertisements";
import OfficeOfDirector from "./OfficeOfDirector";
import LabHistoryDetails from "./LabHistoryDetails";
import LabManpowerList from "./LabManpowerList";
import InfiniteLabPhotos from "./InfiniteLabPhotos";
import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const sections = [
  "About Lab",
  "Vision and Mission",
  "Director Profile",
  "O/o Director",
  "Role & Honour",
  "Lab History",
  "Personnel Details",
  "Notices & Circular",
  "Product & Achievements",
  "Contact Us",
  // "gallery",
];

function HomePage() {
  const [selectedSection, setSelectedSection] = useState("About Lab");
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
  const renderContent = () => {
    console.log(labId);
    if (!labId) return <p>Loading...</p>;
    // return <InfiniteLabPhotos labId={labId} />;
    switch (selectedSection) {
      case "About Lab":
        return <LabDetails labId={labId} />;
      case "Vision and Mission":
        return <VisionMission labId={labId} />;
      case "Director Profile":
        return <DirectorProfile labId={labId} />;
      case "O/o Director":
        return <OfficeOfDirector labId={labId} />;
      case "Role & Honour":
        return <RoleOfHonourTable labId={labId} />;
      case "Lab History":
        return <LabHistoryDetails labId={labId} />;
      case "Personnel Details":
        return <LabManpowerList labId={labId} />;
      case "Notices & Circular":
        return <NoticesAndCirculars labId={labId} />;
      case "Product & Achievements":
        return <ProductsAndAdvertisements labId={labId} />;
      case "Contact Us":
        return <Contact labId={labId} />;
      // case "gallery": // new section for your photos
      //   return <InfiniteLabPhotos labId={labId} />;
      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-50 font-sans text-black mt-20">
      {labId ? (
        <div className="mb-8">
          <InfiniteLabPhotos labId={labId} />
        </div>
      ) : (
        <p>Loading gallery...</p>
      )}
      <main className="flex flex-col md:flex-row  mx-auto shadow-lg rounded-lg bg-white">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-blue-100 p-6 space-y-4 rounded-l-lg border-r border-blue-300 shadow-inner">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedSection === section
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-300"
              }`}
              aria-current={selectedSection === section ? "page" : undefined}
            >
              {section}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-8 overflow-auto rounded-r-lg">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 border-b border-blue-300 pb-2">
            {selectedSection}
          </h2>
          <div className="text-gray-700 leading-relaxed">{renderContent()}</div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
