import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

const styles = {
  card: {
    border: "1px solid #d39e00",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 5px rgba(211,158,0,0.3)",
    backgroundColor: "#fff8e1",
    maxWidth: "400px",
    position: "relative",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "flex-start",
  },
  title: {
    marginBottom: "12px",
    borderBottom: "2px solid #ffb300", // amber darken-1
    paddingBottom: "4px",
    color: "#ffb300",
  },
  button: {
    marginRight: "8px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  updateBtn: {
    backgroundColor: "#ffb300",
    color: "white",
  },
  deleteBtn: {
    backgroundColor: "#ff6f00", // amber darken-3
    color: "white",
  },
  saveBtn: {
    backgroundColor: "#ffca28", // amber lighten-1
    color: "black",
  },
  cancelBtn: {
    backgroundColor: "#ffcc80", // amber lighten-3
    color: "black",
  },
  form: {
    marginBottom: "20px",
    padding: "16px",
    border: "1px solid #ffd54f",
    borderRadius: "8px",
    backgroundColor: "#fff8e1",
  },
};

// const LAB_ID = "68315940ee72c6f60d068909";

function ManageNoticesCirculars({labId}) {
  const [labData, setLabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState({ type: null, id: null });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });
  const [newNotice, setNewNotice] = useState({
    name: "",
    description: "",
    file: null,
  });
  const [newCircular, setNewCircular] = useState({
    name: "",
    description: "",
    file: null,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/labs/${labId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLabData(response.data);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (type, item) => {
    setEditing({ type, id: item._id });
    setFormData({ name: item.name, description: item.description, file: item.fileUrl });
  };

  const handleCancel = () => {
    setEditing({ type: null, id: null });
    setFormData({ name: "", description: "", file: null });
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${apiUrl}/api/labs/${labId}/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchLabData();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleInputChange = (e, isNew = false, type = "notice") => {
    const { name, value, files } = e.target;
    const update = (prev) => ({ ...prev, [name]: files ? files[0] : value });

    if (isNew) {
      type === "notice" ? setNewNotice(update) : setNewCircular(update);
    } else {
      setFormData(update);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const { type, id } = editing;
    const url = `${apiUrl}/api/labs/${labId}/${type}/${id}`;
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (formData.file) data.append("file", formData.file);

    try {
      await axios.put(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      handleCancel();
      fetchLabData();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleCreateSubmit = async (e, type) => {
    e.preventDefault();
    const newData = type === "notice" ? newNotice : newCircular;

    if (!newData.name || !newData.description || !newData.file) {
      alert("All fields are required.");
      return;
    }

    const form = new FormData();
    form.append("name", newData.name);
    form.append("description", newData.description);
    form.append("file", newData.file);

    try {
      await axios.post(
        `${apiUrl}/api/labs/${labId}/${
          type === "notice" ? "notices" : "circulars"
        }`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      type === "notice"
        ? setNewNotice({ name: "", description: "", file: null })
        : setNewCircular({ name: "", description: "", file: null });
      fetchLabData();
    } catch (err) {
      alert("Creation failed: " + (err.response?.data?.error || err.message));
    }
  };

  const renderCard = (item, type) => {
    const isEditing = editing.type === type && editing.id === item._id;
    return (
      <div key={item._id} style={styles.card}>
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <input
              type="file"
              name="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleInputChange}
            />
            <br />
            <button
              type="submit"
              style={{ ...styles.button, ...styles.saveBtn }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              style={{ ...styles.button, ...styles.cancelBtn }}
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            {item.fileUrl && (
              <a
                href={
                  item.fileUrl.startsWith("http")
                    ? item.fileUrl
                    : `${apiUrl}${item.fileUrl}`
                }
                target="_blank"
                rel="noreferrer"
                style={{ color: "#ffb300" }}
              >
                View Document
              </a>
            )}
            <div style={{ marginTop: "12px" }}>
              <button
                onClick={() => handleEditClick(type, item)}
                style={{ ...styles.button, ...styles.updateBtn }}
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(type, item._id)}
                style={{ ...styles.button, ...styles.deleteBtn }}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const notices = labData?.notices || [];
  const circulars = labData?.circulars || [];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={styles.title}>Add New Notice</h2>
      <form
        onSubmit={(e) => handleCreateSubmit(e, "notice")}
        style={styles.form}
      >
        <input
          type="text"
          name="name"
          value={newNotice.name}
          onChange={(e) => handleInputChange(e, true, "notice")}
          required
          placeholder="Name"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <textarea
          name="description"
          value={newNotice.description}
          onChange={(e) => handleInputChange(e, true, "notice")}
          required
          placeholder="Description"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <input
          type="file"
          name="file"
          onChange={(e) => handleInputChange(e, true, "notice")}
          required
        />
        <br />
        <button type="submit" style={{ ...styles.button, ...styles.saveBtn }}>
          Add Notice
        </button>
      </form>

      <h2 style={styles.title}>Notices</h2>
      {notices.length === 0 ? (
        <p>No notices available.</p>
      ) : (
        <div style={styles.container}>
          {notices.map((n) => renderCard(n, "notices"))}
        </div>
      )}

      <h2 style={{ ...styles.title, marginTop: "40px" }}>Add New Circular</h2>
      <form
        onSubmit={(e) => handleCreateSubmit(e, "circular")}
        style={styles.form}
      >
        <input
          type="text"
          name="name"
          value={newCircular.name}
          onChange={(e) => handleInputChange(e, true, "circular")}
          required
          placeholder="Name"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <textarea
          name="description"
          value={newCircular.description}
          onChange={(e) => handleInputChange(e, true, "circular")}
          required
          placeholder="Description"
          style={{ width: "100%", marginBottom: "8px" }}
        />
        <input
          type="file"
          name="file"
          onChange={(e) => handleInputChange(e, true, "circular")}
          required
        />
        <br />
        <button type="submit" style={{ ...styles.button, ...styles.saveBtn }}>
          Add Circular
        </button>
      </form>

      <h2 style={styles.title}>Circulars</h2>
      {circulars.length === 0 ? (
        <p>No circulars available.</p>
      ) : (
        <div style={styles.container}>
          {circulars.map((c) => renderCard(c, "circulars"))}
        </div>
      )}
    </div>
  );
}

export default ManageNoticesCirculars;
