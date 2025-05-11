// GroupForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const apiUrl = import.meta.env.VITE_API_URL;

const GroupForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [labId, setLabId] = useState(""); // Optional

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.error("Error fetching users", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        employees: selectedEmployees,
      };

      const res = await axios.post(`${apiUrl}/api/groups/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Group created successfully!");
      navigate("/");
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* <Navbar /> */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create a New Group
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Write a short description"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Employees
            </label>
            <select
              multiple
              value={selectedEmployees}
              onChange={(e) =>
                setSelectedEmployees(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.isArray(employees) &&
                employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name} ({emp.email})
                  </option>
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Group
          </button>
        </form>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default GroupForm;
