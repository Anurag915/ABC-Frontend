import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
import axiosInstance from "./axiosInstance";

function VisionMissionGroup({ groupId }) {
  const [group, setGroup] = useState(null);
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
  if (!group)
    return (
      <div className="text-center text-gray-500 py-10 text-lg font-medium">
        Loading vision and mission...
      </div>
    );

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-3xl font-bold text-green-800 mb-6">
        Vision and Mission
      </h2>
      <section className="mb-6">
        <h3 className="text-xl font-semibold text-green-700 mb-2">Vision</h3>
        <p className="text-gray-700 leading-relaxed">
          {group.vision || "Vision statement not available."}
        </p>
      </section>
      <section>
        <h3 className="text-xl font-semibold text-green-700 mb-2">Mission</h3>
        <p className="text-gray-700 leading-relaxed">
          {group.mission || "Mission statement not available."}
        </p>
      </section>
    </div>
  );
}

export default VisionMissionGroup;
