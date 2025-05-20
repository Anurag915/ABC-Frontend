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

// Reusable section card
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
    fetch(`${apiUrl}/api/labs/`)
      .then((res) => res.json())
      .then((data) => {
        setLab(data[0]);
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
      {/* Header */}
      <header className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">
          {lab.name}
        </h1>
        {lab.logo && (
          <img
            src={`${apiUrl}${lab.logo}`}
            alt={`${lab.name} Logo`}
            className="mx-auto h-24 w-24 object-contain"
          />
        )}
      </header>

      {/* Overview & Contact in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Grid} title="Overview">
          <p><span className="font-semibold">Domain:</span> {lab.domain}</p>
          <p><span className="font-semibold">Vision:</span> {lab.vision}</p>
          <p><span className="font-semibold">Mission:</span> {lab.mission}</p>
          <p>{lab.about}</p>
        </Section>

        <Section icon={Mail} title="Contact Info">
          <ul className="list-none space-y-2">
            {lab.contactInfo.map((info, idx) => (
              <li key={idx} className="flex">
                <span className="font-medium w-24">{info.type}</span>
                <span className="flex-1 text-gray-700">
                  {info.label ? `${info.label}: ` : ""}{info.value}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Directors & Manpower */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Users} title="Directors">
          {lab.directors.map((dir) => (
            <div key={dir._id} className="mb-6 border-b border-gray-200 pb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-1">
                {dir.name || dir.user.email}
              </h4>
              <p className="text-gray-600 mb-1">{dir.designation}</p>
              <p className="text-sm text-gray-500">
                From {new Date(dir.from).toLocaleDateString()} to{' '}
                {dir.to
                  ? new Date(dir.to).toLocaleDateString()
                  : 'Present'}
              </p>
            </div>
          ))}
        </Section>

        <Section icon={ClipboardList} title="Manpower">
          <ul className="list-disc list-inside space-y-2">
            {lab.manpowerList.map((person) => (
              <li key={person._id} className="flex">
                <span className="font-medium flex-1">{person.name}</span>
                <span className="text-gray-600">{person.role}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Technologies & Courses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Cpu} title="Technologies Developed">
          {lab.technologiesDeveloped.map((tech) => (
            <div key={tech._id} className="mb-4">
              <p className="font-semibold">{tech.name}</p>
              <p className="text-gray-700 mb-1">{tech.description}</p>
              <p className="text-sm text-gray-500">
                Developed on {new Date(tech.developedDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </Section>

        <Section icon={BookOpen} title="Courses Conducted">
          {lab.courses.map((course) => (
            <div key={course._id} className="mb-4">
              <p className="font-semibold">{course.title}</p>
              <p className="text-gray-700 mb-1">{course.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(course.startDate).toLocaleDateString()} to{' '}
                {new Date(course.endDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </Section>
      </div>

      {/* Projects */}
      <Section icon={ClipboardList} title="Projects">
        {lab.projects.map((proj) => (
          <div key={proj._id} className="mb-6 border-b border-gray-200 pb-4">
            <p className="font-semibold text-gray-800">{proj.title}</p>
            <p className="text-gray-700 mb-1">{proj.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(proj.startDate).toLocaleDateString()} to{' '}
              {new Date(proj.endDate).toLocaleDateString()} —{' '}
              <span className="italic">{proj.status}</span>
            </p>
          </div>
        ))}
      </Section>

      {/* Publications & Patents */}
      <Section icon={Award} title="Publications & Patents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Publications</h4>
            <ul className="list-decimal list-inside space-y-2">
              {lab.publications.map((pub) => (
                <li key={pub._id}>
                  <p className="font-medium">{pub.title}</p>
                  <p className="text-sm text-gray-600">
                    {pub.author} — {new Date(pub.publishedDate).toLocaleDateString()} in {pub.journal}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Patents</h4>
            <ul className="list-decimal list-inside space-y-2">
              {lab.patents.map((pat) => (
                <li key={pat._id}>
                  <p className="font-medium">{pat.title}</p>
                  <p className="text-sm text-gray-600">
                    Filed on {new Date(pat.filingDate).toLocaleDateString()} — No: {pat.patentNumber}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Notices, Circulars, Ads, Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: "notices", icon: Info, title: "Notices" },
          { key: "circulars", icon: Bell, title: "Circulars" },
          { key: "advertisements", icon: Megaphone, title: "Advertisements" },
          { key: "products", icon: PackageOpen, title: "Products" },
        ].map(({ key, icon, title }) => (
          <Section key={key} icon={icon} title={title}>
            {lab[key].length === 0 ? (
              <p className="text-sm text-gray-500">No items available.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {lab[key].map((item) => (
                  <li key={item._id}>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-700 mb-1">{item.description}</p>
                    <a
                      href={`${apiUrl}${item.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Document
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        ))}
      </div>
    </div>
  );
}