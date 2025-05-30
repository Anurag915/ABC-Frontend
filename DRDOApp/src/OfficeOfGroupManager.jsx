import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const OfficeOfGroupManager = ({ groupId }) => {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/groups/${groupId}`);
        setOffices(res.data.officeOfGroup || []);
      } catch (err) {
        console.error("Error fetching offices:", err);
        setError("Failed to load office data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, [groupId]);

  if (loading) return <p className="text-gray-500">Loading office info...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Office of the Group</h2>
      {offices.length > 0 ? (
        <div className="space-y-4">
          {offices.map((office) => (
            <div key={office._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-800">{office.name}</h3>
              <p><strong>Designation:</strong> {office.designation}</p>
              <p><strong>Contact:</strong> {office.contactNumber}</p>
              <p><strong>Email:</strong> {office.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No office information available.</p>
      )}
    </div>
  );
};

export default OfficeOfGroupManager;
