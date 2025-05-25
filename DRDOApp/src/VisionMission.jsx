import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Target } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function VisionMission({labId}) {
  const [labData, setLabData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/labs/${labId}`);
        setLabData(res.data);
      } catch (err) {
        console.error('Error fetching lab data:', err);
        setError('Unable to load Vision & Mission');
      } finally {
        setLoading(false);
      }
    };

    fetchLabData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-300 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 mt-4">{error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold ml-3 text-gray-800">Vision</h2>
          </div>
          <p className="text-gray-700 leading-relaxed indent-4">
            {labData.vision}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold ml-3 text-gray-800">Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed indent-4">
            {labData.mission}
          </p>
        </div>
      </div>
    </div>
  );
}
