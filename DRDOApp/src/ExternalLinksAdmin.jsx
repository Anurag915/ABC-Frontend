import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  Info,
  XCircle,
  CheckCircle,
} from "lucide-react"; // Import icons

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ExternalLinksAdmin = () => {
  const [links, setLinks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Changed to null initially
  const [messageType, setMessageType] = useState(""); // 'success', 'error', 'info'
  const [labId, setLabId] = useState(null);

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Utility function to set messages with a timeout
  const showMessage = (msg, type = "info", duration = 3000) => {
    setMessage(msg);
    setMessageType(type);
    const timer = setTimeout(() => {
      setMessage(null);
      setMessageType("");
    }, duration);
    return () => clearTimeout(timer); // Cleanup timer if component unmounts
  };

  // Fetch Lab ID
  useEffect(() => {
    const fetchLab = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/labs/only`);
        setLabId(res.data._id);
      } catch (err) {
        console.error("Failed to load lab:", err);
        showMessage("Failed to load lab information.", "error");
      }
    };
    fetchLab();
  }, []);

  // Fetch Links only after labId is available
  useEffect(() => {
    const fetchLinks = async () => {
      if (!labId) return; // Don't fetch if labId is not yet available
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl}/api/labs/${labId}/external-links`
        );
        const data = res.data;
        setLinks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching links:", err);
        showMessage("Failed to fetch links.", "error");
        setLinks([]); // fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [labId]); // Refetch when labId changes

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClearForm = () => {
    setFormData({ title: "", url: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!labId) {
      showMessage("Lab information not available.", "error");
      return;
    }
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(
          `${apiUrl}/api/labs/${labId}/external-links/${editingId}`,
          formData,
          { headers }
        );
        showMessage("Link updated successfully!", "success");
      } else {
        await axios.post(
          `${apiUrl}/api/labs/${labId}/external-links`,
          formData,
          {
            headers,
          }
        );
        showMessage("Link added successfully!", "success");
      }

      handleClearForm(); // Clear form after submission
      // Refetch links to ensure list is up-to-date
      const res = await axios.get(`${apiUrl}/api/labs/${labId}/external-links`);
      setLinks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "Error saving link:",
        err.response?.data?.message || err.message
      );
      showMessage(
        `Error saving link: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (link) => {
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
    });
    setEditingId(link._id);
    setMessage(null); // Clear any existing messages when starting edit
  };

  const handleDelete = async (id) => {
    if (!labId) {
      showMessage("Lab information not available.", "error");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this link?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/labs/${labId}/external-links/${id}`, {
        headers,
      });
      setLinks((prev) => prev.filter((link) => link._id !== id));
      showMessage("Link deleted successfully!", "success");
    } catch (err) {
      console.error(
        "Error deleting link:",
        err.response?.data?.message || err.message
      );
      showMessage(
        `Failed to delete link: ${err.response?.data?.message || err.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen mt-10">
      <div className=" mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          Manage External Links
        </h1>

        {/* Message Display */}
        {message && (
          <div
            className={`flex items-center p-3 mb-4 rounded-lg text-sm
            ${messageType === "success" ? "bg-green-100 text-green-700" : ""}
            ${messageType === "error" ? "bg-red-100 text-red-700" : ""}
            ${messageType === "info" ? "bg-blue-100 text-blue-700" : ""}
          `}
          >
            {messageType === "success" && (
              <CheckCircle size={20} className="mr-2" />
            )}
            {messageType === "error" && <XCircle size={20} className="mr-2" />}
            {messageType === "info" && <Info size={20} className="mr-2" />}
            <span>{message}</span>
          </div>
        )}

        {/* Link Form */}
        <div className="mb-8 p-6 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            {editingId ? "Edit Link" : "Add New Link"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., University Website"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of the link's content"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm resize-y"
              ></textarea>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                className={`flex items-center px-5 py-2.5 rounded-md text-white font-medium transition duration-200 ease-in-out
                  ${
                    loading || !labId
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  }
                `}
                disabled={loading || !labId}
              >
                {loading && <Loader2 size={20} className="animate-spin mr-2" />}
                {editingId ? (
                  "Update Link"
                ) : (
                  <>
                    <PlusCircle size={20} className="mr-2" /> Add Link
                  </>
                )}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-4 py-2.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Links List */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-4">
          Existing Links
        </h2>
        {loading && links.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Loader2 size={24} className="animate-spin mx-auto mb-2" />
            <p>Loading links...</p>
          </div>
        )}
        {!loading && links.length === 0 && (
          <p className="text-gray-500 text-center py-4 border border-dashed border-gray-300 rounded-lg">
            No external links added yet.
          </p>
        )}

        {links.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {links.map((link) => (
              <div
                key={link._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between"
              >
                <div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200 block mb-1 break-words"
                  >
                    {link.title}
                  </a>
                  {link.description && (
                    <p className="text-sm text-gray-600 mb-3 break-words">
                      {link.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 break-words mb-3">
                    {link.url}
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-auto">
                  <button
                    onClick={() => handleEdit(link)}
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="flex items-center text-red-500 hover:text-red-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExternalLinksAdmin;
