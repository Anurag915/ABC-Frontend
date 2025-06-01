import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
import axiosInstance from "./axiosInstance";

const token = localStorage.getItem("token");

function AboutGroup({ groupId }) {
  const [group, setGroup] = useState(null);

//   useEffect(() => {
//   fetch(`${apiUrl}/api/groups/id/${groupId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Failed to fetch group");
//       }
//       return res.json();
//     })
//     .then((data) => setGroup(data))
//     .catch((err) => {
//       console.error("Error fetching group:", err);
//     });
// }, [groupId]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axiosInstance.get(`/api/groups/id/${groupId}`);
        setGroup(res.data);
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };

    fetchGroup();
  }, [groupId]);
  //   const fetchGroup = async () => {
  //     try {
  //       const res = await axiosInstance.get(`${apiUr}/api/groups/id/${groupId}`);
  //       setGroup(res.data);
  //     } catch (err) {
  //       console.error("Error fetching group:", err);
  //     }
  //   };

  //   fetchGroup();
  // }, []);
  const renderPoints = (text) => {
    if (!text) return ["No information available."];
    return text
      .split(/\n|•|-/)
      .map((point) => point.trim())
      .filter((point) => point.length > 0);
  };

  if (!group)
    return (
      <div className="text-center text-gray-500 py-10 text-lg font-medium">
        Loading group details...
      </div>
    );

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h1 className="text-4xl font-bold text-green-800 mb-4">{group.name}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-2">
          About the Group
        </h2>
        <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-1">
          {renderPoints(group.about).map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      {group.description && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Description
          </h2>
          <ul className="list-disc pl-6 text-gray-700 leading-relaxed space-y-1">
            {renderPoints(group.description).map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default AboutGroup;
