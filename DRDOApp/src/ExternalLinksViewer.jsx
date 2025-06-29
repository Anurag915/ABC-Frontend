import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link as LinkIcon, XCircle, Globe } from "lucide-react"; // Import icons

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ExternalLinksViewer = ({ labId }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLinks = async () => {
      if (!labId) {
        setError("Lab ID is missing for external links.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(""); // Clear previous errors
        const response = await axios.get(`${apiUrl}/api/labs/${labId}/external-links`);

        const data = response.data;

        // Ensure it's an array before setting
        if (Array.isArray(data)) {
          setLinks(data);
        } else if (Array.isArray(data.externalLinks)) {
          setLinks(data.externalLinks); // fallback for wrapped response (e.g., if backend sends { externalLinks: [...] })
        } else {
          setLinks([]);
          setError("Invalid data format from server for external links.");
        }
      } catch (err) {
        console.error("Error fetching external links:", err);
        setError("Failed to load external links.");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [labId]);

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse p-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
      </div>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-600 bg-red-50 rounded-lg p-4 text-center">
        <XCircle className="w-8 h-8 mb-2" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  // --- Empty State UI ---
  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg p-4 text-center">
        <Globe className="w-12 h-12 mb-2" />
        <p className="text-lg font-medium">No useful external links available.</p>
        <p className="text-sm">Check back later for updates!</p>
      </div>
    );
  }

  // --- Main Content UI ---
  return (
    <div className="w-full h-full overflow-y-auto pr-2"> {/* Added overflow for the card's fixed height */}
      <ul className="list-none p-0 space-y-4"> {/* Increased space between links */}
        {links.map((link) => (
          <li
            key={link._id}
            className="pb-3 border-b border-gray-100 last:border-b-0 last:pb-0" // Subtle separator for list items
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start text-gray-700 hover:text-purple-600 transition-colors duration-200 group"
            >
              <LinkIcon className="w-5 h-5 mr-3 text-purple-500 flex-shrink-0 mt-1" /> {/* Icon with consistent spacing */}
              <div className="flex-grow">
                <span className="font-semibold text-base block group-hover:underline">
                  {link.title}
                </span>
                {link.description && (
                  <p className="text-sm text-gray-500 line-clamp-2"> {/* Line clamp for description */}
                    {link.description}
                  </p>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExternalLinksViewer;