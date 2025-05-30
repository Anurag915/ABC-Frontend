import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
const GroupFileManager = ({ groupId, field }) => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "", file: null });
  const [editingItemId, setEditingItemId] = useState(null);
  const baseURL = `${apiUrl}/api/group-files/${groupId}/${field}`;

  useEffect(() => {
    fetchItems();
  }, [groupId, field]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(baseURL);
      setItems(res.data);
    } catch (err) {
      alert("Failed to fetch items");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || (!formData.file && !editingItemId)) {
      return alert("All fields required");
    }

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("description", formData.description);
    if (formData.file) uploadData.append("file", formData.file);

    try {
      if (editingItemId) {
        await axios.put(`${baseURL}/${editingItemId}`, uploadData);
        setEditingItemId(null);
      } else {
        await axios.post(baseURL, uploadData);
      }
      setFormData({ name: "", description: "", file: null });
      fetchItems();
    } catch (err) {
      alert("Upload/update failed");
    }
  };

  const handleEdit = (item) => {
    setEditingItemId(item._id);
    setFormData({
      name: item.name,
      description: item.description,
      file: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await axios.delete(`${baseURL}/${id}`);
      fetchItems();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold capitalize mb-4">{field} Manager</h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded w-full"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 rounded w-full"
        ></textarea>
        <input
          name="file"
          type="file"
          accept=".pdf,.ppt,.pptx,.xls,.xlsx,video/*"
          onChange={handleChange}
          className="w-full"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">
          {editingItemId ? "Update" : "Upload"}
        </button>
      </form>

      <div>
        {items.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item._id} className="border p-4 rounded flex justify-between items-start">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-700">{item.description}</p>
                  <a
                    href={`http://localhost:5000${item.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm"
                  >
                    View File
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-yellow-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupFileManager;
