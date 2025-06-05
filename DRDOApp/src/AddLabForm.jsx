import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FlaskConical } from "lucide-react"; // Optional icon

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddLabForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mission: "",
    vision: "",
    about: "",
    domain: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Lab name is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(`${apiUrl}/api/labs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Lab created successfully");
      setFormData({
        name: "",
        mission: "",
        vision: "",
        about: "",
        domain: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create lab");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=" mx-auto mt-20 px-6 py-8 bg-white border border-gray-200 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-blue-800 flex items-center mb-6">
        <FlaskConical className="mr-2 text-blue-700" />
        Add New Lab
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {["name", "mission", "vision", "about", "domain"].map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 capitalize mb-1"
            >
              {field}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={`Enter ${field}`}
              className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition shadow-sm"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Lab"}
        </button>
      </form>
    </section>
  );
};

export default AddLabForm;
