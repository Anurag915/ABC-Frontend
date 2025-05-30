import React, { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AssistantDirectorsTable = ({ groupId }) => {
  const [assistantDirectors, setAssistantDirectors] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/groups/${groupId}`);
        setAssistantDirectors(res.data.assistantDirectorHistory || []);
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Error fetching assistant directors:", err);
      }
    };

    if (groupId) fetchData();
  }, [groupId]);

  return (
    <div className="overflow-x-auto mt-4">
      <h2 className="text-lg font-bold mb-2">Assistant Directors</h2>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">S.No</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">From</th>
            <th className="px-4 py-2 border">To</th>
          </tr>
        </thead>
        <tbody>
          {assistantDirectors.map((ad, index) => {
            let name = ad.name;
            if (!name && ad.user) {
              const emp = employees.find(e => e._id === ad.user);
              name = emp?.name || "Unknown";
            }

            return (
              <tr key={ad._id} className="border-t">
                <td className="px-4 py-2 border text-center">{index + 1}</td>
                <td className="px-4 py-2 border">{name}</td>
                <td className="px-4 py-2 border">
                  {new Date(ad.from).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  {ad.to ? new Date(ad.to).toLocaleDateString() : "Present"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssistantDirectorsTable;
