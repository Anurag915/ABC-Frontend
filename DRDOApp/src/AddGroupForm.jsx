import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddGroupForm = ({ labId }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    vision: "",
    mission: "",
    about: "",
    employees: [],
  });

  const [loading, setLoading] = useState(false);
  const [availableEmployees, setAvailableEmployees] = useState([]);

  useEffect(() => {
    // Fetch employees to assign to group (you can adjust this)
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/users?role=employee`);
        setAvailableEmployees(res.data || []);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeToggle = (id) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.includes(id)
        ? prev.employees.filter((emp) => emp !== id)
        : [...prev.employees, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Group name is required");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = { ...formData };

      await axios.post(`${apiUrl}/api/groups`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { labId }, // send labId as req.params
      });

      toast.success("Group created successfully");
      setFormData({
        name: "",
        description: "",
        vision: "",
        mission: "",
        about: "",
        employees: [],
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto mt-12 space-y-5 border"
    >
      <h2 className="text-xl font-bold text-blue-800">Create New Group</h2>

      {["name", "description", "vision", "mission", "about"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
            {field}
          </label>
          <input
            type="text"
            name={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign Employees
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border p-3 rounded-md">
          {availableEmployees.map((emp) => (
            <label key={emp._id} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.employees.includes(emp._id)}
                onChange={() => handleEmployeeToggle(emp._id)}
              />
              <span>{emp.personalDetails?.fullName || emp.email}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Group"}
      </button>
    </form>
  );
};

export default AddGroupForm;
