import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
function NoticesAndCirculars({ labId }) {
  const [data, setData] = useState({ notices: [], circulars: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNoticesAndCirculars() {
      try {
        const res = await fetch(`${apiUrl}/api/labs/${labId}`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const lab = await res.json();
        setData({ notices: lab.notices || [], circulars: lab.circulars || [] });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNoticesAndCirculars();
  }, [labId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

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
        <p className="mt-1 text-gray-600 text-base">{description}</p>
      </li>
    ));

  return (
    <div style={{ margin: "2rem auto", padding: "0 1rem" }}>
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          borderBottom: "2px solid #007bff",
          paddingBottom: "0.5rem",
        }}
      >
        Notices
      </h2>

      {data.notices.length > 0 ? (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {renderFileList(data.notices)}
        </ul>
      ) : (
        <p>No notices found.</p>
      )}

      <h2
        style={{
          marginTop: "3rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          borderBottom: "2px solid #28a745",
          paddingBottom: "0.5rem",
        }}
      >
        Circulars
      </h2>

      {data.circulars.length > 0 ? (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {renderFileList(data.circulars)}
        </ul>
      ) : (
        <p>No circulars found.</p>
      )}
    </div>
  );
}

export default NoticesAndCirculars;
