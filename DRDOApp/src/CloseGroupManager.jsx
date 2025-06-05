import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CloseGroupManager = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    groupName: "",
    groupPurpose: "",
    groupDuration: { from: "", to: "" },
    requestedBy: [],
    adminRemarks: "",
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${apiUrl}/admin/close-group`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "from" || name === "to") {
      setForm({
        ...form,
        groupDuration: {
          ...form.groupDuration,
          [name]: value,
        },
      });
    } else if (name === "requestedBy") {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
      setForm({ ...form, requestedBy: selectedOptions });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        groupDuration: {
          from: new Date(form.groupDuration.from),
          to: new Date(form.groupDuration.to),
        },
      };

      if (editId) {
        await axios.put(`${apiUrl}/admin/close-group/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${apiUrl}/admin/close-group`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setForm({
        groupName: "",
        groupPurpose: "",
        groupDuration: { from: "", to: "" },
        requestedBy: [],
        adminRemarks: "",
      });
      setEditId(null);
      fetchGroups();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (group) => {
    setForm({
      groupName: group.groupName,
      groupPurpose: group.groupPurpose,
      groupDuration: {
        from: group.groupDuration?.from?.slice(0, 10),
        to: group.groupDuration?.to?.slice(0, 10),
      },
      requestedBy: group.requestedBy.map((u) => u._id),
      adminRemarks: group.adminRemarks,
    });
    setEditId(group._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await axios.delete(`${apiUrl}/admin/close-group/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6 mt-20 mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Manage Close Groups
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-200"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col">
            <label htmlFor="groupName" className="text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              id="groupName"
              name="groupName"
              placeholder="Enter group name"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.groupName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="groupPurpose" className="text-sm font-medium text-gray-700 mb-1">
              Group Purpose
            </label>
            <input
              id="groupPurpose"
              name="groupPurpose"
              placeholder="Enter group purpose"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.groupPurpose}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="from" className="text-sm font-medium text-gray-700 mb-1">
              Duration From
            </label>
            <input
              id="from"
              type="date"
              name="from"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.groupDuration.from}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="to" className="text-sm font-medium text-gray-700 mb-1">
              Duration To
            </label>
            <input
              id="to"
              type="date"
              name="to"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.groupDuration.to}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="requestedBy" className="text-sm font-medium text-gray-700 mb-1 block">
            Requested By (select one or more)
          </label>
          <select
            id="requestedBy"
            name="requestedBy"
            multiple
            value={form.requestedBy}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email} ({user.name})
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <label htmlFor="adminRemarks" className="text-sm font-medium text-gray-700 mb-1 block">
            Admin Remarks
          </label>
          <textarea
            id="adminRemarks"
            name="adminRemarks"
            placeholder="Any remarks..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={form.adminRemarks}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            {editId ? "Update Group" : "Create Group"}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Group Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Purpose</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Duration</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Requested By</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {groups.map((group, idx) => (
              <tr
                key={group._id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3 text-sm text-gray-800">{group.groupName}</td>
                <td className="px-4 py-3 text-sm text-gray-800">{group.groupPurpose}</td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {new Date(group.groupDuration?.from).toLocaleDateString()} –{" "}
                  {new Date(group.groupDuration?.to).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {group.requestedBy.map((u) => u.email).join(", ")}
                </td>
                <td className="px-4 py-3 text-sm space-x-4">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {groups.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-5 text-center text-gray-500">
                  No groups found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CloseGroupManager;
