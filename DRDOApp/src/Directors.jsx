// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const Directors = ({ labId }) => {
//   const [directors, setDirectors] = useState([]);
//   const [currentDirector, setCurrentDirector] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [form, setForm] = useState({
//     user: "",
//     name: "",
//     about: "",
//     designation: "",
//     image: "",
//     from: "",
//     to: "",
//   });
//   const [editMode, setEditMode] = useState(null);
//   const token = localStorage.getItem("token");
//   const headers = { Authorization: `Bearer ${token}` };

//   const fetchDirectors = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/api/labs/${labId}`, { headers });
//       setDirectors(res.data.directorHistory || []);
//       setCurrentDirector(res.data.currentDirector || null);
//     } catch (err) {
//       console.error("Error fetching directors", err);
//     }
//   };

//   // const fetchUsers = async () => {
//   //   try {
//   //     const res = await axios.get(`${apiUrl}/api/users`, { headers });
//   //     setUsers(res.data.filter((u) => u.role === "employee"));
//   //   } catch (err) {
//   //     console.error("Error fetching users", err);
//   //   }
//   // };

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/api/users`, { headers });
//       const employees = res.data.filter((u) => u.role === "employee" || u.role === "director");
//       console.log("Fetched employees:", employees);
//       setUsers(employees);
//     } catch (err) {
//       console.error("Error fetching users", err);
//     }
//   };

//   useEffect(() => {
//     fetchDirectors();
//     fetchUsers();
//   }, []);

//   const handleDelete = async (directorId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this director?"
//     );
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(
//         `${apiUrl}/api/labs/${labId}/directors/${directorId}`,
//         { headers }
//       );
//       fetchDirectors();
//     } catch (err) {
//       console.error("Error deleting director", err);
//     }
//   };

//   const handleEdit = (dir) => {
//     setEditMode(dir._id);
//     setForm({
//       user: dir.user?._id || "",
//       name: dir.name || "",
//       designation: dir.designation || "",
//       image: dir.image || "",
//       about: dir.about || (dir.user?.about ?? ""),
//       from: dir.from ? dir.from.split("T")[0] : "",
//       to: dir.to ? dir.to.split("T")[0] : "",
//     });
//   };

//   const handleUserChange = (e) => {
//     const userId = e.target.value;
//     const selectedUser = users.find((u) => u._id === userId);
//     setForm({
//       ...form,
//       user: userId,
//       name: selectedUser?.name || "",
//       about: selectedUser?.about || "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...form,
//         to: form.to === "" ? null : form.to,
//       };

//       if (editMode) {
//         await axios.put(
//           `${apiUrl}/api/labs/${labId}/directors/${editMode}`,
//           payload,
//           { headers }
//         );
//       } else {
//         await axios.post(`${apiUrl}/api/labs/${labId}/directors`, payload, {
//           headers,
//         });
//       }

//       setForm({
//         user: "",
//         name: "",
//         designation: "",
//         image: "",
//         about: "",
//         from: "",
//         to: "",
//       });
//       setEditMode(null);
//       fetchDirectors();
//     } catch (err) {
//       console.error("Error submitting director", err);
//     }
//   };

//   const setAsCurrentDirector = async (dir) => {
//     try {
//       const current = directors.find((d) => !d.to);
//       if (current && current._id !== dir._id) {
//         await axios.put(
//           `${apiUrl}/api/labs/${labId}/directors/${current._id}`,
//           {
//             ...current,
//             to: dir.from,
//           },
//           { headers }
//         );
//       }
//       await axios.put(
//         `${apiUrl}/api/labs/${labId}/directors/${dir._id}`,
//         {
//           ...dir,
//           to: null,
//         },
//         { headers }
//       );

//       await axios.put(
//         `${apiUrl}/api/labs/${labId}/current-director`,
//         { currentDirector: dir },
//         { headers }
//       );

//       alert(`${dir.name} is now set as the current director.`);
//       fetchDirectors();
//     } catch (err) {
//       console.error("Error setting current director", err);
//       alert("Failed to set current director.");
//     }
//   };

//   return (
//     <div className="p-4">
//       {currentDirector && (
//         <div className="mb-6 p-4 border rounded shadow bg-yellow-50">
//           <h3 className="text-lg font-bold text-yellow-800">
//             Current Director
//           </h3>
//           <p>
//             <strong>Name:</strong> {currentDirector.name}
//           </p>
//           <p>
//             <strong>Designation:</strong> {currentDirector.designation}
//           </p>
//           <p>
//             <strong>From:</strong>{" "}
//             {new Date(currentDirector.from).toLocaleDateString()}
//           </p>
//           {currentDirector.user?.email && (
//             <p>
//               <strong>Email:</strong> {currentDirector.user.email}
//             </p>
//           )}
//           {currentDirector.photo && (
//             <img
//               src={currentDirector.photo}
//               alt="Current Director"
//               className="w-24 mt-2"
//             />
//           )}
//         </div>
//       )}

//       <h2 className="text-xl font-semibold mb-2">Director History</h2>
//       <ul className="mb-6">
//         {directors.map((dir) => (
//           <li key={dir._id} className="mb-3 border p-3 rounded shadow">
//             <p>
//               <strong>From:</strong> {new Date(dir.from).toLocaleDateString()}{" "}
//               <strong>To:</strong>{" "}
//               {dir.to ? new Date(dir.to).toLocaleDateString() : "Present"}
//             </p>
//             {dir.user ? (
//               <p>
//                 <strong>User:</strong> {dir.user.name} ({dir.user.email})
//               </p>
//             ) : (
//               <>
//                 <p>
//                   <strong>Name:</strong> {dir.name}
//                 </p>
//                 <p>
//                   <strong>Designation:</strong> {dir.designation}
//                 </p>
//               </>
//             )}
//             {dir.image && (
//               <img src={dir.image} alt="Director" className="w-24 mt-1" />
//             )}
//             <div className="mt-2 flex gap-2 flex-wrap">
//               <button
//                 onClick={() => handleEdit(dir)}
//                 className="px-3 py-1 bg-blue-600 text-white rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(dir._id)}
//                 className="px-3 py-1 bg-red-600 text-white rounded"
//               >
//                 Delete
//               </button>
//               {dir.to ? (
//                 <button
//                   onClick={() => setAsCurrentDirector(dir)}
//                   className="px-3 py-1 bg-green-600 text-white rounded"
//                 >
//                   Set as Current Director
//                 </button>
//               ) : (
//                 <span className="px-3 py-1 bg-gray-300 text-gray-700 rounded">
//                   Current Director
//                 </span>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>

//       <h3 className="text-lg font-medium mb-2">
//         {editMode ? "Edit Director" : "Add New Director"}
//       </h3>
//       <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
//         <select
//           value={form.user}
//           onChange={handleUserChange}
//           className="w-full border p-2"
//         >
//           <option value="">Select Registered User</option>
//           {users.map((u) => (
//             <option key={u._id} value={u._id}>
//               {u.name} ({u.email})
//             </option>
//           ))}
//         </select>
//         <input
//           type="text"
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="w-full border p-2"
//           required
//         />
//         <input
//           type="text"
//           placeholder="Designation"
//           value={form.designation}
//           onChange={(e) => setForm({ ...form, designation: e.target.value })}
//           className="w-full border p-2"
//           required
//         />
//         <textarea
//           placeholder="About"
//           value={form.about}
//           onChange={(e) => setForm({ ...form, about: e.target.value })}
//           className="w-full border p-2"
//           rows={4}
//         />
//         <input
//           type="text"
//           placeholder="Image URL"
//           value={form.image}
//           onChange={(e) => setForm({ ...form, image: e.target.value })}
//           className="w-full border p-2"
//         />
//         <input
//           type="date"
//           value={form.from}
//           onChange={(e) => setForm({ ...form, from: e.target.value })}
//           className="w-full border p-2"
//           required
//         />
//         <input
//           type="date"
//           value={form.to}
//           onChange={(e) => setForm({ ...form, to: e.target.value })}
//           className="w-full border p-2"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-green-600 text-white rounded"
//         >
//           {editMode ? "Update" : "Add"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Directors;



import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Directors = ({ labId }) => {
  const [history, setHistory] = useState([]);
  const [currentDirector, setCurrentDirector] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    _id: null,
    user: "",
    name: "",
    designation: "Director",
    from: "",
    to: "",
    about: "",
    imageFile: null,
  });

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
  }, [labId]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/users`, { headers });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/labs/${labId}`, { headers });
      setHistory(res.data.directorHistory || []);
      setCurrentDirector(res.data.currentDirector || null);
      setError(null);
    } catch (err) {
      setError("Failed to load director history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      user: "",
      name: "",
      designation: "Director",
      from: "",
      to: "",
      about: "",
      imageFile: null,
    });
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.user && !formData.name.trim()) {
      alert("Please select a user or enter a name.");
      return;
    }

    try {
      const data = new FormData();
      if (formData.user) data.append("user", formData.user);
      else data.append("name", formData.name);

      data.append("designation", formData.designation);
      data.append("from", formData.from);
      if (formData.to) data.append("to", formData.to);
      if (formData.about) data.append("about", formData.about);
      if (formData.imageFile) data.append("image", formData.imageFile);

      if (editing) {
        await axios.put(
          `${apiUrl}/api/labs/${labId}/directors/${formData._id}`,
          data,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post(
          `${apiUrl}/api/labs/${labId}/directors`,
          data,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } }
        );
      }

      resetForm();
      fetchHistory();
    } catch (err) {
      alert("Failed to save.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this director?")) return;
    try {
      await axios.delete(`${apiUrl}/api/labs/${labId}/directors/${id}`, { headers });
      fetchHistory();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const handleEdit = (dir) => {
    setFormData({
      _id: dir._id,
      user: dir.user?._id || "",
      name: dir.user ? "" : dir.name || "",
      designation: dir.designation || "Director",
      from: dir.from?.slice(0, 10) || "",
      to: dir.to?.slice(0, 10) || "",
      about: dir.about || "",
      imageFile: null,
    });
    setEditing(true);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Director Management</h2>

      {currentDirector && (
        <div className="bg-yellow-100 p-3 rounded mb-5">
          <strong>Current Director:</strong> {currentDirector.name}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-3">{editing ? "Edit" : "Add New Director"}</h3>

        <div className="mb-3">
          <label>Select User:</label>
          <select
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full border p-2"
          >
            <option value="">-- None --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>

        {!formData.user && (
          <div className="mb-3">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2"
              required
            />
          </div>
        )}

        <input
          type="text"
          name="designation"
          placeholder="Designation"
          value={formData.designation}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />
        <textarea
          name="about"
          placeholder="About"
          value={formData.about}
          onChange={handleChange}
          rows={3}
          className="w-full border p-2 mb-3"
        />
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="mb-3"
        />

        <div className="flex gap-3 mb-3">
          <input
            type="date"
            name="from"
            value={formData.from}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
          <input
            type="date"
            name="to"
            value={formData.to}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {editing ? "Update" : "Add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 className="text-lg font-semibold mb-2">Director History</h3>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : history.length === 0 ? (
        <p>No directors found.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((entry) => (
            <li key={entry._id} className="p-3 border rounded flex justify-between">
              <div>
                <h4 className="font-semibold">{entry.user?.name || entry.name}</h4>
                <p>
                  {new Date(entry.from).toLocaleDateString()} to{" "}
                  {entry.to ? new Date(entry.to).toLocaleDateString() : "Present"}
                </p>
                <p>{entry.designation}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Directors;
