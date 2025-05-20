import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';

const apiUri = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GroupEmployees = ({ groupId }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(`${apiUri}/api/groups/${groupId}`);
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error('Failed to fetch employees:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [groupId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-full h-24 w-24 mx-auto" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-6 gap-2">
        <Users className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold">Team Members</h2>
      </div>
      {employees.length === 0 ? (
        <p className="text-center text-gray-500">No team members found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {employees.map(emp => (
            <div
              key={emp._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition p-6 flex flex-col items-center"
            >
              <div className="w-28 h-28 mb-4">
                <img
                  src={emp.photo ? `${apiUri}${emp.photo}` : 'https://via.placeholder.com/112'}
                  alt={emp.name}
                  className="w-full h-full object-cover rounded-full border-2 border-green-200"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{emp.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{emp.email}</p>
              {emp.role && (
                <span className="text-xs text-white bg-green-600 px-2 py-1 rounded">
                  {emp.role}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupEmployees;
