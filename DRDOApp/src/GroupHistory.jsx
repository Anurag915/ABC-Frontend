import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const GroupHistory = ({ groupId }) => {
  const [historyPoints, setHistoryPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/groups/${groupId}`);
        const text = res.data.GroupHistoryDetails || "";
        const points = text
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
        setHistoryPoints(points);
      } catch (err) {
        console.error("Error fetching group history:", err);
        setError("Failed to load group history.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [groupId]);

  if (loading) return <p className="text-gray-500">Loading history...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-3 text-blue-800">Group History</h2>
      {historyPoints.length > 0 ? (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {historyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No history details available.</p>
      )}
    </div>
  );
};

export default GroupHistory;
