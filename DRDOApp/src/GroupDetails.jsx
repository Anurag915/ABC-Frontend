import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [uploadData, setUploadData] = useState({
    type: "project",
    name: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    try {
      const storedUser = JSON.parse(window.localStorage.getItem("user"));
      const parsedUser = storedUser || { role: "guest" };
      setUser(parsedUser);
      setIsAuthorized(parsedUser.role === "admin");
    } catch (err) {
      setUser({ role: "guest" });
      setIsAuthorized(false);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/groups/${id}`)
      .then((res) => setGroup(res.data))
      .catch((err) => console.error("Error fetching group details", err));
  }, [id]);

  const handleDeleteDocument = async (docId, type) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const token = window.localStorage.getItem("token");
        await axios.delete(
          `${apiUrl}/api/groups/${id}/delete-document/${docId}?type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: { type },
          }
        );
        alert("Document deleted successfully!");
        setGroup((prevGroup) => ({
          ...prevGroup,
          [type]: prevGroup[type].filter((doc) => doc._id !== docId),
        }));
      } catch (err) {
        console.error("Delete document error:", err);
        alert("Error deleting document");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        const token = window.localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Group deleted successfully");
        navigate("/");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Error deleting group");
      }
    }
  };

  const handleUploadChange = (e) => {
    const { name, value, files } = e.target;
    setUploadData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("type", uploadData.type);
    formData.append("name", uploadData.name);
    formData.append("description", uploadData.description);

    try {
      const res = await axios.post(
        `${apiUrl}/api/groups/${id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Upload successful!");
      setGroup(res.data.group);
      setUploadData({ type: "project", name: "", description: "", file: null });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const renderFileListSection = (title, items, emptyText, type) => (
    <section className="mt-16 text-center">
      <h2 className="text-3xl font-semibold text-blue-700 mb-6 border-b pb-2 inline-block border-blue-400">
        {title}
      </h2>
      {items?.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {items.map((item) => (
            <div
              key={item._id || item.name}
              className="bg-gradient-to-tr from-white via-slate-50 to-teal-50 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            >
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {item.description || "No description provided"}
              </p>
              <a
                href={`${apiUrl}${item.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-blue-600 text-white px-4 py-2 rounded-md font-medium shadow hover:opacity-90"
              >
                View Document
              </a>
              {isAuthorized && (
                <button
                  onClick={() => handleDeleteDocument(item._id, type)}
                  className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic mt-4">{emptyText}</p>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <main className="max-w-7xl mx-auto px-6 py-12">
        {group ? (
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <header className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-blue-800 mb-3">
                {group.name}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                {group.description}
              </p>

              {group.vision && (
                <div className="mb-4">
                  <h3 className="text-2xl font-semibold text-blue-700">
                    Vision
                  </h3>
                  <p className="text-gray-700">{group.vision}</p>
                </div>
              )}

              {group.mission && (
                <div>
                  <h3 className="text-2xl font-semibold text-blue-700 mt-6">
                    Mission
                  </h3>
                  <p className="text-gray-700">{group.mission}</p>
                </div>
              )}
            </header>

            {renderFileListSection(
              "Projects",
              group.projects,
              "No projects listed",
              "projects"
            )}
            {renderFileListSection(
              "Technologies Developed",
              group.technologies,
              "No technologies listed",
              "technologies"
            )}
            {renderFileListSection(
              "Patents",
              group.patents,
              "No patents listed",
              "patents"
            )}
            {renderFileListSection(
              "Publications",
              group.publications,
              "No publications listed",
              "publications"
            )}
            {renderFileListSection(
              "Courses Conducted",
              group.courses,
              "No courses listed",
              "courses"
            )}

            {isAuthorized && (
              <section className="mt-24 text-center">
                <h2 className="text-3xl font-semibold text-blue-700 mb-6">
                  Upload New Document
                </h2>

                <form
                  onSubmit={handleUploadSubmit}
                  className="bg-white p-8 rounded-xl shadow-lg space-y-4 max-w-xl mx-auto border border-gray-200"
                >
                  <select
                    name="type"
                    value={uploadData.type}
                    onChange={handleUploadChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="project">Project</option>
                    <option value="patent">Patent</option>
                    <option value="technology">Technology</option>
                    <option value="publication">Publication</option>
                    <option value="course">Course</option>
                  </select>

                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={uploadData.name}
                    onChange={handleUploadChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <textarea
                    name="description"
                    placeholder="Description"
                    value={uploadData.description}
                    onChange={handleUploadChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />

                  <input
                    type="file"
                    name="file"
                    onChange={handleUploadChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                  >
                    Upload Document
                  </button>
                </form>
              </section>
            )}

            {isAuthorized && (
              <div className="mt-16 pt-10 border-t border-gray-300 flex justify-end space-x-4">
                <button
                  onClick={() => navigate(`/groups/${id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow"
                >
                  Edit Group
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg shadow"
                >
                  Delete Group
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-xl font-medium">
            Loading...
          </div>
        )}
      </main>
    </div>
  );
};

export default GroupDetails;
