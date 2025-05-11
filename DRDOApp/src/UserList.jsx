import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/users/`)
      .then((response) => {
        const filtered = response.data.map(({ name, email, role }) => ({
          name,
          email,
          role,
        }));
        setUsers(filtered);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🧑‍💼 Employee Directory
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-5 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-indigo-700">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="mt-2">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800 capitalize">
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
