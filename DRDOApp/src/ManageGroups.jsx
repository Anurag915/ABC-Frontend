import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
function ManageGroups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/api/groups/`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGroups(data); // data is the array
        } else {
          setGroups([]); // fallback
        }
      })
      .catch(() => setGroups([]));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Groups</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(groups) &&
            groups.map((group) => (
              <tr key={group._id}>
                <td className="border px-4 py-2">{group.name}</td>
                <td className="border px-4 py-2">{group.description}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/admin/groups/${group._id}`}
                    className="text-blue-500 underline mr-2"
                  >
                    View
                  </Link>
                  <Link
                    to={`/groups/${group._id}/edit`}
                    className="text-green-500 underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageGroups;
