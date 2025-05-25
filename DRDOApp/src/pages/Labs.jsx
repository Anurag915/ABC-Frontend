import React, { useEffect, useState } from "react";
import {
  Cpu,
  BookOpen,
  ClipboardList,
  Grid,
  Users,
  Award,
  Info,
  Bell,
  Megaphone,
  PackageOpen,
  Mail,
} from "lucide-react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const labId = "6831e91d804bf498865b819d";

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-100 rounded-full mr-3">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3 text-gray-700 text-sm">{children}</div>
    </div>
  );
}

export default function LabDetails() {
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/api/labs/${labId}`)
      .then((res) => res.json())
      .then((data) => {
        // data is a single object, not an array
        setLab(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch lab data:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-transparent" />
      </div>
    );

  if (!lab)
    return (
      <p className="text-center text-gray-500 mt-12">No lab data found.</p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 py-12 space-y-12">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">{lab.name}</h1>
        {lab.logo && (
          <img
            src={`${apiUrl}${lab.logo}`}
            alt={`${lab.name} Logo`}
            className="mx-auto h-24 w-24 object-contain"
          />
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Grid} title="Overview">
          <p><strong>Domain:</strong> {lab.domain || "N/A"}</p>
          <p><strong>Vision:</strong> {lab.vision || "N/A"}</p>
          <p><strong>Mission:</strong> {lab.mission || "N/A"}</p>
          <p>{lab.about || "No description available."}</p>
        </Section>

        <Section icon={Mail} title="Contact Info">
          {lab.contactInfo?.length === 0 ? (
            <p className="text-gray-500">No contact info available.</p>
          ) : (
            <ul className="space-y-2">
              {lab.contactInfo?.map((info, idx) => (
                <li key={idx} className="flex">
                  <span className="font-medium w-24">{info.type}</span>
                  <span className="flex-1 text-gray-700">
                    {info.label ? `${info.label}: ` : ""}
                    {info.value}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Users} title="Director History">
          {lab.directorHistory?.length === 0 ? (
            <p className="text-gray-500">No director history available.</p>
          ) : (
            lab.directorHistory.map((dir) => {
              const name = dir.user ? dir.user.name : dir.name;
              const email = dir.user ? dir.user.email : null;
              return (
                <div key={dir._id} className="mb-6 border-b border-gray-200 pb-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-1">{name}</h4>
                  <p className="text-gray-600 mb-1">{dir.designation}</p>
                  <p className="text-sm text-gray-500">
                    From {new Date(dir.from).toLocaleDateString()} to {dir.to ? new Date(dir.to).toLocaleDateString() : "Present"}
                  </p>
                  {email && <p className="text-sm text-gray-500">Email: {email}</p>}
                </div>
              );
            })
          )}
        </Section>

        <Section icon={Users} title="Current Director">
          {lab.currentDirector ? (
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-1">{lab.currentDirector.name}</h4>
              <p className="text-gray-600 mb-1">Role: {lab.currentDirector.role || "N/A"}</p>
              {/* <p className="text-sm text-gray-500">
                Employment Period:{" "}
                {new Date(lab.currentDirector.employmentPeriod.from).toLocaleDateString()} to{" "}
                {lab.currentDirector.employmentPeriod.to ? new Date(lab.currentDirector.employmentPeriod.to).toLocaleDateString() : "Present"}
              </p> */}
              {lab.currentDirector.email && <p className="text-sm text-gray-500">Email: {lab.currentDirector.email}</p>}
              {lab.currentDirector.photo && (
                <img
                  src={`${apiUrl}${lab.currentDirector.photo}`}
                  alt={`${lab.currentDirector.name} Photo`}
                  className="mt-2 h-24 w-24 rounded-full object-cover"
                />
              )}
              {lab.currentDirector.about && <p className="mt-2 text-gray-700">{lab.currentDirector.about}</p>}
            </div>
          ) : (
            <p className="text-gray-500">No current director info available.</p>
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={ClipboardList} title="Manpower">
          {lab.manpowerList?.length === 0 ? (
            <p className="text-gray-500">No manpower info available.</p>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {lab.manpowerList?.map((person) => (
                <li key={person._id}>
                  <span className="font-medium">{person.name}</span> –{" "}
                  <span className="text-gray-600">{person.role}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section icon={Cpu} title="Technologies Developed">
          {lab.technologiesDeveloped?.length === 0 ? (
            <p className="text-gray-500">No technologies developed.</p>
          ) : (
            lab.technologiesDeveloped?.map((tech) => (
              <div key={tech._id} className="mb-4">
                <p className="font-semibold">{tech.name}</p>
                <p className="text-gray-700 mb-1">{tech.description}</p>
                <p className="text-sm text-gray-500">
                  Developed on {new Date(tech.developedDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={BookOpen} title="Courses Conducted">
          {lab.courses?.length === 0 ? (
            <p className="text-gray-500">No courses conducted.</p>
          ) : (
            lab.courses?.map((course) => (
              <div key={course._id} className="mb-4">
                <p className="font-semibold">{course.title}</p>
                <p className="text-gray-700 mb-1">{course.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(course.startDate).toLocaleDateString()} to{" "}
                  {new Date(course.endDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </Section>
      </div>

      <Section icon={ClipboardList} title="Projects">
        {lab.projects?.length === 0 ? (
          <p className="text-gray-500">No projects available.</p>
        ) : (
          lab.projects?.map((proj) => (
            <div key={proj._id} className="mb-6 border-b border-gray-200 pb-4">
              <p className="font-semibold">{proj.title}</p>
              <p className="text-gray-700 mb-1">{proj.description}</p>
              <p className="text-sm text-gray-500">
                Duration: {new Date(proj.startDate).toLocaleDateString()} to{" "}
                {new Date(proj.endDate).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Award} title="Publications">
          {lab.publications?.length === 0 ? (
            <p className="text-gray-500">No publications available.</p>
          ) : (
            lab.publications?.map((pub) => (
              <div key={pub._id} className="mb-4">
                <p className="font-semibold">{pub.title}</p>
                <p className="text-gray-700 mb-1">{pub.description}</p>
                <p className="text-sm text-gray-500">
                  Published on {new Date(pub.publishedDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </Section>

        <Section icon={PackageOpen} title="Patents">
          {lab.patents?.length === 0 ? (
            <p className="text-gray-500">No patents available.</p>
          ) : (
            lab.patents?.map((patent) => (
              <div key={patent._id} className="mb-4">
                <p className="font-semibold">{patent.title}</p>
                <p className="text-gray-700 mb-1">{patent.description}</p>
                <p className="text-sm text-gray-500">
                  Filed on {new Date(patent.filingDate).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Bell} title="Notices">
          {lab.notices?.length === 0 ? (
            <p className="text-gray-500">No notices available.</p>
          ) : (
            lab.notices?.map((notice) => (
              <div key={notice._id} className="mb-4">
                <p className="font-semibold">{notice.title}</p>
                <p className="text-gray-700 mb-1">{notice.description}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(notice.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </Section>

        <Section icon={Megaphone} title="Circulars">
          {lab.circulars?.length === 0 ? (
            <p className="text-gray-500">No circulars available.</p>
          ) : (
            lab.circulars?.map((circular) => (
              <div key={circular._id} className="mb-4">
                <p className="font-semibold">{circular.title}</p>
                <p className="text-gray-700 mb-1">{circular.description}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(circular.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </Section>
      </div>

      <Section icon={ClipboardList} title="Advertisements">
        {lab.advertisements?.length === 0 ? (
          <p className="text-gray-500">No advertisements available.</p>
        ) : (
          lab.advertisements?.map((ad) => (
            <div key={ad._id} className="mb-4">
              <p className="font-semibold">{ad.title}</p>
              <p className="text-gray-700 mb-1">{ad.description}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(ad.date).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </Section>

      <Section icon={Users} title="Groups">
        {lab.groups?.length === 0 ? (
          <p className="text-gray-500">No groups available.</p>
        ) : (
          lab.groups?.map((group) => (
            <div key={group._id} className="mb-4">
              <p className="font-semibold">{group.name}</p>
              <p className="text-gray-700">{group.description}</p>
            </div>
          ))
        )}
      </Section>

      {lab.website && (
        <p className="mt-8 text-center text-blue-600">
          <a href={lab.website} target="_blank" rel="noopener noreferrer">
            Visit Official Website
          </a>
        </p>
      )}
    </div>
  );
}
