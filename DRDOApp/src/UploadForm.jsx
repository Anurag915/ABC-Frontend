// UploadForm.jsx
import React, { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const UploadForm = ({ groupId }) => {
  const [type, setType] = useState("project");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("name", name);
    formData.append("description", description);

    try {
      const res = await axios.post(
        `${apiUrl}/api/groups/${groupId}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Upload successful");
      console.log(res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border shadow space-y-4"
    >
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full p-2 border"
      >
        <option value="project">Project</option>
        <option value="patent">Patent</option>
        <option value="technology">Technology</option>
        <option value="publication">Publication</option>
        <option value="course">Course</option>
      </select>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border"
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full"
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload
      </button>
    </form>
  );
};

export default UploadForm;
