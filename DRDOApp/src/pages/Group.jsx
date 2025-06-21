import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Groups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios
      .get("/api/groups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setGroups(res.data))
      .catch((err) => console.error("Error fetching groups", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Groups</h1>

      {/* Only show the button if the user is an admin */}
      {localStorage.getItem("role") === "admin" && (
        <Link to="/add-group">
          <button className="bg-green-600 text-white px-4 py-2 rounded mb-4">
            Add New Group
          </button>
        </Link>
      )}

      <div>
        {groups.map((group) => (
          <div key={group._id} className="border-b py-2">
            <h3>{group.name}</h3>
            <p>{group.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Groups;
