// import React, { useState, useEffect } from "react";
// import axios from "axios";

// // const LAB_ID = "6831e91d804bf498865b819d"; // Replace with your actual Lab ID
// const apiUrl = import.meta.env.VITE_API_URL;

// const ManageLabInfo = ({labId}) => {
//   const [lab, setLab] = useState({
//     name: "",
//     domain: "",
//     vision: "",
//     mission: "",
//     about: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState(null);

//   const yourToken = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchLabInfo = async () => {
//       try {
//         const res = await axios.get(`/api/labs/${labId}`, {
//           headers: { Authorization: `Bearer ${yourToken}` },
//         });
//         setLab(res.data);
//       } catch (err) {
//         setError("Failed to fetch lab information.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLabInfo();
//   }, []);

//   const handleChange = (e) => {
//     setLab({ ...lab, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSaving(true);
//     setError(null);

//     try {
//       await axios.put(`${apiUrl}/api/labs/${labId}`, lab, {
//         headers: { Authorization: `Bearer ${yourToken}` },
//       });
//       alert("Lab information updated successfully!");
//     } catch {
//       setError("Failed to update lab information.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
//       <h2 className="text-3xl font-semibold mb-8 text-gray-800 border-b pb-4">
//         Update Lab Information
//       </h2>

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded border border-red-300">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Lab Name */}
//         <div>
//           <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
//             Lab Name
//           </label>
//           <input
//             id="name"
//             name="name"
//             value={lab.name}
//             onChange={handleChange}
//             placeholder="Enter Lab Name"
//             className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         {/* Domain */}
//         <div>
//           <label htmlFor="domain" className="block mb-2 font-medium text-gray-700">
//             Domain
//           </label>
//           <input
//             id="domain"
//             name="domain"
//             value={lab.domain}
//             onChange={handleChange}
//             placeholder="Enter Domain"
//             className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         {/* Vision */}
//         <div>
//           <label htmlFor="vision" className="block mb-2 font-medium text-gray-700">
//             Vision
//           </label>
//           <textarea
//             id="vision"
//             name="vision"
//             value={lab.vision}
//             onChange={handleChange}
//             placeholder="Enter Vision"
//             rows={4}
//             className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         {/* Mission */}
//         <div>
//           <label htmlFor="mission" className="block mb-2 font-medium text-gray-700">
//             Mission
//           </label>
//           <textarea
//             id="mission"
//             name="mission"
//             value={lab.mission}
//             onChange={handleChange}
//             placeholder="Enter Mission"
//             rows={4}
//             className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         {/* About */}
//         <div>
//           <label htmlFor="about" className="block mb-2 font-medium text-gray-700">
//             About the Lab
//           </label>
//           <textarea
//             id="about"
//             name="about"
//             value={lab.about}
//             onChange={handleChange}
//             placeholder="Write about the lab"
//             rows={5}
//             className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isSaving}
//           className={`w-full py-3 font-semibold rounded-lg text-white transition-colors duration-200 ${
//             isSaving
//               ? "bg-blue-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {isSaving ? "Saving..." : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ManageLabInfo;


import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const ManageLabInfo = ({ labId }) => {
  const [lab, setLab] = useState({
    name: "",
    domain: "",
    vision: "",
    mission: "",
    about: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const yourToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchLabInfo = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/labs/${labId}`, {
          headers: { Authorization: `Bearer ${yourToken}` },
        });
        setLab({
          name: res.data.name || "",
          domain: res.data.domain || "",
          vision: res.data.vision || "",
          mission: res.data.mission || "",
          about: res.data.about || "",
        });
      } catch (err) {
        setError("Failed to fetch lab information.");
      } finally {
        setLoading(false);
      }
    };

    if (labId) fetchLabInfo();
  }, [labId, apiUrl]);

  const handleChange = (e) => {
    setLab({ ...lab, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await axios.put(`${apiUrl}/api/labs/${labId}`, lab, {
        headers: { Authorization: `Bearer ${yourToken}` },
      });
      alert("Lab information updated successfully!");
    } catch {
      setError("Failed to update lab information.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800 border-b pb-4">
        Update Lab Information
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lab Name */}
        <div>
          <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
            Lab Name
          </label>
          <input
            id="name"
            name="name"
            value={lab.name}
            onChange={handleChange}
            placeholder="Enter Lab Name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Domain */}
        <div>
          <label htmlFor="domain" className="block mb-2 font-medium text-gray-700">
            Domain
          </label>
          <input
            id="domain"
            name="domain"
            value={lab.domain}
            onChange={handleChange}
            placeholder="Enter Domain"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Vision */}
        <div>
          <label htmlFor="vision" className="block mb-2 font-medium text-gray-700">
            Vision
          </label>
          <textarea
            id="vision"
            name="vision"
            value={lab.vision}
            onChange={handleChange}
            placeholder="Enter Vision"
            rows={4}
            className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Mission */}
        <div>
          <label htmlFor="mission" className="block mb-2 font-medium text-gray-700">
            Mission
          </label>
          <textarea
            id="mission"
            name="mission"
            value={lab.mission}
            onChange={handleChange}
            placeholder="Enter Mission"
            rows={4}
            className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* About */}
        <div>
          <label htmlFor="about" className="block mb-2 font-medium text-gray-700">
            About the Lab
          </label>
          <textarea
            id="about"
            name="about"
            value={lab.about}
            onChange={handleChange}
            placeholder="Write about the lab"
            rows={5}
            className="w-full px-4 py-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`w-full py-3 font-semibold rounded-lg text-white transition-colors duration-200 ${
            isSaving
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ManageLabInfo;
