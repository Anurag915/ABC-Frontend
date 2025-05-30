import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ManageGroupNoticeCircular({ groupId }) {
  const [tab, setTab] = useState("notices");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ _id: null, name: "", description: "", file: null });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    resetForm();
    fetchItems();
  }, [groupId, tab]);

  const authHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: group } = await axios.get(
        `${apiUrl}/api/groups/${groupId}`,
        { headers: authHeader() }
      );
      setItems(group[tab] || []);
    } catch {
      setError("Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const resetForm = () => {
    setForm({ _id: null, name: "", description: "", file: null });
    setEditing(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || (!editing && !form.file)) {
      setError("All fields are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    if (form.file) data.append("file", form.file);

    const base = `${apiUrl}/api/groups/${groupId}/${tab}`;
    try {
      if (editing) {
        await axios.put(
          `${base}/${form._id}`,
          data,
          { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          base,
          data,
          { headers: { ...authHeader(), "Content-Type": "multipart/form-data" } }
        );
      }
      resetForm();
      fetchItems();
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setForm({ _id: item._id, name: item.name, description: item.description, file: null });
    setEditing(true);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    setSubmitting(true);
    setError("");
    try {
      await axios.delete(
        `${apiUrl}/api/groups/${groupId}/${tab}/${id}`,
        { headers: authHeader() }
      );
      fetchItems();
    } catch {
      setError("Delete failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage {tab === "notices" ? "Notices" : "Circulars"}</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {["notices", "circulars"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            disabled={submitting}
            className={`px-5 py-2 font-semibold transition-all border-b-2 ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-400"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 border"
      >
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">{editing ? "Edit" : "Add New"} {tab.slice(0, -1)}</h2>
        </div>
        {error && (
          <div className="col-span-2 text-red-600 font-medium">{error}</div>
        )}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            placeholder="Enter title"
            required
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-md px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            placeholder="Enter description"
            required
            disabled={submitting}
          />
        </div>
        <div className="col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">File</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!editing}
            disabled={submitting}
          />
        </div>
        <div className="col-span-2 flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item._id} className="bg-white border p-5 rounded-xl shadow hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                <div className="flex flex-col space-y-2 items-end md:items-center md:flex-row md:space-x-2 md:space-y-0">
                  <a
                    href={`${apiUrl}${item.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleEdit(item)}
                    disabled={submitting}
                    className="px-4 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={submitting}
                    className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
