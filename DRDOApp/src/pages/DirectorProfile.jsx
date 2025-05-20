import { useEffect, useState } from "react";
import axios from "axios";

const apiUri = import.meta.env.VITE_API_URL;

const DirectorProfile = () => {
  const [director, setDirector] = useState(null);
  const [about, setAbout] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editMode, setEditMode] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const response = await axios.get(
          `${apiUri}/api/labs/68281329c79492a7cf984910`
        );

        // The response contains multiple directors - pick the currently serving one
        // currently serving director has `to` == null or future date
        const directors = response.data.directors || [];

        const currentDirector =
          directors.find(
            (d) => !d.to || new Date(d.to) > new Date()
          ) || directors[0] || null;

        setDirector(currentDirector);
        setAbout(response.data.about);
      } catch (error) {
        console.error("Error fetching lab info:", error);
      }
    };

    fetchLab();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
    setEditAbout(about);
  };

  const handleSaveAbout = async () => {
    try {
      await axios.put(
        `${apiUri}/api/labs/68281329c79492a7cf984910/about`,
        { about: editAbout },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAbout(editAbout);
      setEditMode(false);
      alert("About section updated successfully!");
    } catch (error) {
      console.error("Failed to update about section", error);
      alert("Update failed.");
    }
  };

  if (!director) {
    return <div className="text-center mt-10">Loading director profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#003168] mb-4">
        Director Profile
      </h1>
      <div className="flex flex-col md:flex-row items-start gap-6">
        {director.image && (
          <img
            src={`${apiUri}${director.image}`}
            alt="Director"
            className="w-48 h-56 object-cover rounded-lg shadow-lg"
          />
        )}
        <div>
          <p className="text-lg text-gray-700 mb-2">
            👨‍🔬 <strong>Name:</strong> {director.user.name || "N/A"}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            🏢 <strong>Designation:</strong> {director.designation || "Director, CFEES"}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            📅 <strong>Serving From:</strong> {new Date(director.from).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Serving To:</strong>{" "}
            {director.to ? new Date(director.to).toLocaleDateString() : "Present"}
          </p>

          {editMode ? (
            <div className="mt-4">
              <label className="block font-medium text-[#003168] mb-1">
                About:
              </label>
              <textarea
                value={editAbout}
                onChange={(e) => setEditAbout(e.target.value)}
                className="w-full p-2 border rounded-md"
                rows={5}
              />
              <div className="mt-3 flex gap-3">
                <button
                  onClick={handleSaveAbout}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-md text-gray-600 mt-4">
              <strong>About:</strong> {about || "No information provided yet."}
            </p>
          )}

          {!editMode && (
            <button
              onClick={handleEditClick}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit About
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorProfile;
