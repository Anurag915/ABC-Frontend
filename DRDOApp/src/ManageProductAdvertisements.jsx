import React, { useState, useEffect } from "react";
import axios from "axios";

// const labId = "68315940ee72c6f60d068909";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = localStorage.getItem("token"); // or your storage key
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

const ManageProductAdvertisements = ({labId}) => {
  const [activeTab, setActiveTab] = useState("products");
  const [data, setData] = useState({ products: [], advertisements: [] });
  const [form, setForm] = useState({ name: "", description: "", file: null });
  const [editId, setEditId] = useState(null);

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/labs/${labId}`, axiosConfig);
      setData({
        products: res.data.products || [],
        advertisements: res.data.advertisements || [],
      });
    } catch (err) {
      console.error("Fetching error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [labId]);

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setForm({ ...form, file: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("file", form.file);

    const endpoint = `${apiUrl}/api/labs/${labId}/${activeTab}`;
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        await axios.put(`${endpoint}/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(endpoint, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setForm({ name: "", description: "", file: null });
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, file: null });
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${apiUrl}/api/labs/${labId}/${activeTab}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchData();
    } catch (err) {
      console.error("Deletion error:", err);
    }
  };

  const items = data[activeTab];

  return (
    <div className="p-4 font-sans" style={{ backgroundColor: "#fff8e1", minHeight: "100vh" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#ff6f00" }}>
        Manage Products & Achievements
      </h2>

      <div className="flex space-x-4 mb-4">
        {["products", "advertisements"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setForm({ name: "", description: "", file: null });
              setEditId(null);
            }}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: activeTab === tab ? "#ffb300" : "#ffe082",
              color: activeTab === tab ? "white" : "#5d4037",
              fontWeight: activeTab === tab ? "600" : "normal",
              border: "none",
              cursor: "pointer",
              boxShadow: activeTab === tab
                ? "0 2px 8px rgba(255, 179, 0, 0.6)"
                : "none",
              transition: "background-color 0.3s",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{
            border: "1px solid #ffb300",
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
          }}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{
            border: "1px solid #ffb300",
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
          }}
        />
        <input
          type="file"
          name="file"
          onChange={handleChange}
          accept="application/pdf,image/*"
          style={{
            border: "1px solid #ffb300",
            padding: "8px",
            width: "100%",
            borderRadius: "4px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#ff6f00",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {editId ? "Update" : "Add"} {activeTab.slice(0, -1)}
        </button>
      </form>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              border: "1px solid #ffcc80",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(255, 183, 77, 0.3)",
              backgroundColor: "#fff3e0",
            }}
          >
            <h3 style={{ fontWeight: "600", color: "#bf360c" }}>{item.name}</h3>
            <p style={{ color: "#6d4c41" }}>{item.description}</p>
            {item.fileUrl && (
              <a
                href={`${apiUrl}${item.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ff6f00", textDecoration: "underline" }}
              >
                View File
              </a>
            )}
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => handleEdit(item)}
                style={{
                  backgroundColor: "#ffa000",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  marginRight: 10,
                  fontWeight: "bold",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  backgroundColor: "#d84315",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
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
};

export default ManageProductAdvertisements;
