import React, { useEffect, useState } from "react";
import axios from "axios";

const LabHistoryDetails = ({ labId }) => {
  const [labHistory, setLabHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabHistory = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/labs/${labId}`);
        const details = response.data.LabHistoryDetails || "No history available";

        // Split by period followed by space or newline, filter empty, trim spaces
        const points = details
          .split(/\. |\n/)
          .map(point => point.trim())
          .filter(point => point.length > 0);

        setLabHistory(points);
      } catch (err) {
        setError("Failed to fetch lab history");
      } finally {
        setLoading(false);
      }
    };

    fetchLabHistory();
  }, [labId]);

  if (loading) return <div style={{ fontSize: "20px" }}>Loading lab history...</div>;
  if (error) return <div style={{ fontSize: "20px", color: "red" }}>{error}</div>;

  return (
    <div>
      <h2 style={{ fontSize: "28px", marginBottom: "15px" }}>Lab History Details</h2>
      <ul style={{ fontSize: "20px", lineHeight: "1.6", listStyleType: "disc", paddingLeft: "20px" }}>
        {labHistory.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    </div>
  );
};

export default LabHistoryDetails;
