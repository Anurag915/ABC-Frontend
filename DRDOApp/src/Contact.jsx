import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Contact() {
  const [labData, setLabData] = useState(null);

  useEffect(() => {
    axios.get(`${apiUrl}/api/labs/68281329c79492a7cf984910`)
      .then(res => setLabData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>Contact Information</h3>
      {labData?.contactInfo?.length > 0 ? (
        <ul>
          {labData.contactInfo.map((info) => (
            <li key={info._id}>
              <strong>{info.type}:</strong> {info.value}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading or no contact information available.</p>
      )}
    </div>
  );
}

export default Contact;
