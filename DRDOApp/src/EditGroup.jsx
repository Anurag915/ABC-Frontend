import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
const EditGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState({ name: "", description: "", employees: [] });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/groups/${id}`);
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };
    fetchGroup();
  }, [id]);

  const handleChange = (e) => {
    setGroup({ ...group, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiUrl}/api/groups/${id}`, group, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Group updated successfully!");
      navigate(`/group/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update group");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={group.name}
          onChange={handleChange}
          placeholder="Group Name"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          value={group.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditGroup;
