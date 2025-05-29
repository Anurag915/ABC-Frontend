import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return <p style={{ color: "#2563eb" /* blue-600 */ }}>Loading users...</p>;

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#eff6ff", // blue-50
        color: "#1e3a8a", // blue-900
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#2563eb", marginBottom: 20 /* blue-600 */ }}>
        User List
      </h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backgroundColor: "white",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <thead style={{ backgroundColor: "#3b82f6", color: "white" /* blue-500 */ }}>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                style={{
                  borderBottom: "1px solid #93c5fd" /* blue-300 */,
                  // backgroundColor: index % 2 === 0 ? "#ffffff" : "#e0f2fe" /* alternating blue-100 */,
                }}
              >
                <td style={tdStyle}>{index + 1}</td>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Table cell styles
const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "10px",
};
