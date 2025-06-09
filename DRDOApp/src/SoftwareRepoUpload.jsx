import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance"; // Adjust path as needed

const SoftwareRepoUpload = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    group: "",
    type: "",
    metadata: "",
    githubUrl: "",
    clonedRepoPath: "",
    file: null,
  });

  const fetchGroups = async () => {
    try {
      const res = await axiosInstance.get("/api/groups");
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch groups", err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("group", formData.group);
      payload.append("type", formData.type);
      payload.append("githubUrl", formData.githubUrl);
      payload.append("clonedRepoPath", formData.clonedRepoPath);
      if (formData.metadata) payload.append("metadata", formData.metadata);
      if (formData.file) payload.append("file", formData.file);

      await axiosInstance.post("/api/softwareRepo", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        group: "",
        type: "",
        metadata: "",
        githubUrl: "",
        clonedRepoPath: "",
        file: null,
      });

      alert("Upload successful!");
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload Software Repository</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <select
          name="group"
          value={formData.group}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="">Select Group</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        >
          <option value="">Select Type</option>
          <option value="Document">Document</option>
          <option value="Code">Code</option>
          <option value="ZIP">ZIP File</option>
        </select>

        <input
          type="text"
          name="githubUrl"
          placeholder="GitHub URL (optional)"
          value={formData.githubUrl}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="clonedRepoPath"
          placeholder="Cloned Repo Path (optional)"
          value={formData.clonedRepoPath}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />

        <textarea
          name="metadata"
          placeholder='Optional metadata in JSON. Example: {"sizeInKB": 1200, "languageUsed": ["Python", "C++"]}'
          value={formData.metadata}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded p-2"
        />

        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default SoftwareRepoUpload;
