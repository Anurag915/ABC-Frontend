import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserCloseGroupDocs = () => {
  const [userId, setUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [fileInputs, setFileInputs] = useState({});      // { [groupId]: File }
  const [renaming, setRenaming] = useState({});          // { [docId]: newFilename }
  const [uploading, setUploading] = useState("");        // groupId being uploaded
  const [processingRename, setProcessingRename] = useState(""); // docId being renamed
  const [deleting, setDeleting] = useState("");          // docId being deleted
  const token = localStorage.getItem("token");

  // Decode JWT → get current user’s ID
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded._id || decoded.id || decoded.userId);
      } catch (e) {
        console.error("Failed to decode token:", e);
      }
    }
  }, [token]);

  // Fetch the user (including populated closeGroup) once we know userId
  const fetchUserWithGroups = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${apiUrl}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data.closeGroup || []);
    } catch (err) {
      console.error("Error fetching user with groups:", err);
    }
  };

  useEffect(() => {
    fetchUserWithGroups();
  }, [userId]);

  // Toggle expand/collapse for a group
  const toggleGroup = (groupId) => {
    setExpandedGroup((prev) => (prev === groupId ? null : groupId));
  };

  // Handle file selection per group
  const handleFileChange = (e, groupId) => {
    const file = e.target.files[0] || null;
    setFileInputs((prev) => ({ ...prev, [groupId]: file }));
  };

  // Upload document for a group
  const handleUpload = async (groupId) => {
    const file = fileInputs[groupId];
    if (!file) return;
    setUploading(groupId);
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
      setFileInputs((prev) => ({ ...prev, [groupId]: null }));
      await fetchUserWithGroups();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading("");
    }
  };

  // Delete a document
  const handleDelete = async (groupId, docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    setDeleting(docId);
    try {
      await axios.delete(
        `${apiUrl}/api/close-groups/${groupId}/documents/${docId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchUserWithGroups();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting("");
    }
  };

  // Rename a document
  const handleRename = async (groupId, docId) => {
    const newFilename = (renaming[docId] || "").trim();
    if (!newFilename) return;
    setProcessingRename(docId);
    try {
      await axios.put(
        `${apiUrl}/api/close-groups/${groupId}/documents/${docId}`,
        { newFilename },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRenaming((prev) => ({ ...prev, [docId]: "" }));
      await fetchUserWithGroups();
    } catch (err) {
      console.error("Rename error:", err);
    } finally {
      setProcessingRename("");
    }
  };

  return (
    <div className="bg-gray-50 py-8 mt-14">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-5xl font-semibold text-gray-800 mb-8 text-center">
          My Close Group Documents
        </h1>

        {groups.length === 0 ? (
          <p className="text-lg text-gray-600 text-center">You have no close groups.</p>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              className="mb-8 bg-white shadow-md rounded-lg overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group._id)}
                className="w-full flex justify-between items-center px-6 py-4 bg-blue-100 hover:bg-blue-200 focus:outline-none"
              >
                <div>
                  <h2 className="text-3xl font-medium text-blue-800">
                    {group.groupName}
                  </h2>
                  <p className="text-lg text-blue-700 mt-1">
                    {group.groupPurpose}
                  </p>
                </div>
                <span className="text-3xl text-blue-800">
                  {expandedGroup === group._id ? "−" : "+"}
                </span>
              </button>

              {/* Expanded Content */}
              {expandedGroup === group._id && (
                <div className="px-6 py-6">
                  {/* Duration & Members */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-lg text-gray-700">
                        <span className="font-semibold">Duration:</span>{" "}
                        {new Date(group.groupDuration.from).toLocaleDateString()} –{" "}
                        {new Date(group.groupDuration.to).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-lg text-gray-700">
                        <span className="font-semibold">Members:</span>{" "}
                        {group.requestedBy
                          .map((u) => `${u.name} (${u.email})`)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      Documents
                    </h3>
                    {group.documents.length > 0 ? (
                      <ul className="space-y-4">
                        {group.documents.map((doc) => (
                          <li
                            key={doc._id}
                            className="bg-gray-50 hover:bg-gray-100 transition rounded-md p-4 flex flex-col md:flex-row md:justify-between md:items-center"
                          >
                            <div className="flex-1">
                              <a
                                href={`${apiUrl}${doc.url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl text-blue-600 hover:underline font-medium"
                              >
                                {doc.filename}
                              </a>
                              <p className="text-sm text-gray-500 mt-1">
                                Uploaded by {doc.uploadedBy.name} ({doc.uploadedBy.email})
                              </p>
                            </div>

                            {/* Rename & Delete */}
                            <div className="mt-4 md:mt-0 flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="New filename"
                                value={renaming[doc._id] || ""}
                                onChange={(e) =>
                                  setRenaming((prev) => ({
                                    ...prev,
                                    [doc._id]: e.target.value,
                                  }))
                                }
                                className="p-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                              <button
                                onClick={() => handleRename(group._id, doc._id)}
                                disabled={processingRename === doc._id}
                                className={`px-4 py-1 rounded-md text-white text-base ${
                                  processingRename === doc._id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                }`}
                              >
                                {processingRename === doc._id ? "Renaming…" : "Rename"}
                              </button>
                              <button
                                onClick={() => handleDelete(group._id, doc._id)}
                                disabled={deleting === doc._id}
                                className={`px-4 py-1 rounded-md text-white text-base ${
                                  deleting === doc._id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-700"
                                }`}
                              >
                                {deleting === doc._id ? "Deleting…" : "Delete"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base text-gray-500">No documents uploaded yet.</p>
                    )}
                  </div>

                  {/* Upload Form */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      Upload a New Document
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                      <input
                        type="file"
                        accept="*"
                        onChange={(e) => handleFileChange(e, group._id)}
                        className="block w-full sm:w-auto text-base text-gray-700 border border-gray-300 rounded-md
                                   file:mr-2 file:py-2 file:px-3
                                   file:rounded-md file:border-0
                                   file:text-base file:font-medium
                                   file:bg-blue-50 file:text-blue-700
                                   hover:file:bg-blue-100 focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpload(group._id)}
                        disabled={uploading === group._id || !fileInputs[group._id]}
                        className={`w-full sm:w-auto px-6 py-2 rounded-md text-white text-base ${
                          uploading === group._id || !fileInputs[group._id]
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {uploading === group._id ? "Uploading…" : "Upload"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserCloseGroupDocs;
