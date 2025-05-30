import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AssistantDirectorManager({ groupId }) {
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    _id: null,
    user: "",         // selected user ID
    name: "",         // manual name if no user selected
    designation: "Assistant Director",
    from: "",
    to: "",
    about: "",
    imageFile: null,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, [groupId]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed loading users", err);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: group } = await axios.get(`${apiUrl}/api/groups/${groupId}`);
      setHistory(Array.isArray(group.assistantDirectorHistory)
        ? group.assistantDirectorHistory
        : []);
      setError(null);
    } catch {
      setError("Failed to load history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData(prev => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async e => {
    e.preventDefault();
    // Validation: either user or manual name
    if (!formData.user && !formData.name.trim()) {
      alert("Please select a user or enter a name.");
      return;
    }
    try {
      const data = new FormData();
      if (formData.user) {
        data.append("user", formData.user);
      } else {
        data.append("name", formData.name);
      }
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
      alert("Failed to save.");
      console.error(err);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await axios.delete(
        `${apiUrl}/api/groups/${groupId}/assistant-director-history/${id}`
      );
      alert("Deleted successfully.");
      fetchHistory();
    } catch {
      alert("Delete failed.");
    }
  };

  const startEditing = entry => {
    setFormData({
      _id: entry._id,
      user: entry.user?._id || "",
      name: entry.user ? "" : entry.name || "",
      designation: entry.designation,
      from: entry.from?.slice(0,10) || "",
      to: entry.to?.slice(0,10) || "",
      about: entry.about || "",
      imageFile: null,
    });
    setEditing(true);
  };

  return (
    <div style={{  margin:"auto", padding:20, fontFamily:"Arial" }}>
      <h2 style={{ textAlign:"center" }}>Associate Director Management</h2>

      <form onSubmit={handleSubmit}
            style={{ marginBottom:30, padding:20, border:"1px solid #ddd", borderRadius:6, backgroundColor:"#f9f9f9" }}>
        <h3>{editing ? "Edit" : "Add New"}</h3>

        {/* User dropdown */}
        <div style={{ marginBottom:12 }}>
          <label>Select User (or leave blank to enter name):</label>
          <select name="user" value={formData.user} onChange={handleChange}
                  style={{ width:"100%", padding:8, marginTop:4 }}>
            <option value="">-- None --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Manual name when no user */}
        {!formData.user && (
          <div style={{ marginBottom:12 }}>
            <label>Manual Name:</label>
            <input type="text" name="name" value={formData.name}
                   onChange={handleChange} placeholder="Assistant Director Name"
                   style={{ width:"100%", padding:8, marginTop:4 }} required />
          </div>
        )}

        {/* Designation */}
        <div style={{ marginBottom:12 }}>
          <label>Designation:</label>
          <input type="text" name="designation" value={formData.designation}
                 onChange={handleChange}
                 style={{ width:"100%", padding:8, marginTop:4 }} />
        </div>

        {/* Dates */}
        <div style={{ display:"flex", gap:12, marginBottom:12 }}>
          <div style={{ flex:1 }}>
            <label>From:</label>
            <input type="date" name="from" value={formData.from}
                   onChange={handleChange} required
                   style={{ width:"100%", padding:8, marginTop:4 }} />
          </div>
          <div style={{ flex:1 }}>
            <label>To (blank if current):</label>
            <input type="date" name="to" value={formData.to}
                   onChange={handleChange}
                   style={{ width:"100%", padding:8, marginTop:4 }} />
          </div>
        </div>

        {/* About */}
        <div style={{ marginBottom:12 }}>
          <label>About:</label>
          <textarea name="about" value={formData.about}
                    onChange={handleChange} rows={3}
                    style={{ width:"100%", padding:8, marginTop:4 }} />
        </div>

        {/* Image */}
        <div style={{ marginBottom:12 }}>
          <label>Upload Image:</label>
          <input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
        </div>

        {/* Submit */}
        <div style={{ display:"flex", gap:12 }}>
          <button type="submit"
                  style={{ flex:1, padding:"10px 20px", backgroundColor:"#4CAF50", color:"white", border:"none", borderRadius:4 }}>
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button type="button" onClick={resetForm}
                    style={{ flex:1, padding:"10px 20px", backgroundColor:"#f44336", color:"white", border:"none", borderRadius:4 }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr />

      <h3>Existing Entries</h3>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:"red"}}>{error}</p>}
      {!loading && history.length === 0 && <p>No entries found.</p>}

      <ul style={{ listStyle:"none", padding:0 }}>
        {history.map(entry => (
          <li key={entry._id}
              style={{ border:"1px solid #ddd", borderRadius:6, padding:15, marginBottom:15, display:"flex", gap:15 }}>
            {/* <img src={entry.image || "/default-user.png"} alt=""
                 style={{ width:80, height:80, borderRadius:"50%", objectFit:"cover" }} /> */}
            <div style={{ flex:1 }}>
              <h4>{entry.user?.name || entry.name || "Unnamed"}</h4>
              <p><strong>Designation:</strong> {entry.designation}</p>
              <p><strong>From:</strong> {new Date(entry.from).toLocaleDateString()} 
                 <strong> To:</strong> {entry.to ? new Date(entry.to).toLocaleDateString() : "Present"}</p>
              <p>{entry.about}</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={() => startEditing(entry)}
                      style={{ backgroundColor:"#2196F3", color:"white", border:"none", padding:"6px 12px", borderRadius:4 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(entry._id)}
                      style={{ backgroundColor:"#f44336", color:"white", border:"none", padding:"6px 12px", borderRadius:4 }}>
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
