import { useEffect, useState } from "react";
import axios from "axios";
import { FileText } from "lucide-react";

const apiUri = import.meta.env.VITE_API_URL;
// ...imports remain the same
const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAbout, setEditAbout] = useState(""); // 🆕 New state for about
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`${apiUri}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Select a photo first");

    const formData = new FormData();
    formData.append("photo", photo);

    try {
      const res = await fetch(`${apiUri}/api/users/${user._id}/upload-photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Photo updated!");
        setUser((prev) => ({ ...prev, photo: data.photo }));
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("Photo upload error", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAbout(user.about || ""); // 🆕 Set about value
  };

  const handleSaveProfile = async () => {
    try {
      const res = await axios.put(
        `${apiUri}/api/users/${user._id}`,
        {
          name: editName,
          email: editEmail,
          about: editAbout, // 🆕 Include about in update
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <div className="w-12 h-12 mx-auto border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className=" mx-auto px-4 py-10 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-bold text-[#003168] mb-1">
            Hello, {user.name}
          </h2>
          <p className="text-gray-500 text-lg">Welcome to your dashboard</p>
        </div>

        {user.photo ? (
          <img
            src={`${apiUri}${user.photo}`}
            alt="Profile"
            className="w-32 h-40 object-cover rounded-xl shadow-md"
          />
        ) : (
          <div className="w-32 h-40 flex items-center justify-center rounded-xl bg-gray-200 text-gray-600 shadow-md text-sm">
            No Photo
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* User Info */}
        <div className="bg-blue-50 p-6 rounded-xl shadow border border-blue-100">
          <h3 className="text-xl font-semibold text-[#003168] mb-4">
            👤 User Information
          </h3>
          <div className="space-y-3 text-gray-800">
            {editMode ? (
              <>
                <div>
                  <label className="block font-medium mb-1">Name:</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Email:</label>
                  <input
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">About:</label>
                  <textarea
                    rows={3}
                    value={editAbout}
                    onChange={(e) => setEditAbout(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md resize-none"
                  />
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>About:</strong>{" "}
                  {user.about ? user.about : "Not provided."}
                </p>
              </>
            )}

            <p>
              <strong>Role:</strong>{" "}
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                {user.role}
              </span>
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Account Summary */}
        <div className="bg-blue-50 p-6 rounded-xl shadow border border-blue-100">
          <h3 className="text-xl font-semibold text-[#003168] mb-4">
            📊 Account Summary
          </h3>
          <ul className="text-gray-700 space-y-3 text-base">
            <li>
              📄 <strong>Total Documents:</strong> {user.documents?.length || 0}
            </li>
          </ul>
        </div>
      </div>

      {/* Uploaded Documents */}
      <div className="bg-blue-50 p-6 rounded-xl shadow border border-blue-100 mb-10">
        <h3 className="text-xl font-semibold text-[#003168] mb-4">
          📁 Uploaded Documents
        </h3>
        {user.documents && user.documents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {user.documents.map((doc) => (
              <li key={doc._id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 text-blue-700">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <a
                    href={`${apiUri}${doc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {doc.filename}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-base">No documents uploaded yet.</p>
        )}
      </div>

      {/* Upload Photo */}
      <form
        onSubmit={handlePhotoUpload}
        className="bg-blue-50 p-6 rounded-xl shadow border border-blue-100 mb-6"
      >
        <label className="block font-medium mb-2 text-[#003168]">
          Update Profile Photo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="block w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Upload Photo
        </button>
      </form>

      {/* Edit Buttons */}
      {editMode ? (
        <div className="flex gap-4">
          <button
            onClick={handleSaveProfile}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={handleEditClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      )}
    </div>
  );
};

export default Profile;

