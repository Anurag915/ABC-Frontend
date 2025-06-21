import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FileText, // For the main heading
  Search, // For the search bar
  FileWarning, // For no results
  Download, // For download button
  Loader2, // For loading spinner
  Tag, // For categories/badges
  Hash, // For Letter ID, Docket No, Letter No
  Calendar, // For dates
  BookOpen, // For language
  User, // For communicated by / uploaded by
  Building2, // For establishment
} from "lucide-react"; // Make sure to install lucide-react if you haven't: npm install lucide-react

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
        // Sort letters by upload date (newest first)
        const sortedLetters = res.data.sort(
          (a, b) => new Date(b.letterUploadDate) - new Date(a.letterUploadDate)
        );
        setLetters(sortedLetters);
        setFiltered(sortedLetters);
      } catch (err) {
        console.error("Error fetching letters:", err);
        setError(
          err.response?.data?.error ||
            "Failed to fetch letters. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFiltered(letters);
      return;
    }

    setFiltered(
      letters.filter(
        (l) =>
          l.letterSub?.toLowerCase().includes(query) ||
          l.docketNo?.toLowerCase().includes(query) ||
          l.letterNo?.toLowerCase().includes(query) ||
          l.category?.toLowerCase().includes(query) ||
          l.establishment?.toLowerCase().includes(query) ||
          l.letterLanguage?.toLowerCase().includes(query) ||
          l.letterCommunBy?.toLowerCase().includes(query) ||
          (l.letterId && l.letterId.toString().includes(query)) ||
          l.uploadedBy?.name?.toLowerCase().includes(query) // Added search by uploader name
      )
    );
  }, [search, letters]);

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 rounded-lg shadow-inner">
      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
      <p className="text-xl text-gray-700 font-medium">
        Loading correspondence...
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-red-50 rounded-lg shadow-inner p-6">
      <FileWarning className="w-16 h-16 text-red-500 mb-4" />
      <p className="text-2xl text-red-700 font-semibold text-center">
        Error: {error}
      </p>
      <p className="text-md text-red-600 mt-2">
        Please try refreshing the page or contact support if the issue persists.
      </p>
    </div>
  );

  const renderNoResults = () => (
    <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
      <FileWarning className="mx-auto h-20 w-20 text-gray-400 mb-6" />
      <h3 className="mt-2 text-2xl font-semibold text-gray-900">
        No letters found
      </h3>
      <p className="mt-1 text-md text-gray-500">
        Adjust your search criteria or try again later.
      </p>
    </div>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return "Invalid Date";
    }
  };

  if (loading) return renderLoading();
  if (error) return renderError();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className=" mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-10 text-center flex items-center justify-center">
          <FileText className="h-12 w-12 text-indigo-600 mr-4" />
          Letters & Correspondence
        </h1>

        {/* Search Bar */}
        <div className="relative mb-10 rounded-xl shadow-lg bg-white border border-gray-200">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by subject, docket #, letter #, category, establishment, language, communicated by, letter ID, or uploader..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-12 pr-4 py-3 border border-transparent rounded-xl leading-6 bg-white placeholder-gray-500 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:border-transparent text-gray-900 text-lg transition duration-200 ease-in-out shadow-sm"
          />
        </div>

        {/* Letters Grid */}
        {filtered.length === 0 ? (
          renderNoResults()
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((letter) => (
              <div
                key={letter._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 flex flex-col justify-between border border-gray-200 group"
              >
                {/* Header */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-700 transition-colors duration-200">
                  {letter.letterSub || "No Subject"}
                </h3>

                {/* Content */}
                <div className="space-y-3 text-base text-gray-700 mb-6 flex-grow">
                  <p className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Letter ID:
                    </span>{" "}
                    <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium tracking-wide">
                      {letter.letterId || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Docket No:
                    </span>{" "}
                    <span className="ml-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium tracking-wide">
                      {letter.docketNo || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Hash className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Letter No:
                    </span>{" "}
                    <span className="ml-2 text-gray-700">
                      {letter.letterNo || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Letter Date:
                    </span>{" "}
                    <span className="ml-2 text-gray-700">
                      {formatDate(letter.letterDate)}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Docket Date:
                    </span>{" "}
                    <span className="ml-2 text-gray-700">
                      {formatDate(letter.docketDate)}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Tag className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Category:
                    </span>{" "}
                    <span className="ml-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium tracking-wide">
                      {letter.category || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Building2 className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Establishment:
                    </span>{" "}
                    <span className="ml-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium tracking-wide">
                      {letter.establishment || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Language:
                    </span>{" "}
                    <span className="ml-2 text-gray-700">
                      {letter.letterLanguage || "N/A"}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      Communicated By:
                    </span>{" "}
                    <span className="ml-2 text-gray-700">
                      {letter.letterCommunBy || "N/A"}
                    </span>
                  </p>
                </div>

                {/* Footer with Uploader Info and Download */}
                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <p className="flex items-center text-sm text-gray-500 mb-3">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    Uploaded By:{" "}
                    <span className="font-medium text-gray-700 ml-1">
                      {letter.uploadedBy?.name || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 inline-block mr-2 text-gray-400" />
                    Uploaded On:{" "}
                    <span className="font-medium text-gray-700 ml-1">
                      {formatDateTime(letter.letterUploadDate)}
                    </span>
                  </p>

                  {letter.fileName && (
                    <a
                      href={`${apiUrl}/uploads/letters/${letter.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                      <Download className="-ml-1 mr-3 h-5 w-5" />
                      Download File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
