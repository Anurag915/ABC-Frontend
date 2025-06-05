import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const OfficeOfDirector = ({labId}) => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/labs/${labId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setDirectors(data.officeOfDirector || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading office of director info...</p>;
  if (error) return <p>Error: {error}</p>;
  if (directors.length === 0) return <p>No director office data available.</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Office of Director</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Designation</th>
            <th style={thStyle}>Contact Number</th>
            <th style={thStyle}>Email</th>
          </tr>
        </thead>
        <tbody>
          {directors.map(({ _id, name, designation, contactNumber, email }) => (
            <tr key={_id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{name}</td>
              <td style={tdStyle}>{designation}</td>
              <td style={tdStyle}>{contactNumber}</td>
              <td style={tdStyle}>{email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  padding: "12px 8px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px 8px",
};

export default OfficeOfDirector;
