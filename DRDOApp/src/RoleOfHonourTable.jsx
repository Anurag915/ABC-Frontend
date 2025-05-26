import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

function RoleOfHonourTable({ labId }) {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/labs/${labId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lab data");
        return res.json();
      })
      .then((data) => {
        setDirectors(data.directorHistory || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [labId]);

  if (loading) return <p>Loading Role of Honour...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-blue-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            {/* <th className="border border-gray-300 px-4 py-2 text-left">Designation</th> */}
            <th className="border border-gray-300 px-4 py-2 text-left">From</th>
            <th className="border border-gray-300 px-4 py-2 text-left">To</th>
          </tr>
        </thead>
        <tbody>
          {directors.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">No data available</td>
            </tr>
          ) : (
            directors.map((director, index) => {
              const name = director.name || director.user?.name || "N/A";
              return (
                <tr key={director._id || index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{name}</td>
                  {/* <td className="border border-gray-300 px-4 py-2">{director.designation || "N/A"}</td> */}
                  <td className="border border-gray-300 px-4 py-2">
                    {director.from ? new Date(director.from).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {director.to ? new Date(director.to).toLocaleDateString() : "Present"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RoleOfHonourTable;
