import React, { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

function NC({ labId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${apiUrl}/api/labs/${labId}`);
        if (!res.ok) throw new Error("Failed to fetch lab data");
        const lab = await res.json();
        const combined = [
          ...(lab.notices || []).map((item) => ({ ...item, type: "Notice" })),
          ...(lab.circulars || []).map((item) => ({
            ...item,
            type: "Circular",
          })),
        ];
        setItems(combined);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [labId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-white">
        <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">
          Notices & Circulars
        </h2>
        <div className="scroll-box">
          <div className="scroll-content">
            {items.map(({ _id, name, description, fileUrl, type }) => (
              <div key={_id} className="scroll-item">
                <span
                  className={`text-sm font-semibold mr-2 ${
                    type === "Notice" ? "text-blue-600" : "text-green-600"
                  }`}
                >
                  [{type}]
                </span>
                <a
                  href={`${apiUrl}${fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-600 hover:underline"
                >
                  {name}
                </a>
                <p className="text-gray-600 text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NC;
