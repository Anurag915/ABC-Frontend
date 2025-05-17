import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize the navigate function

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/auth/login`, form);

      localStorage.setItem("token", res.data.token); // Save JWT token
      localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ This line is critical
      localStorage.setItem("role", res.data.user.role); // optional
      localStorage.setItem("userId", res.data.user.id); // ✅ Store the user ID

      alert("Login successful!");
      navigate("/"); // Redirect to home page
    } catch (err) {
      alert(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="bg-[#f0f4f8] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-[#003168] mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-gray-700">
              Email
            </label>
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
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
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

          <button
            type="submit"
            className="w-full py-3 bg-[#003168] text-white font-semibold rounded-md hover:bg-[#0050a1] transition-colors duration-300"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-[#003168] font-semibold cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
