import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Contact({ labId }) {
  const [labData, setLabData] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/labs/${labId}`)
      .then((res) => setLabData(res.data))
      .catch((err) => console.error(err));
  }, [labId]);

  return (
    <div className=" mx-auto bg-white shadow-md rounded-xl p-6 mt-8">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        Contact Information
      </h3>

      {labData?.contactInfo?.length > 0 ? (
        <ul className="space-y-4">
          {labData.contactInfo.map((info) => (
            <li key={info._id} className="text-lg text-gray-700">
              <span className="font-bold text-gray-900">{info.type}{info.label ? ` (${info.label})` : ''}:</span>{' '}
              <span>{info.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-lg">Loading or no contact information available.</p>
      )}
    </div>
  );
}

export default Contact;
