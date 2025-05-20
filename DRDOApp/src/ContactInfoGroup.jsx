import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactInfoGroup = () => {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const groupId = "681f9b5a8d8604b345c6e118";

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setContactInfo(res.data.contactInfo || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch contact info.");
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  if (loading) return <p className="text-gray-600">Loading contact info...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact Information</h2>
      {contactInfo.length === 0 ? (
        <p className="text-gray-600 italic">No contact information available.</p>
      ) : (
        <ul className="space-y-3">
          {contactInfo.map(info => (
            <li
              key={info._id}
              className="bg-gray-50 border rounded p-3 shadow-sm text-gray-800"
            >
              <strong>{info.type}</strong>
              {info.label && ` - ${info.label}`}: {info.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContactInfoGroup;
