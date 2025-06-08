import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function LettersList() {
  const [letters, setLetters] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/api/dac`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLetters(res.data);
        setFiltered(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(letters);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      letters.filter(
        (l) =>
          l.letterSub.toLowerCase().includes(q) ||
          l.docketNo.toLowerCase().includes(q) ||
          l.letterNo.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          l.establishment.toLowerCase().includes(q) ||
          // Added new fields to search
          l.letterLanguage.toLowerCase().includes(q) ||
          l.letterCommunBy.toLowerCase().includes(q) ||
          (l.letterId && l.letterId.toString().includes(q)) // Search by letterId
      )
    );
  }, [search, letters]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-lg text-gray-600">Loading letters...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600 font-semibold">
          Error loading letters: {error}
        </p>
      </div>
    );

  return (
    <div className=" bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className=" mx-auto">
        {/* Page Header */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 text-center mt-14 tracking-tight">
          Letters & Correspondence
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8 shadow-sm rounded-lg bg-white">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by subject, docket #, letter #, category, establishment, language, communicated by, or Letter ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm transition duration-150 ease-in-out"
          />
        </div>

        {/* No results */}
        {filtered.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-lg text-gray-600">
              No letters found matching your search.
            </p>
          </div>
        ) : (
          /* Grid of cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((letter) => (
              <div
                key={letter._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-5 flex flex-col justify-between border border-gray-200"
              >
                {/* Header */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {letter.letterSub}
                </h3>

                {/* Content */}
                <div className="space-y-3 text-base text-gray-700 mb-4">
                  {/* Increased font size for content fields */}
                  <p>
                    <span className="font-semibold text-gray-800">Letter ID:</span>{" "}
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {letter.letterId || "N/A"}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Docket No:</span>{" "}
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {letter.docketNo}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Letter No:</span>{" "}
                    {letter.letterNo}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Letter Date:</span>{" "}
                    {new Date(letter.letterDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Docket Date:</span>{" "}
                    {letter.docketDate ? new Date(letter.docketDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }) : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Category:</span>{" "}
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {letter.category}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Establishment:</span>{" "}
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {letter.establishment}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Letter Language:</span>{" "}
                    {letter.letterLanguage || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Communicated By:</span>{" "}
                    {letter.letterCommunBy || "N/A"}
                  </p>
                  <p className="flex items-center text-sm text-gray-500 mt-2">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Uploaded By: {letter.uploadedBy?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">Uploaded On:</span>{" "}
                    {new Date(letter.letterUploadDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Download link */}
                {letter.fileName && (
                  <a
                    href={`${apiUrl}/uploads/letters/${letter.fileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Download File
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}