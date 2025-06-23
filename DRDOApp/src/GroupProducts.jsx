import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  FileText,
  Lightbulb,
  Briefcase,
  AlertCircle,
  Link as LinkIcon, // Renaming Link to avoid conflict with React component
} from "lucide-react";

const apiUri = import.meta.env.VITE_API_URL || "http://localhost:5000";
// Assuming axiosInstance handles base URL and authentication tokens
import axiosInstance from "./axiosInstance";

// Map titles to Lucide React icons for visual flair
const iconMap = {
  "Technologies Developed": <Lightbulb className="text-yellow-600 w-6 h-6" />,
  Patents: <FileText className="text-purple-600 w-6 h-6" />,
  Publications: <BookOpen className="text-green-600 w-6 h-6" />,
  Projects: <Briefcase className="text-blue-600 w-6 h-6" />,
};

const GroupProducts = ({ groupId }) => {
  const [data, setData] = useState({
    technologies: [],
    patents: [],
    publications: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) {
        setError("Group ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true); // Ensure loading state is active
        setError(""); // Clear previous errors
        const res = await axiosInstance.get(`/api/groups/id/${groupId}`);
        setData({
          technologies: res.data.technologies || [],
          patents: res.data.patents || [],
          publications: res.data.publications || [],
          projects: res.data.projects || [],
        });
      } catch (err) {
        console.error("Error fetching group details:", err);
        // Better error message extraction from Axios error
        setError(err.response?.data?.message || err.message || "Failed to fetch group details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  // Helper function to render each section (Technologies, Patents, etc.)
  const renderSection = (title, items) => (
    <div className="mb-12"> {/* Increased bottom margin for sections */}
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
        {iconMap[title]} {/* Display icon */}
        <h3 className="text-3xl font-extrabold text-gray-800">{title}</h3> {/* Larger, bolder title */}
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500 italic text-center p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <p>No {title.toLowerCase()} available for this group at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Responsive grid with more spacing */}
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-md
                         transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between" // Added transform for hover, flex column for content distribution
            >
              <div> {/* Content wrapper for top part of card */}
                <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {item.name}
                </h4>
                <p className="text-gray-700 text-sm mb-4 line-clamp-3"> {/* Added line-clamp for description */}
                  {item.description || "No description provided."}
                </p>
              </div>
              {item.fileUrl && (
                <a
                  href={`${apiUri}${item.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             transition-colors duration-200 self-start mt-auto" // self-start and mt-auto push to bottom left
                >
                  View Document
                  <LinkIcon className="ml-2 w-4 h-4" /> {/* External link icon */}
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-xl animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-10 mx-auto"></div> {/* Main title placeholder */}
        {Array.from({ length: 4 }).map((_, sectionIdx) => (
          <div key={sectionIdx} className="mb-12">
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div> {/* Icon placeholder */}
              <div className="h-8 bg-gray-200 rounded w-1/4"></div> {/* Section title placeholder */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, itemIdx) => (
                <div key={itemIdx} className="bg-gray-100 rounded-xl p-6 h-40">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-red-50 border border-red-300 rounded-lg shadow-md flex items-center gap-4 text-red-700 mt-10">
        <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  // --- Main Content UI ---
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16 pb-4 border-b-2 border-blue-500">
        Group Activities & Products
      </h2>

      {/* Check if there's any data to display */}
      {data.technologies.length === 0 &&
      data.patents.length === 0 &&
      data.publications.length === 0 &&
      data.projects.length === 0 ? (
        <div className="text-center text-gray-600 text-xl p-10 bg-white rounded-lg shadow-md border border-gray-100 mt-10">
          <p className="mb-4">No activities or products found for this group.</p>
          <p className="text-base italic">It might be a new group or data has not been added yet.</p>
        </div>
      ) : (
        <>
          {renderSection("Technologies Developed", data.technologies)}
          {renderSection("Patents", data.patents)}
          {renderSection("Publications", data.publications)}
          {renderSection("Projects", data.projects)}
        </>
      )}
    </div>
  );
};

export default GroupProducts;