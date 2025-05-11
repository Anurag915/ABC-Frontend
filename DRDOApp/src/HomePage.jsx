import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
const apiUrl = import.meta.env.VITE_API_URL;
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${apiUrl}/api/groups`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch groups");
        return res.json();
      })
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching groups. Please try again later.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-black">

      <main className="flex-1 px-6 sm:px-10 md:px-20 py-10 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 drop-shadow">
            Welcome to Our Research Groups
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Discover innovations, explore breakthroughs, and connect with experts.
          </p>
        </div>

        {localStorage.getItem("role") === "admin" && (
          <div className="text-right mb-6">
            <Link to="/add-group">
              <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow-lg transition duration-300">
                ➕ Add New Group
              </button>
            </Link>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4 font-medium">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Showing <span className="font-semibold">{groups.length}</span> group{groups.length !== 1 && 's'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {groups.map((group, index) => (
                <motion.div
                  key={group._id}
                  onClick={() => navigate(`/group/${group._id}`)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <FaUserShield className="text-blue-600 text-3xl" />
                    <h3 className="text-xl font-bold text-blue-800">{group.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{group.description}</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>

    </div>
  );
}

export default HomePage;
