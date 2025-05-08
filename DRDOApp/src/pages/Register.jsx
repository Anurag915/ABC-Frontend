

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate
const apiUrl = import.meta.env.VITE_API_URL;

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const navigate = useNavigate();  // Initialize the navigate function

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/register`, form);
      alert("Registration successful! Please login.");
      navigate("/login");  // Redirect to login page after successful registration
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-[#f0f4f8] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-[#003168] mb-6">Register</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#003168] focus:outline-none"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#003168] focus:outline-none"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#003168] focus:outline-none"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm text-gray-700">Role</label>
            <select
              name="role"
              id="role"
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#003168] focus:outline-none"
              value={form.role}
              onChange={handleChange}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#003168] text-white font-semibold rounded-md hover:bg-[#0050a1] transition-colors duration-300"
          >
            Register
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                className="text-[#003168] font-semibold cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
