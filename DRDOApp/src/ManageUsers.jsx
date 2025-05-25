import React, { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/users/`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p style={{ color: "#b45309" /* amber-700 */ }}>Loading users...</p>;
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#fffbeb", // amber-50 background
        color: "#78350f", // amber-800 text
        minHeight: "100vh",
      }}
    >
      <h2 style={{ color: "#b45309", marginBottom: 20 /* amber-700 */ }}>Manage Users</h2>
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
        <thead style={{ backgroundColor: "#f59e0b", color: "white" /* amber-400 */ }}>
          <tr>
            <th style={{ padding: "12px 10px", textAlign: "left" }}>Photo</th>
            <th style={{ padding: "12px 10px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "12px 10px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "12px 10px", textAlign: "left" }}>Role</th>
            <th style={{ padding: "12px 10px", textAlign: "left" }}>Employment Period</th>
            <th style={{ padding: "12px 10px", textAlign: "left" }}>Documents</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const fromDate = user.employmentPeriod?.from
              ? new Date(user.employmentPeriod.from).toLocaleDateString()
              : "N/A";
            const toDate = user.employmentPeriod?.to
              ? new Date(user.employmentPeriod.to).toLocaleDateString()
              : "N/A";

            return (
              <tr key={user._id} style={{ borderBottom: "1px solid #fcd34d" /* amber-300 */ }}>
                <td style={{ padding: 10 }}>
                  {user.photo ? (
                    <img
                      src={`${apiUrl}${user.photo}`}
                      alt={user.name}
                      style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        backgroundColor: "#fde68a", // amber-200
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#92400e", // amber-700
                        fontSize: 14,
                        borderRadius: 6,
                      }}
                    >
                      No Photo
                    </div>
                  )}
                </td>
                <td style={{ padding: 10 }}>{user.name}</td>
                <td style={{ padding: 10 }}>{user.email}</td>
                <td style={{ padding: 10, textTransform: "capitalize" }}>{user.role}</td>
                <td style={{ padding: 10 }}>
                  {fromDate} - {toDate}
                </td>
                <td style={{ padding: 10 }}>
                  {user.documents && user.documents.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 15 }}>
                      {user.documents.map((doc) => (
                        <li key={doc._id}>
                          <a
                            href={`${apiUrl}${doc.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#d97706", textDecoration: "underline" /* amber-600 */ }}
                          >
                            {doc.filename}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span>No documents</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
