import { useState } from "react";
import AboutGroup from "./AboutGroup";
import { useParams } from "react-router-dom";
import VisionMissionGroup from "./VisionMissionGroup";
import GroupAD from "./GroupAD";
import ContactInfoGroup from "./ContactInfoGroup";
import GroupProducts from "./GroupProducts";
import GroupNoticesCirculars from "./GroupNoticesCirculars";
import GroupEmployees from "./GroupEmployees";
import AssistantDirectorsTable from "./AssistantDirectorsTable";
import GroupHistory from "./GroupHistory";
const sections = [
  "About Group",
  "Vision and Mission",
  "Group Leader Profile",
  "O/o Group Leader",
  "Role & Honour",
  "Group History",
  "Members",
  "Notices & Circular",
  "Product & Advertisement",
  "Contact Us",
];

function GroupPage() {
  const { id } = useParams(); // fetch groupId from URL
  const [selectedSection, setSelectedSection] = useState("About Group");

  const renderContent = () => {
    switch (selectedSection) {
      case "About Group":
        return <AboutGroup groupId={id} />;
      case "Vision and Mission":
        return <VisionMissionGroup groupId={id} />;

      case "Group Leader Profile":
        return <GroupAD groupId={id} />;
      case "O/o Group Leader":
        return (
          <p>
            The Office of the Group Leader oversees operations, strategic
            direction, and collaborative efforts within the group.
          </p>
        );
      case "Role & Honour":
        return <AssistantDirectorsTable groupId={id} />;
      case "Group History":
        return <GroupHistory groupId={id}/>;
      case "Members":
        return <GroupEmployees groupId={id}/>;
      case "Notices & Circular":
        return <GroupNoticesCirculars groupId={id}/>;
      case "Product & Advertisement":
        return <GroupProducts groupId={id} />;
      case "Contact Us":
        return <ContactInfoGroup groupId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className=" bg-gray-50 font-sans text-black mt-8">
      <main className="flex flex-col md:flex-row mx-auto shadow-lg rounded-lg bg-white">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-green-100 p-6 space-y-4 rounded-l-lg border-r border-green-300 shadow-inner">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                selectedSection === section
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-white text-green-800 hover:bg-green-300"
              }`}
              aria-current={selectedSection === section ? "page" : undefined}
            >
              {section}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-8 overflow-auto rounded-r-lg">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6 border-b border-green-300 pb-2">
            {selectedSection}
          </h2>
          <div className="text-gray-700 leading-relaxed">{renderContent()}</div>
        </section>
      </main>
    </div>
  );
}

export default GroupPage;
