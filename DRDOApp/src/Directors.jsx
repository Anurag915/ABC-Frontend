import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Directors = ({ labId }) => {
  const [directors, setDirectors] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    user: "",
    name: "",
    about: "",
    designation: "",
    image: "",
    from: "",
    to: "",
  });
  const [editMode, setEditMode] = useState(null);
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchDirectors = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/labs/${labId}`, { headers });
      setDirectors(res.data.directorHistory || []);
    } catch (err) {
      console.error("Error fetching directors", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/users`, { headers });
      setUsers(res.data.filter((u) => u.role === "employee"));
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchDirectors();
    fetchUsers();
  }, []);

  const handleDelete = async (directorId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this director?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${apiUrl}/api/labs/${labId}/directors/${directorId}`,
        { headers }
      );
      fetchDirectors();
    } catch (err) {
      console.error("Error deleting director", err);
    }
  };

  const handleEdit = (dir) => {
    setEditMode(dir._id);
    setForm({
      user: dir.user?._id || "",
      name: dir.name || "",
      designation: dir.designation || "",
      image: dir.image || "",
      about: dir.about || (dir.user?.about ?? ""),
      from: dir.from ? dir.from.split("T")[0] : "",
      to: dir.to ? dir.to.split("T")[0] : "",
    });
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    const selectedUser = users.find((u) => u._id === userId);
    setForm({
      ...form,
      user: userId,
      name: selectedUser?.name || "",
      about: selectedUser?.about || "", // 👈 Pre-fill if exists
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(
          `${apiUrl}/api/labs/${labId}/directors/${editMode}`,
          form,
          { headers }
        );
      } else {
        await axios.post(`${apiUrl}/api/labs/${labId}/directors`, form, {
          headers,
        });
      }
      setForm({
        user: "",
        name: "",
        designation: "",
        image: "",
        from: "",
        to: "",
      });
      setEditMode(null);
      fetchDirectors();
    } catch (err) {
      console.error("Error submitting director", err);
    }
  };

  const setAsCurrentDirector = async (dir) => {
    try {
      const current = directors.find((d) => !d.to);
      if (current && current._id !== dir._id) {
        await axios.put(
          `${apiUrl}/api/labs/${labId}/directors/${current._id}`,
          {
            ...current,
            to: dir.from,
          },
          { headers }
        );
      }
      await axios.put(
        `${apiUrl}/api/labs/${labId}/directors/${dir._id}`,
        {
          ...dir,
          to: null,
        },
        { headers }
      );
      alert(`${dir.name} is now set as the current director.`);
      fetchDirectors();
    } catch (err) {
      console.error("Error setting current director", err);
      alert("Failed to set current director.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Director History</h2>
      <ul className="mb-6">
        {directors.map((dir) => (
          <li key={dir._id} className="mb-3 border p-3 rounded shadow">
            <p>
              <strong>From:</strong> {new Date(dir.from).toLocaleDateString()}{" "}
              <strong>To:</strong>{" "}
              {dir.to ? new Date(dir.to).toLocaleDateString() : "Present"}
            </p>
            {dir.user ? (
              <p>
                <strong>User:</strong> {dir.user.name} ({dir.user.email})
              </p>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {dir.name}
                </p>
                <p>
                  <strong>Designation:</strong> {dir.designation}
                </p>
              </>
            )}
            {dir.image && (
              <img src={dir.image} alt="Director" className="w-24 mt-1" />
            )}
            <div className="mt-2 flex gap-2 flex-wrap">
              <button
                onClick={() => handleEdit(dir)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(dir._id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
              {dir.to ? (
                <button
                  onClick={() => setAsCurrentDirector(dir)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Set as Current Director
                </button>
              ) : (
                <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded">
                  Current Director
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-medium mb-2">
        {editMode ? "Edit Director" : "Add New Director"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
        <select
          value={form.user}
          onChange={handleUserChange}
          className="w-full border p-2"
        >
          <option value="">Select Registered User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="text"
          placeholder="Designation"
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          className="w-full border p-2"
          required
        />
        <textarea
          placeholder="About"
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
          className="w-full border p-2"
          rows={4}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border p-2"
        />
        <input
          type="date"
          value={form.from}
          onChange={(e) => setForm({ ...form, from: e.target.value })}
          className="w-full border p-2"
          required
        />
        <input
          type="date"
          value={form.to}
          onChange={(e) => setForm({ ...form, to: e.target.value })}
          className="w-full border p-2"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {editMode ? "Update" : "Add"}
        </button>
      </form>
    </div>
  );
};

export default Directors;
