import { useState } from "react";
import ManageLabInfo from "./pages/ManageLabInfo";
import ManageNoticesCirculars from "./ManageNoticesCirculars";

const adminSections = [
  "Manage Labs",
  "Manage Directors",
  "Manage Notices & Circulars",
  "Manage Products & Advertisements",
  "Manage Users",
];

function AdminPanel() {
  const [selectedSection, setSelectedSection] = useState("Manage Labs");

  const renderAdminContent = () => {
    switch (selectedSection) {
      case "Manage Labs":
        return <ManageLabInfo/>;
      case "Manage Directors":
        return (
          <div>
            <p className="mb-2">Manage current and former directors of the lab.</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Add new director profiles</li>
              <li>Edit director contact information</li>
              <li>Assign directors to multiple labs if needed</li>
            </ul>
          </div>
        );
      case "Manage Notices & Circulars":
        return <ManageNoticesCirculars/>;
      case "Manage Products & Advertisements":
        return (
          <div>
            <p className="mb-2">List and promote lab-developed products and their related advertisements.</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Add new products with descriptions and images</li>
              <li>Update advertisements and promotional banners</li>
            </ul>
          </div>
        );
      case "Manage Users":
        return (
          <div>
            <p className="mb-2">Control user access and roles in the system.</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>View all registered users</li>
              <li>Assign roles: Admin, Employee, Viewer</li>
              <li>Reset passwords or remove inactive accounts</li>
            </ul>
          </div>
        );
      default:
        return <p>Select a section to manage.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-black mt-8">
      <main className="flex flex-col md:flex-row max-w-7xl mx-auto shadow-lg rounded-lg bg-white">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-blue-100 p-6 space-y-4 rounded-l-lg border-r border-blue-300 shadow-inner">
          {adminSections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedSection === section
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-blue-800 hover:bg-blue-300"
              }`}
              aria-current={selectedSection === section ? "page" : undefined}
            >
              {section}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-8 overflow-auto rounded-r-lg">
          <h2 className="text-3xl font-extrabold text-blue-700 mb-6 border-b border-blue-300 pb-2">
            {selectedSection}
          </h2>
          <div className="text-gray-700 leading-relaxed">{renderAdminContent()}</div>
        </section>
      </main>
    </div>
  );
}

export default AdminPanel;
