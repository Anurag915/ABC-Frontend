// import React, { useEffect, useState } from "react";
// import "./DocumentMarquee.css"; // optional for styling
// const apiUri = import.meta.env.VITE_API_URL;
// const DocumentMarquee = () => {
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const res = await fetch(`${apiUri}/api/documents/all`);
//         const data = await res.json();
//         setDocuments(data);
//       } catch (err) {
//         console.error("Failed to fetch documents:", err);
//       }
//     };

//     fetchDocuments();
//   }, []);

//   if (documents.length === 0) return null;

//   return (
//     <div className="marquee-container">
//       <marquee behavior="scroll" direction="left" scrollamount="6">
//         {documents.map((doc, idx) => (
//           <a
//             key={idx}
//             href={`${apiUri}${doc.url}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="doc-link"
//           >
//             {doc.name}
//           </a>
//         ))}
//       </marquee>
//     </div>
//   );
// };

// export default DocumentMarquee;
import React, { useEffect, useState } from "react";
const apiUri = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: "#FEF3C7", // yellow-50
        border: "1px solid #FBBF24", // yellow-400
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        height: "40px",
        fontWeight: "bold",
        color: "#B45309", // yellow-700
        userSelect: "none",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          marginRight: "16px",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}
      >
        News Flash:
      </div>

      <div
        style={{
          flexGrow: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            animation: "scroll-left 20s linear infinite",
          }}
        >
          {[...documents, ...documents].map((doc, idx) => (
            <a
              key={idx}
              href={`${apiUri}${doc.url}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginRight: "32px",
                color: "#2563EB", // blue-700
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
            >
              {doc.name}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default DocumentMarquee;
