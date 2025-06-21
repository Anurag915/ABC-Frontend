import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  FolderKanban,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  UploadCloud,
  Trash2,
  Edit3,
  Download,
  Loader2,
  PlusCircle,
  FileWarning,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserCloseGroupDocs = () => {
  const [userId, setUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [fileInputs, setFileInputs] = useState({});
  const [renaming, setRenaming] = useState({});
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [uploading, setUploading] = useState("");
  const [processingRename, setProcessingRename] = useState("");
  const [deleting, setDeleting] = useState("");
  const [groupFetchError, setGroupFetchError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState({});
  const [documentActionMessage, setDocumentActionMessage] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded._id || decoded.id || decoded.userId);
      } catch (e) {
        console.error("Failed to decode token:", e);
        setGroupFetchError("Authentication failed. Please log in again.");
      }
    } else {
      setGroupFetchError("No authentication token found. Please log in.");
    }
  }, [token]);

  const fetchUserWithGroups = async () => {
    if (!userId) {
      setLoadingGroups(false);
      return;
    }
    setLoadingGroups(true);
    setGroupFetchError(null);
    try {
      const res = await axios.get(`${apiUrl}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data.closeGroup || []);
    } catch (err) {
      console.error("Error fetching user with groups:", err);
      setGroupFetchError("Failed to load your close groups. Please try again.");
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchUserWithGroups();
  }, [userId]);

  const toggleGroup = (groupId) => {
    setExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleFileChange = (e, groupId) => {
    const file = e.target.files[0] || null;
    setFileInputs((prev) => ({ ...prev, [groupId]: file }));
  };

  const handleUpload = async (groupId) => {
    const file = fileInputs[groupId];
    if (!file) {
      setUploadMessage({
        [groupId]: {
          type: "error",
          message: "Please select a file to upload.",
        },
      });
      setTimeout(() => setUploadMessage({}), 5000);
      return;
    }
    setUploading(groupId);
    setUploadMessage({});
    const formData = new FormData();
    formData.append("document", file);

    try {
      await axios.post(
        `${apiUrl}/api/close-groups/${groupId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadMessage({
        [groupId]: {
          type: "success",
          message: "Document uploaded successfully!",
        },
      });
      setFileInputs((prev) => ({ ...prev, [groupId]: null }));
      const fileInput = document.getElementById(`file-upload-${groupId}`);
      if (fileInput) fileInput.value = "";
      await fetchUserWithGroups();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setUploadMessage({
        [groupId]: {
          type: "error",
          message:
            "Upload failed: " +
            (err.response?.data?.message || "An unknown error occurred."),
        },
      });
    } finally {
      setUploading("");
      setTimeout(() => setUploadMessage({}), 5000);
    }
  };

  const handleDelete = async (groupId, docId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this document? This action cannot be undone."
      )
    )
      return;
    setDeleting(docId);
    setDocumentActionMessage({});
    try {
      await axios.delete(
        `${apiUrl}/api/close-groups/${groupId}/documents/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDocumentActionMessage({
        [docId]: { type: "success", message: "Document deleted successfully!" },
      });
      await fetchUserWithGroups();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      setDocumentActionMessage({
        [docId]: {
          type: "error",
          message:
            "Deletion failed: " +
            (err.response?.data?.message || "An unknown error occurred."),
        },
      });
    } finally {
      setDeleting("");
      setTimeout(() => setDocumentActionMessage({}), 5000);
    }
  };

  const handleRename = async (groupId, docId, currentFilename) => {
    const newFilename = (renaming[docId] || "").trim();
    if (!newFilename) {
      setDocumentActionMessage({
        [docId]: { type: "error", message: "Please enter a new filename." },
      });
      setTimeout(() => setDocumentActionMessage({}), 5000);
      return;
    }
    if (newFilename === currentFilename) {
      setDocumentActionMessage({
        [docId]: {
          type: "error",
          message: "New filename is the same as the current filename.",
        },
      });
      setRenaming((prev) => ({ ...prev, [doc._id]: "" }));
      setTimeout(() => setDocumentActionMessage({}), 5000);
      return;
    }

    setProcessingRename(docId);
    setDocumentActionMessage({});
    try {
      await axios.put(
        `${apiUrl}/api/close-groups/${groupId}/documents/${docId}`,
        { newFilename },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDocumentActionMessage({
        [docId]: { type: "success", message: "Document renamed successfully!" },
      });
      setRenaming((prev) => ({ ...prev, [docId]: "" }));
      await fetchUserWithGroups();
    } catch (err) {
      console.error("Rename error:", err.response?.data || err.message);
      setDocumentActionMessage({
        [docId]: {
          type: "error",
          message:
            "Rename failed: " +
            (err.response?.data?.message || "An unknown error occurred."),
        },
      });
    } finally {
      setProcessingRename("");
      setTimeout(() => setDocumentActionMessage({}), 5000);
    }
  };

  // --- Render States (Loading, Error, No Groups) ---
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-md p-8 text-center animate-fade-in">
      <Loader2 className="w-16 h-16 text-indigo-500 animate-spin-slow mb-4" />
      <p className="text-xl text-gray-700 font-medium">
        Loading your groups...
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 rounded-lg shadow-md p-8 text-center border border-red-200 animate-fade-in">
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h3 className="text-2xl font-semibold text-red-800 mb-3">
        Error Loading Groups
      </h3>
      <p className="text-lg text-red-700 mb-6">{groupFetchError}</p>
      <button
        onClick={fetchUserWithGroups}
        className="px-6 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center justify-center"
      >
        <Loader2 className="w-5 h-5 mr-2 animate-spin-slow" /> Retry
      </button>
    </div>
  );

  const renderNoGroups = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-lg shadow-md p-8 text-center border border-gray-200 animate-fade-in">
      <FileWarning className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        No Close Groups Found
      </h3>
      <p className="text-lg text-gray-600 mb-4">
        You're not currently a member of any close groups with shared documents.
      </p>
      <p className="text-md text-gray-500 flex items-center justify-center">
        <Info className="w-4 h-4 mr-2 text-blue-500" /> Join or create a group
        to see documents here.
      </p>
    </div>
  );

  if (loadingGroups) return renderLoading();
  if (groupFetchError) return renderError();

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans mt-18">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
      `}</style>

      <div className=" mx-auto">
        {/* --- Page Header --- */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-10 text-center flex items-center justify-center leading-tight">
          <FolderKanban className="w-10 h-10 sm:w-12 h-12 text-indigo-600 mr-3" />
          <span className="text-indigo-800">My Group Documents</span>
        </h1>

        {/* --- Groups List --- */}
        {groups.length === 0
          ? renderNoGroups()
          : groups.map((group) => (
              <div
                key={group._id}
                className="mb-6 bg-white shadow-md rounded-lg border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg animate-fade-in"
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group._id)}
                  className="w-full flex justify-between items-center px-5 py-4 bg-indigo-50 border-b border-indigo-100 text-indigo-800 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors duration-200"
                >
                  <div className="text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {group.groupName}
                    </h2>
                    <p className="text-sm sm:text-base mt-1 text-indigo-700">
                      {group.groupPurpose}
                    </p>
                  </div>
                  <span className="text-2xl">
                    {expandedGroup === group._id ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </span>
                </button>

                {/* Expanded Content */}
                {expandedGroup === group._id && (
                  <div className="p-5 bg-white border-t border-gray-100 animate-fade-in">
                    {/* Duration & Members */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700 text-sm sm:text-base">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                        <p>
                          <span className="font-semibold">Duration:</span>{" "}
                          {new Date(
                            group.groupDuration.from
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {" – "}
                          {new Date(group.groupDuration.to).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <Users className="w-4 h-4 mr-2 text-purple-500 mt-0.5" />
                        <p>
                          <span className="font-semibold">Members:</span>{" "}
                          {group.requestedBy && group.requestedBy.length > 0
                            ? group.requestedBy
                                .map(
                                  (u) =>
                                    u.personalDetails?.name || u.email || "N/A"
                                )
                                .join(", ")
                            : "No members listed."}
                        </p>
                      </div>
                    </div>

                    {/* Documents List */}
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-blue-500" />{" "}
                        Documents
                      </h3>
                      {group.documents && group.documents.length > 0 ? (
                        <ul className="space-y-3">
                          {group.documents.map((doc) => (
                            <li
                              key={doc._id}
                              className="bg-gray-50 border border-gray-200 rounded-md p-3 flex flex-col md:flex-row md:justify-between md:items-center shadow-sm animate-fade-in"
                            >
                              <div className="flex-1 mb-2 md:mb-0">
                                <a
                                  href={`${apiUrl}${doc.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-base sm:text-lg text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center"
                                >
                                  <Download className="w-4 h-4 mr-2 text-blue-500" />
                                  {doc.filename}
                                </a>
                                <p className="text-xs text-gray-500 mt-1 pl-6">
                                  Uploaded by{" "}
                                  <span className="font-medium">
                                    {doc.uploadedBy?.personalDetails?.name ||
                                      doc.uploadedBy?.email ||
                                      "Unknown"}
                                  </span>{" "}
                                  on{" "}
                                  {new Date(doc.uploadedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                {documentActionMessage[doc._id] && (
                                  <div
                                    className={`flex items-center text-xs mt-2 pl-6 ${
                                      documentActionMessage[doc._id].type ===
                                      "success"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {documentActionMessage[doc._id].type ===
                                    "success" ? (
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                    ) : (
                                      <XCircle className="w-3 h-3 mr-1" />
                                    )}
                                    {documentActionMessage[doc._id].message}
                                  </div>
                                )}
                              </div>

                              {/* Rename & Delete Actions */}
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto mt-2 md:mt-0">
                                <input
                                  type="text"
                                  placeholder="New name"
                                  value={renaming[doc._id] || ""}
                                  onChange={(e) =>
                                    setRenaming((prev) => ({
                                      ...prev,
                                      [doc._id]: e.target.value,
                                    }))
                                  }
                                  className="flex-grow p-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                                <button
                                  onClick={() =>
                                    handleRename(
                                      group._id,
                                      doc._id,
                                      doc.filename
                                    )
                                  }
                                  disabled={processingRename === doc._id}
                                  className={`px-3 py-1.5 rounded text-white text-sm font-medium flex items-center justify-center transition-colors duration-200 ${
                                    processingRename === doc._id
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                                  }`}
                                >
                                  {processingRename === doc._id ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <Edit3 className="w-4 h-4 mr-1" />
                                  )}
                                  {processingRename === doc._id
                                    ? "Renaming…"
                                    : "Rename"}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(group._id, doc._id)
                                  }
                                  disabled={deleting === doc._id}
                                  className={`px-3 py-1.5 rounded text-white text-sm font-medium flex items-center justify-center transition-colors duration-200 ${
                                    deleting === doc._id
                                      ? "bg-gray-400 cursor-not-allowed"
                                      : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                                  }`}
                                >
                                  {deleting === doc._id ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-4 h-4 mr-1" />
                                  )}
                                  {deleting === doc._id
                                    ? "Deleting…"
                                    : "Delete"}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-md border border-dashed border-gray-300 animate-fade-in">
                          <FileWarning className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-md text-gray-500">
                            No documents uploaded yet.
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Be the first to share!
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Upload Form */}
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 flex items-center">
                        <UploadCloud className="w-5 h-5 mr-2 text-purple-600" />{" "}
                        Upload New
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
                        <label
                          htmlFor={`file-upload-${group._id}`}
                          className="block w-full sm:flex-1 text-sm text-gray-700 bg-white border border-gray-300 rounded cursor-pointer
                                       py-2 px-3 flex items-center justify-center
                                       hover:bg-gray-100 transition-colors duration-200
                                       focus-within:ring-1 focus-within:ring-blue-400 focus-within:outline-none"
                        >
                          <UploadCloud className="w-5 h-5 mr-2 text-blue-600" />
                          <span className="font-medium">
                            {fileInputs[group._id]?.name || "Choose file..."}
                          </span>
                          <input
                            type="file"
                            id={`file-upload-${group._id}`}
                            accept="*"
                            onChange={(e) => handleFileChange(e, group._id)}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => handleUpload(group._id)}
                          disabled={
                            uploading === group._id || !fileInputs[group._id]
                          }
                          className={`w-full sm:w-auto px-4 py-2 rounded text-white text-sm font-medium flex items-center justify-center transition-colors duration-200 ${
                            uploading === group._id || !fileInputs[group._id]
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          }`}
                        >
                          {uploading === group._id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <PlusCircle className="w-4 h-4 mr-2" />
                          )}
                          {uploading === group._id ? "Uploading…" : "Upload"}
                        </button>
                      </div>
                      {uploadMessage[group._id] && (
                        <div
                          className={`mt-3 text-center py-2 px-3 rounded text-sm flex items-center justify-center ${
                            uploadMessage[group._id].type === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {uploadMessage[group._id].type === "success" ? (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          {uploadMessage[group._id].message}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default UserCloseGroupDocs;
