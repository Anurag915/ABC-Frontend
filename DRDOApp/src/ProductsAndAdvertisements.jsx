// import React, { useEffect, useState } from "react";
// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const ProductsAndAdvertisements = ({ labId }) => {
//   const [products, setProducts] = useState([]);
//   const [advertisements, setAdvertisements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(
//           `${apiUrl}/api/labs/${labId}/products-advertisements`
//         );
//         const data = await res.json();

//         if (res.ok) {
//           setProducts(data.products || []);
//           setAdvertisements(data.advertisements || []);
//           setError("");
//         } else {
//           setError(data.message || "Something went wrong");
//         }
//       } catch (err) {
//         setError("Failed to fetch data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [labId]);

//   if (loading) return <p style={{ fontSize: "1.2rem" }}>Loading...</p>;
//   if (error) return <p style={{ color: "red", fontSize: "1.2rem" }}>{error}</p>;

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h2 style={headingStyle}>Products</h2>
//       {products.length === 0 ? (
//         <p style={textStyle}>No products available.</p>
//       ) : (
//         products.map((item, index) => (
//           <div key={index} style={cardStyle}>
//             <h4 style={titleStyle}>{item.name}</h4>
//             <p style={textStyle}>{item.description}</p>
//             <a
//               href={`${apiUrl}${item.fileUrl}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={linkStyle}
//             >
//               View/Download File
//             </a>
//           </div>
//         ))
//       )}

//       <h2 style={{ ...headingStyle, marginTop: "2rem" }}>Achievements</h2>
//       {advertisements.length === 0 ? (
//         <p style={textStyle}>No achievements available.</p>
//       ) : (
//         advertisements.map((item, index) => (
//           <div key={index} style={cardStyle}>
//             <h4 style={titleStyle}>{item.name}</h4>
//             <p style={textStyle}>{item.description}</p>
//             <a
//               href={`${apiUrl}${item.fileUrl}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={linkStyle}
//             >
//               View/Download File
//             </a>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// const cardStyle = {
//   border: "1px solid #ccc",
//   padding: "1.5rem",
//   marginBottom: "1.5rem",
//   borderRadius: "8px",
//   boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//   fontSize: "1.1rem",
// };

// const headingStyle = {
//   fontSize: "1.8rem",
//   fontWeight: "bold",
//   marginBottom: "1rem",
// };

// const titleStyle = {
//   fontSize: "1.4rem",
//   fontWeight: "600",
//   marginBottom: "0.5rem",
// };

// const textStyle = {
//   fontSize: "1.1rem",
//   color: "#333",
// };

// const linkStyle = {
//   color: "#007BFF",
//   textDecoration: "underline",
//   fontWeight: "bold",
//   fontSize: "1.1rem",
// };

// export default ProductsAndAdvertisements;


import React, { useEffect, useState } from "react";

// It's good practice to ensure environment variables are clearly defined
// and fall back gracefully for development.
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductsAndAdvertisements = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true); // Ensure loading is true on fetch start
        setError("");     // Clear previous errors

        const res = await fetch(`${apiUrl}/api/groups/`);
        const data = await res.json();

        if (res.ok) {
          setGroups(data || []);
        } else {
          setError(data.message || "Failed to load data.");
          console.error("API Error:", data.message);
        }
      } catch (err) {
        console.error("Network or parsing error:", err);
        setError("Failed to connect to the server. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-gray-50 rounded-lg shadow-inner mt-8 mx-auto max-w-lg">
        <p className="text-xl text-blue-700 font-semibold animate-pulse">Loading group data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48 bg-red-50 border border-red-300 rounded-lg shadow-inner mt-8 mx-auto max-w-lg">
        <p className="text-red-700 font-medium text-center px-4">{error}</p>
      </div>
    );
  }

  // --- Main Content ---
  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 border-b-2 border-blue-500 pb-4">
        Group-wise Research Activities
      </h2>

      {groups.length === 0 && (
        <div className="text-center text-gray-600 text-lg mt-10 p-6 bg-white rounded-lg shadow">
          <p>No group data available to display at the moment.</p>
          <p className="mt-2 text-sm italic">Please check back later or contact support.</p>
        </div>
      )}

      <div className="space-y-12">
        {groups.map((group) => (
          <div
            key={group._id}
            className="bg-white shadow-xl rounded-2xl p-8 border border-blue-100 transform transition-transform duration-300 hover:scale-[1.01] hover:shadow-2xl"
          >
            <h3 className="text-3xl font-bold text-blue-700 mb-4 pb-2 border-b border-blue-200">
              {group.name}
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {group.description || "No description provided for this group."}
            </p>

            {/* Sections Container for better spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {renderSection("Projects", group.projects, "📊")}
              {renderSection("Patents", group.patents, "💡")}
              {renderSection("Technologies", group.technologies, "🔬")}
              {renderSection("Publications", group.publications, "📚")}
              {renderSection("Courses", group.courses, "🎓")}
              {/* You can add more sections here if your group data includes them */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper component for rendering each section
const renderSection = (title, items, icon = "") => (
  <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
    <h4 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
      {icon && <span className="mr-2 text-2xl">{icon}</span>}
      {title}
    </h4>
    {items && items.length > 0 ? (
      <ul className="space-y-3 text-gray-800 text-base">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start">
            {/* Optional: Add a small bullet icon or checkmark */}
            <span className="text-blue-500 mr-2 mt-1">•</span>
            <div>
              <span className="font-medium text-gray-900">{item.name || "Unnamed Item"}</span>
              {item.description && <span className="text-gray-600"> – {item.description}</span>}
              {item.fileUrl && (
                <a
                  href={`${apiUrl}${item.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 ml-3 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                  title={`View ${item.name || 'document'}`}
                >
                  View
                  {/* Optional: Add an external link icon */}
                  <svg className="ml-1 -mr-0.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic text-sm p-3 bg-white rounded">
        No {title.toLowerCase()} listed for this group.
      </p>
    )}
  </div>
);

export default ProductsAndAdvertisements;