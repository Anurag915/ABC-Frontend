import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MyGroup() {
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${apiUrl}/api/groups/my-group`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGroup(res.data))
      .catch((err) => {
        console.error("Error:", err);
        setError("You are not assigned to any group or unauthorized.");
      });
  }, []);

  if (error) return <p className="text-red-500 p-4">{error}</p>;
  if (!group) return <p className="p-4">Loading your group details...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-2">{group.name}</h1>
      <p className="mb-4">{group.description}</p>

      <h2 className="text-xl font-medium mb-1">Employees</h2>
      <ul className="list-disc pl-6">
        {group.employees.map((emp) => (
          <li key={emp._id}>{emp.name} ({emp.email})</li>
        ))}
      </ul>
    </div>
  );
}
