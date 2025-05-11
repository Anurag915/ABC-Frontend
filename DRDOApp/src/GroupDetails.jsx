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
useEffect(() => {
  const role = window.localStorage.getItem("role") || "guest";
  setUser({ role });
  setIsAuthorized(role === "admin");
}, []);

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
      setGroup(res.data.group); // Refresh group
      setUploadData({ type: "project", name: "", description: "", file: null });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  const renderFileListSection = (title, items, emptyText) => (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      {items?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id || item.name}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-5"
            >
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                {item.description || "No description provided"}
              </p>
              <a
                href={`${apiUrl}${item.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md shadow hover:opacity-90 transition"
              >
                View Uploaded Document
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">{emptyText}</p>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto">
        {group ? (
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <header className="border-b pb-6 mb-6">
              <h1 className="text-4xl font-extrabold text-blue-900 mb-2">
                {group.name}
              </h1>
              <p className="text-gray-700 text-lg">{group.description}</p>
            </header>

            {group.employees?.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Employees
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.employees.map((emp) => (
                    <div
                      key={emp._id || emp.email}
                      className="bg-white border border-gray-200 rounded-xl shadow p-5"
                    >
                      <h3 className="text-lg font-semibold text-blue-800 mb-2">
                        {emp.name || "No Name Available"}
                      </h3>
                      <p className="text-gray-600">
                        {emp.email || "No Email Available"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {renderFileListSection(
              "Projects",
              group.projects,
              "No projects listed"
            )}
            {renderFileListSection(
              "Technologies Developed",
              group.technologies,
              "No technologies listed"
            )}
            {renderFileListSection(
              "Patents",
              group.patents,
              "No patents listed"
            )}
            {renderFileListSection(
              "Publications",
              group.publications,
              "No publications listed"
            )}
            {renderFileListSection(
              "Courses Conducted",
              group.courses,
              "No courses listed"
            )}

            {isAuthorized && (
              <>
                {/* Upload Form */}
                <section className="mt-10 border-t pt-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Upload Document
                  </h2>
                  <form
                    onSubmit={handleUploadSubmit}
                    className="grid gap-4 max-w-2xl"
                  >
                    <select
                      name="type"
                      value={uploadData.type}
                      onChange={handleUploadChange}
                      className="p-2 border rounded"
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
                      className="p-2 border rounded"
                      required
                    />

                    <textarea
                      name="description"
                      placeholder="Description"
                      value={uploadData.description}
                      onChange={handleUploadChange}
                      className="p-2 border rounded"
                    />

                    <input
                      type="file"
                      name="file"
                      onChange={handleUploadChange}
                      className="p-2"
                      required
                    />

                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Upload
                    </button>
                  </form>
                </section>

                {/* Edit/Delete Buttons */}
                {isAuthorized && (
                  <div className="mt-12 pt-6 border-t flex justify-end gap-4">
                    <button
                      onClick={() => navigate(`/groups/${id}/edit`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg shadow"
                    >
                      Edit Group
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg shadow"
                    >
                      Delete Group
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        )}
      </main>
    </div>
  );
};

export default GroupDetails;
