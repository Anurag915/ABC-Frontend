import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
const apiUrl = import.meta.env.VITE_API_URL;
import { Link } from "react-router-dom";

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

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton screen
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-black">
      {/* <Navbar /> */}
      <main className="flex-1 p-6 bg-gray-100">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Explore Our Research Groups
        </h2>
        {localStorage.getItem("role") === "admin" && (
          <Link to="/add-group">
            <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">
              Add New Group
            </button>
          </Link>
        )}

        {error && (
          <div className="text-red-500 text-center mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {groups.map((group) => (
            <div
              key={group._id}
              onClick={() => navigate(`/group/${group._id}`)}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3 border-b pb-3">
                <FaUserShield className="text-blue-600 text-2xl" />
                <h3 className="text-xl font-bold text-blue-800">
                  {group.name}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{group.description}</p>
            </div>
          ))}
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default HomePage;
