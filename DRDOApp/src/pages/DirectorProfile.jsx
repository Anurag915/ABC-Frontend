import { useEffect, useState } from "react";
import axios from "axios";

const apiUri = import.meta.env.VITE_API_URL;

const DirectorProfile = () => {
  const [director, setDirector] = useState(null);
  const [about, setAbout] = useState("");
  const [editAbout, setEditAbout] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [addMode, setAddMode] = useState(false);
  const [newDirector, setNewDirector] = useState({ user: "", from: "", to: "" });

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // 'admin' if admin

  const labId = "6831e91d804bf498865b819d";

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const response = await axios.get(`${apiUri}/api/labs/${labId}`);
        const currentDirector = response.data.currentDirector || null;
        setDirector(currentDirector);
        setAbout(currentDirector?.about || response.data.about || "");
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
        `${apiUri}/api/labs/${labId}/about`,
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

  const handleAddDirector = async () => {
    try {
      await axios.post(
        `${apiUri}/api/labs/${labId}/directors`,
        newDirector,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("New director added.");
      setAddMode(false);
      setNewDirector({ user: "", from: "", to: "" });
      window.location.reload(); // Refresh to get new director
    } catch (error) {
      console.error("Error adding director", error);
      alert("Failed to add director.");
    }
  };

  if (!director) {
    return <div className="text-center mt-10">Loading director profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#003168] mb-4">Director Profile</h1>
      <div className="flex flex-col md:flex-row items-start gap-6">
        {director.photo && (
          <img
            src={`${apiUri}${director.photo}`}
            alt="Director"
            className="w-48 h-56 object-cover rounded-lg shadow-lg"
          />
        )}
        <div>
          <p className="text-lg text-gray-700 mb-2">
            👨‍🔬 <strong>Name:</strong> {director.name || "N/A"}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            🏢 <strong>Designation:</strong> Head of Robotics
          </p>
          <p className="text-lg text-gray-700 mb-2">
            📅 <strong>Serving From:</strong>{" "}
            {new Date(director.employmentPeriod?.from).toLocaleDateString()}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Serving To:</strong>{" "}
            {director.employmentPeriod?.to
              ? new Date(director.employmentPeriod.to).toLocaleDateString()
              : "Present"}
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

          {userRole === "admin" && (
            <div className="mt-6">
              {!addMode ? (
                <button
                  onClick={() => setAddMode(true)}
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Add New Director
                </button>
              ) : (
                <div className="mt-4 border p-4 rounded-md bg-gray-50">
                  <h3 className="text-lg font-semibold text-[#003168] mb-2">
                    Add Director
                  </h3>
                  <input
                    type="text"
                    placeholder="User ID"
                    value={newDirector.user}
                    onChange={(e) =>
                      setNewDirector({ ...newDirector, user: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <label className="block mb-1">From Date</label>
                  <input
                    type="date"
                    value={newDirector.from}
                    onChange={(e) =>
                      setNewDirector({ ...newDirector, from: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <label className="block mb-1">To Date (optional)</label>
                  <input
                    type="date"
                    value={newDirector.to}
                    onChange={(e) =>
                      setNewDirector({ ...newDirector, to: e.target.value })
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddDirector}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setAddMode(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectorProfile;
