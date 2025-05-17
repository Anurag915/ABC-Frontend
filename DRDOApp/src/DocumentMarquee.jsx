import React, { useEffect, useState } from "react";
import "./DocumentMarquee.css"; // optional for styling
const apiUri = import.meta.env.VITE_API_URL;
const DocumentMarquee = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(`${apiUri}/api/documents/all`);
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };

    fetchDocuments();
  }, []);

  if (documents.length === 0) return null;

  return (
    <div className="marquee-container">
      <marquee behavior="scroll" direction="left" scrollAmount="6">
        {documents.map((doc, idx) => (
          <a
            key={idx}
            href={`http://localhost:5000${doc.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-link"
          >
            {doc.name}
          </a>
        ))}
      </marquee>
    </div>
  );
};

export default DocumentMarquee;
