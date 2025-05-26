import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const GroupAD = ({ groupId }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  //   const groupId = groupId;

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/groups/${groupId}`);
        setGroup(res.data);
      } catch (err) {
        console.error("Failed to fetch group:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!group) return <p>Group not found.</p>;

  const ad = group.ad;

  return (
    <div className="p-4  mx-auto">
      <h2 className="text-2xl font-bold mb-4">{group.name}</h2>
      <p className="mb-4">{group.description}</p>

      <h3 className="text-xl font-semibold mt-6">Assistant Director</h3>
      {ad ? (
        <div className="border p-4 rounded shadow mt-2 flex items-start gap-4">
          {ad.photo ? (
            <img
              src={`${apiUrl}${ad.photo}`}
              alt="Profile"
              className="w-32 h-40 object-cover rounded-xl shadow-md"
            />
          ) : (
            <div className="w-32 h-40 flex items-center justify-center rounded-xl bg-gray-200 text-gray-600 shadow-md text-sm">
              No Photo
            </div>
          )}
          <div>
            <p>
              <strong>Name:</strong> {ad.name}
            </p>
            <p>
              <strong>Email:</strong> {ad.email}
            </p>
            {ad.about && (
              <p className="mt-2">
                <strong>About:</strong> {ad.about}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p>No Assistant Director assigned.</p>
      )}
    </div>
  );
};

export default GroupAD;
