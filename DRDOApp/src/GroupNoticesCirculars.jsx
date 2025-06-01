import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "./axiosInstance";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

function GroupNoticesCirculars({ groupId }) {
  const [data, setData] = useState({ notices: [], circulars: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // const res = await fetch(`/api/groups/id/${groupId}`);
        const res = await axiosInstance.get(`/api/groups/id/${groupId}`);
        const group = res.data;

        setData({
          notices: group.notices || [],
          circulars: group.circulars || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [groupId]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>;

  const renderFileList = (items) =>
    items.map(({ _id, name, description, fileUrl }) => (
      <li
        key={_id}
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          backgroundColor: "#fafafa",
        }}
      >
        <a
          href={`${apiUrl}${fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#007bff",
            fontWeight: "600",
            fontSize: "1.1rem",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
        >
          {name}
        </a>
        <p style={{ marginTop: "0.3rem", color: "#555", fontSize: "0.9rem" }}>
          {description}
        </p>
      </li>
    ));

  return (
    <div style={{ margin: "2rem auto", padding: "0 1rem" }}>
      <h2
        style={{ borderBottom: "2px solid #007bff", paddingBottom: "0.5rem" }}
      >
        Notices
      </h2>
      {data.notices.length > 0 ? (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {renderFileList(data.notices)}
        </ul>
      ) : (
        <p style={{ color: "#555", marginTop: "1rem" }}>No notices found.</p>
      )}

      <h2
        style={{
          marginTop: "3rem",
          borderBottom: "2px solid #28a745",
          paddingBottom: "0.5rem",
          color: "#28a745",
        }}
      >
        Circulars
      </h2>
      {data.circulars.length > 0 ? (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {renderFileList(data.circulars)}
        </ul>
      ) : (
        <p style={{ color: "#555", marginTop: "1rem" }}>No circulars found.</p>
      )}
    </div>
  );
}

export default GroupNoticesCirculars;
