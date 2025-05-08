import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
const apiUrl = import.meta.env.VITE_API_URL;
const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState({ role: "admin" }); // TODO: Replace with real auth

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/groups/${id}`)
      .then((res) => {
        setGroup(res.data);
        if (user.role === "admin") setIsAuthorized(true);
      })
      .catch((err) => console.error("Error fetching group details", err));
  }, [id, user]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      try {
        await axios.delete(`${apiUrl}/api/groups/${id}`);
        alert("Group deleted successfully");
        navigate("/");
      } catch (err) {
        alert("Error deleting group");
        console.error(err);
      }
    }
  };

  const renderListSection = (title, items, renderItem, emptyText) => (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <ul className="space-y-3">
        {items.length > 0 ? (
          items.map(renderItem)
        ) : (
          <li className="text-gray-500 italic">{emptyText}</li>
        )}
      </ul>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-10 max-w-5xl mx-auto">
        {group ? (
          <div className="bg-white shadow-lg rounded-xl p-8">
            <header className="border-b pb-6 mb-6">
              <h1 className="text-4xl font-bold text-blue-900 mb-2">
                {group.name}
              </h1>
              <p className="text-gray-700">{group.description}</p>
            </header>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Lab Info
              </h2>
              <p className="text-gray-600">
                {group.labId?.name || "No lab information available"}
              </p>
            </section>

            {renderListSection(
              "Employees",
              group.employees,
              (emp) => <li key={emp._id} className="text-gray-700">{emp.name || emp.email}</li>,
              "No employees listed"
            )}

            {renderListSection(
              "Projects",
              group.projects,
              (proj) => (
                <li key={proj._id} className="text-gray-700">
                  <span className="font-medium">{proj.title}</span> (
                  {proj.startDate?.slice(0, 10)} - {proj.endDate?.slice(0, 10)})
                </li>
              ),
              "No projects listed"
            )}

            {renderListSection(
              "Technologies Developed",
              group.technologiesDeveloped,
              (tech) => (
                <li key={tech._id}>
                  <p className="font-medium text-gray-800">{tech.name}</p>
                  <p className="text-gray-600 text-sm">
                    {tech.description || "No description"}
                    <br />
                    Developed Date:{" "}
                    {tech.developedDate
                      ? new Date(tech.developedDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </li>
              ),
              "No technologies listed"
            )}

            {renderListSection(
              "Patents",
              group.patents,
              (patent) => (
                <li key={patent._id}>
                  <p className="font-medium text-gray-800">{patent.title}</p>
                  <p className="text-gray-600 text-sm">
                    Inventor: {patent.inventor || "N/A"}
                    <br />
                    Filing Date:{" "}
                    {patent.filingDate
                      ? new Date(patent.filingDate).toLocaleDateString()
                      : "N/A"}
                    <br />
                    Patent Number: {patent.patentNumber || "N/A"}
                  </p>
                </li>
              ),
              "No patents listed"
            )}

            {renderListSection(
              "Publications",
              group.publications,
              (pub) => (
                <li key={pub._id}>
                  <p className="font-medium text-gray-800">{pub.title}</p>
                  <p className="text-gray-600 text-sm">
                    Author: {pub.author || "N/A"}
                    <br />
                    Published Date:{" "}
                    {pub.publishedDate
                      ? new Date(pub.publishedDate).toLocaleDateString()
                      : "N/A"}
                    <br />
                    Journal: {pub.journal || "N/A"}
                  </p>
                </li>
              ),
              "No publications listed"
            )}

            {renderListSection(
              "Courses Conducted",
              group.coursesConducted,
              (course) => (
                <li key={course._id}>
                  <p className="font-medium text-gray-800">{course.title}</p>
                  <p className="text-gray-600 text-sm">
                    {course.description || "No description"}
                    <br />
                    Instructor: {course.instructor || "N/A"}
                    <br />
                    Duration:{" "}
                    {course.startDate
                      ? new Date(course.startDate).toLocaleDateString()
                      : "N/A"}{" "}
                    -{" "}
                    {course.endDate
                      ? new Date(course.endDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </li>
              ),
              "No courses listed"
            )}

            {isAuthorized && (
              <div className="mt-10 border-t pt-6 flex justify-end gap-4">
                <button
                  onClick={() => alert("TODO: Implement Edit Modal")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg"
                >
                  Edit Group
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg"
                >
                  Delete Group
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default GroupDetails;
