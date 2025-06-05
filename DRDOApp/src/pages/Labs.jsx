import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
// const labId = "6831e91d804bf498865b819d";

export default function LabDetails({ labId }) {
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/labs/${labId}`)
      .then((res) => res.json())
      .then((data) => {
        setLab(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch lab data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-transparent" />
      </div>
    );
  }

  if (!lab) {
    return (
      <p className="text-center text-gray-500 mt-12">No lab data found.</p>
    );
  }

  return (
    <div className="mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-100 rounded-full mr-3">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">About</h3>
        </div>
        {lab.about?.trim() ? (
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-lg leading-relaxed">
            {lab.about
              .split(/\n|\. ?/) // Split by newline or period + optional space
              .filter((point) => point.trim().length > 0)
              .map((point, idx) => (
                <li key={idx}>{point.trim()}</li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-700 text-lg">No description available.</p>
        )}
      </div>
    </div>
  );
}
