import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AssistantDirectorManager({ groupId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    _id: null,
    user: "",
    name: "",
    designation: "Assistant Director",
    from: "",
    to: "",
    about: "",
    imageFile: null,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [groupId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/groups/${groupId}`);
      const group = res.data;
      setHistory(
        Array.isArray(group.assistantDirectorHistory)
          ? group.assistantDirectorHistory
          : []
      );
      setError(null);
    } catch (err) {
      setError("Failed to load assistant director history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      user: "",
      name: "",
      designation: "Assistant Director",
      from: "",
      to: "",
      about: "",
      imageFile: null,
    });
    setEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      if (formData.user) data.append("user", formData.user);
      if (formData.name) data.append("name", formData.name);
      data.append("designation", formData.designation);
      data.append("from", formData.from);
      if (formData.to) data.append("to", formData.to);
      if (formData.about) data.append("about", formData.about);
      if (formData.imageFile) data.append("image", formData.imageFile);

      if (editing) {
        await axios.put(
          `${apiUrl}/api/groups/${groupId}/assistant-director-history/${formData._id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          `${apiUrl}/api/groups/${groupId}/assistant-director-history`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      resetForm();
      fetchHistory();
    } catch (err) {
      alert("Failed to save assistant director history.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(
        `${apiUrl}/api/groups/${groupId}/assistant-director-history/${id}`
      );
      alert("Assistant director entry deleted successfully.");
      fetchHistory();
    } catch (err) {
      alert("Failed to delete assistant director history.");
      console.error(err);
    }
  };

  const startEditing = (entry) => {
    setFormData({
      _id: entry._id,
      user: entry.user?._id || "",
      name: entry.name || "",
      designation: entry.designation || "Assistant Director",
      from: entry.from ? new Date(entry.from).toISOString().slice(0, 10) : "",
      to: entry.to ? new Date(entry.to).toISOString().slice(0, 10) : "",
      about: entry.about || "",
      imageFile: null,
    });
    setEditing(true);
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Assistant Director History Management
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 30,
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 6,
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3>
          {editing ? "Edit Assistant Director" : "Add New Assistant Director"}
        </h3>

        <div style={{ marginBottom: 12 }}>
          <label>User ID (optional):</label>
          <input
            type="text"
            name="user"
            value={formData.user}
            onChange={handleChange}
            placeholder="Mongo User ID (if existing user)"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Name (if no User ID):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name of the Assistant Director"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Designation:</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Designation"
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label>From:</label>
            <input
              type="date"
              name="from"
              value={formData.from}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>To (leave blank if current):</label>
            <input
              type="date"
              name="to"
              value={formData.to}
              onChange={handleChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>About:</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Upload Image:</label>
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              style={{
                flex: 1,
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <h3>Existing Assistant Directors</h3>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && history.length === 0 && (
        <p>No assistant director history found.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {history.map((item) => (
          <li
            key={item._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 15,
              marginBottom: 15,
              display: "flex",
              gap: 15,
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
            <img
              src={item.image || "https://via.placeholder.com/80"}
              alt={item.name}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 6px" }}>{item.name || "Unnamed"}</h4>
              <p style={{ margin: "2px 0" }}>
                <strong>Designation:</strong> {item.designation}
              </p>
              <p style={{ margin: "2px 0" }}>
                <strong>From:</strong>{" "}
                {new Date(item.from).toLocaleDateString()} <strong>To:</strong>{" "}
                {item.to ? new Date(item.to).toLocaleDateString() : "Present"}
              </p>
              <p style={{ marginTop: 8 }}>{item.about}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => startEditing(item)}
                style={{
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AssistantDirectorManager;
