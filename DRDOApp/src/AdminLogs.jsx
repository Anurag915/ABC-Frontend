import React, { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`${apiUrl}/admin/logs`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = Array.isArray(res.data) ? res.data : [];
                const sorted = data.sort(
                    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                );
                setLogs(sorted);
                setFilteredLogs(sorted);
            } catch (error) {
                console.error("Error fetching logs:", error);
                setLogs([]);
                setFilteredLogs([]);
            }
        };

        fetchLogs();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();

        const filtered = logs.filter((log) => {
            const user = log.userId || {};
            return (
                (user.name && user.name.toLowerCase().includes(query)) ||
                (user.email && user.email.toLowerCase().includes(query)) ||
                (log.action && log.action.toLowerCase().includes(query))
            );
        });

        setFilteredLogs(filtered);
    }, [searchQuery, logs]);

    return (
        <div className="p-6 mx-auto mt-16 ">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Activity Logs</h2>

            <input
                type="text"
                placeholder="Search by name, email, or action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-6 px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="overflow-auto rounded-lg shadow-md">
                <table className="min-w-full text-sm text-left border-collapse">
                    <thead className="bg-blue-100 text-blue-800 sticky top-0">
                        <tr>
                            <th className="py-3 px-5">Name</th>
                            <th className="py-3 px-5">Email</th>
                            <th className="py-3 px-5">Action</th>
                            <th className="py-3 px-5">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, index) => (
                                <tr
                                    key={log._id}
                                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        } hover:bg-gray-100 transition`}
                                >
                                    <td className="py-3 px-5 font-medium text-gray-800">
                                        {log.userId?.name || "Unknown"}
                                    </td>
                                    <td className="py-3 px-5 text-gray-600">
                                        {log.userId?.email || "N/A"}
                                    </td>
                                    <td className="py-3 px-5 text-gray-700">{log.action}</td>
                                    <td className="py-3 px-5 text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-6 px-5 text-center text-gray-500">
                                    No logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLogs;
