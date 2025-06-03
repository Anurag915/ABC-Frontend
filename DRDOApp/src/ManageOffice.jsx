import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ManageOffice({ groupId }) {
  const [group, setGroup] = useState(null);
  const [form, setForm] = useState({ name: "", designation: "", contactNumber: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    const res = await fetch(`${apiUrl}/api/groups/id/${groupId}`);
    const data = await res.json();
    setGroup(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId
      ? `${apiUrl}/api/groups/${groupId}/office/${editingId}`
      : `${apiUrl}/api/groups/${groupId}/office`;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", designation: "", contactNumber: "", email: "" });
    setEditingId(null);
    setLoading(false);
    fetchGroup();
  };

  const handleEdit = (office) => {
    setForm(office);
    setEditingId(office._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this office member?")) {
      await fetch(`${apiUrl}/api/groups/${groupId}/office/${id}`, { method: "DELETE" });
      fetchGroup();
    }
  };

  if (!group) return <div className="text-center py-4">Loading group info...</div>;

  return (
    <div className=" mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Manage Office of Group</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Designation"
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="contactNumber"
          value={form.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {editingId ? "Update" : "Add"} Office Member
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", designation: "", contactNumber: "", email: "" });
              setEditingId(null);
            }}
            className="ml-2 text-gray-500 hover:underline"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      <div className="space-y-4">
        {group.officeOfGroup?.map((office) => (
          <div
            key={office._id}
            className="border p-4 rounded flex justify-between items-start bg-gray-50"
          >
            <div>
              <p className="font-semibold">{office.name}</p>
              <p>{office.designation}</p>
              {office.contactNumber && <p>📞 {office.contactNumber}</p>}
              {office.email && <p>📧 {office.email}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(office)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(office._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageOffice;
