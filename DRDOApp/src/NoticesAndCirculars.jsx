import React, { useEffect, useState } from "react";

// Ensure API URL has a fallback, good practice for dev/prod environments
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function NoticesAndCirculars({ labId }) {
  const [data, setData] = useState({ notices: [], circulars: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNoticesAndCirculars() {
      if (!labId) {
        setError("Lab ID is missing.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const res = await fetch(`${apiUrl}/api/labs/${labId}`);
        if (!res.ok) {
          // Attempt to read error message from response if available
          const errorData = await res.json();
          throw new Error(errorData.message || `Failed to fetch data: ${res.statusText}`);
        }
        const lab = await res.json();
        setData({ notices: lab.notices || [], circulars: lab.circulars || [] });
      } catch (err) {
        console.error("Error fetching notices/circulars:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchNoticesAndCirculars();
  }, [labId]);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg shadow-inner mt-8 mx-auto max-w-xl">
        <p className="text-xl text-blue-700 font-semibold animate-pulse">Loading notices and circulars...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 bg-red-50 border border-red-300 rounded-lg shadow-inner mt-8 mx-auto max-w-xl">
        <p className="text-red-700 font-medium text-center px-4">Error: {error}</p>
      </div>
    );
  }

  // Helper for rendering each file item (notice or circular)
  const renderFileList = (items) => (
    <ul className="list-none p-0 space-y-6"> {/* Remove default list styles, add spacing */}
      {items.map(({ _id, name, description, fileUrl }) => (
        <li
          key={_id}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-100
                     transform transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg"
        >
          <a
            href={`${apiUrl}${fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-700 font-semibold text-lg hover:text-blue-800 transition-colors duration-200"
            title={`Open: ${name}`}
          >
            {/* File Icon */}
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              ></path>
            </svg>
            {name}
            {/* External link icon for visual cue */}
            <svg className="ml-2 w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
          </a>
          {description && (
            <p className="mt-2 text-gray-600 text-base leading-relaxed">
              {description}
            </p>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[500px] rounded-lg shadow-inner">
      <h2
        className="text-3xl font-extrabold text-gray-800 mb-6 pb-2 border-b-2 border-blue-600"
      >
        Notices
      </h2>

      {data.notices.length > 0 ? (
        renderFileList(data.notices)
      ) : (
        <p className="text-gray-500 text-center italic p-4 bg-white rounded-md shadow-sm">
          No notices found for this lab.
        </p>
      )}

      <h2
        className="text-3xl font-extrabold text-gray-800 mt-12 mb-6 pb-2 border-b-2 border-green-600"
      >
        Circulars
      </h2>

      {data.circulars.length > 0 ? (
        renderFileList(data.circulars)
      ) : (
        <p className="text-gray-500 text-center italic p-4 bg-white rounded-md shadow-sm">
          No circulars found for this lab.
        </p>
      )}
    </div>
  );
}

export default NoticesAndCirculars;