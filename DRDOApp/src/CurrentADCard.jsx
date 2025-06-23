// import React, { useEffect, useState } from "react";
// import axios from "axios";
// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
// import axiosInstance from "./axiosInstance";

// const CurrentADCard = ({ groupId }) => {
//   const [currentAD, setCurrentAD] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!groupId) return;

//     setLoading(true);
//     axiosInstance
//       .get(`/api/groups/id/${groupId}`)
//       .then((res) => {
//         setCurrentAD(res.data.currentAD);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError("Failed to load current Associate Director");
//         setLoading(false);
//       });
//   }, [groupId]);

//   if (loading)
//     return (
//       <div className="text-center text-gray-500 py-4">
//         Loading current Associate Director...
//       </div>
//     );
//   if (error)
//     return <div className="text-red-600 text-center py-4">{error}</div>;
//   if (!currentAD)
//     return (
//       <div className="text-gray-500 text-center py-4">
//         No current Associate Director found.
//       </div>
//     );

//   return (
//     <div className=" mx-auto bg-white  shadow-lg rounded-3xl p-6 transition-all duration-300">
//       <div className="flex items-center space-x-6">
//         <img
//           src={currentAD.image}
//           alt={currentAD.name}
//           className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500 shadow"
//         />
//         <div>
//           <h2 className="text-2xl font-bold text-blue-800">{currentAD.name}</h2>
//           <p className="text-gray-700 font-medium">{currentAD.designation}</p>
//           <p className="text-sm text-gray-500 mt-1">
//             <span className="font-medium text-gray-600">From:</span>{" "}
//             {new Date(currentAD.from).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       {currentAD.about && (
//         <div className="mt-6 border-t pt-4">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
//           <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
//             {currentAD.about}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CurrentADCard;


import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CurrentADCard = ({ groupId }) => {
  const [currentAD, setCurrentAD] = useState(null);
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) return;

    setLoading(true);
    axiosInstance
      .get(`/api/groups/id/${groupId}`)
      .then((res) => {
        const ad = res.data.currentAD || null;
        setCurrentAD(ad);
        setAbout(ad?.about || ad?.user?.about || res.data.about || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading AD:", err);
        setError("Failed to load current Associate Director");
        setLoading(false);
      });
  }, [groupId]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading current Associate Director...
      </div>
    );

  if (error)
    return <div className="text-red-600 text-center mt-10">{error}</div>;

  if (!currentAD)
    return (
      <div className="text-gray-500 text-center mt-10">
        No current Associate Director found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Image and Name Side by Side */}
      <div className="flex items-center gap-6 mb-8">
        {(currentAD.user?.photo || currentAD.image || currentAD.photo) && (
          <img
            src={`${apiUrl}${
              currentAD.user?.photo || currentAD.image || currentAD.photo
            }`}
            alt="Associate Director"
            className="w-40 h-48 object-cover rounded-lg shadow-md"
          />
        )}

        <h2 className="text-3xl font-bold text-gray-800">
          {currentAD.name || "N/A"}
        </h2>
      </div>

      {/* About Section */}
      <div>
        <h3 className="text-2xl font-semibold text-[#003168] mb-3">About</h3>
        <p className="text-lg text-gray-700 leading-relaxed text-justify">
          {currentAD.about ||
            currentAD.user?.about ||
            "No information provided yet."}
        </p>
      </div>
    </div>
  );
};

export default CurrentADCard;
