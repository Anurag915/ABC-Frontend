import React, { useEffect, useState } from "react";
import {
  Cpu,
  BookOpen,
  ClipboardList,
  Grid,
  FileText,
  Users,
  Award,
} from "lucide-react";

function LabDetails() {
  const [lab, setLab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/labs/")
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
      <p className="text-center text-gray-500 mt-10">No lab data found.</p>
    );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition mb-8">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-blue-800">{title}</h2>
      </div>
      <div className="space-y-3 text-gray-700">{children}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">{lab.name}</h1>
        {lab.director.photo ? (
          <img
            src={`http://localhost:5000${lab.director.photo}`}
            alt={lab.director.name}
            className="object-cover rounded-md border-2 border-blue-100 shadow-md mt-4 md:mt-0"
            style={{ width: "218px", height: "291px" }}
          />
        ) : (
          <div
            className="flex items-center justify-center bg-gray-200 text-gray-500 shadow-md mt-4 md:mt-0 rounded-md border-2 border-dashed border-gray-300"
            style={{ width: "218px", height: "280px" }}
          >
            No Photo
          </div>
        )}
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section icon={Grid} title="Overview">
          <p>
            <span className="font-semibold">Domain:</span> {lab.domain}
          </p>
          <p>
            <span className="font-semibold">Vision:</span> {lab.vision}
          </p>
          <p>
            <span className="font-semibold">Mission:</span> {lab.mission}
          </p>
          <p>{lab.about}</p>
        </Section>

        <Section icon={Users} title="Director">
          <p className="font-semibold text-gray-800">{lab.director.name}</p>
          <a
            href={`mailto:${lab.director.email}`}
            className="text-blue-600 hover:underline"
          >
            {lab.director.email}
          </a>
        </Section>

        <Section icon={ClipboardList} title="Manpower">
          <ul className="list-disc list-inside space-y-2">
            {lab.manpowerList.map((person) => (
              <li key={person._id}>
                <span className="font-medium">{person.name}</span> —{" "}
                <span className="text-gray-600">{person.role}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={FileText} title="Director Documents">
          <ul className="list-disc list-inside space-y-2">
            {lab.director.documents.map((doc) => (
              <li key={doc._id}>
                <a
                  href={`http://localhost:5000${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.filename}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Full-width sections */}
      <Section icon={Cpu} title="Technologies Developed">
        {lab.technologiesDeveloped.map((tech) => (
          <div key={tech._id}>
            <p className="font-semibold">{tech.name}</p>
            <p>{tech.description}</p>
            <p className="text-sm text-gray-500">
              Developed on {new Date(tech.developedDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </Section>

      <Section icon={BookOpen} title="Courses Conducted">
        {lab.courses.map((course) => (
          <div key={course._id}>
            <p className="font-semibold">{course.title}</p>
            <p>{course.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(course.startDate).toLocaleDateString()} to{" "}
              {new Date(course.endDate).toLocaleDateString()}
            </p>
          </div>
        ))}
      </Section>

      <Section icon={ClipboardList} title="Projects">
        {lab.projects.map((proj) => (
          <div key={proj._id}>
            <p className="font-semibold">{proj.title}</p>
            <p>{proj.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(proj.startDate).toLocaleDateString()} to{" "}
              {new Date(proj.endDate).toLocaleDateString()} —{" "}
              <span className="italic">{proj.status}</span>
            </p>
          </div>
        ))}
      </Section>

      <Section icon={Award} title="Publications & Patents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Publications</h4>
            <ul className="list-disc list-inside space-y-2">
              {lab.publications.map((pub) => (
                <li key={pub._id}>
                  <p className="font-medium">{pub.title}</p>
                  <p className="text-sm text-gray-600">
                    {pub.author} — Published on{" "}
                    {new Date(pub.publishedDate).toLocaleDateString()} in{" "}
                    {pub.journal}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Patents</h4>
            <ul className="list-disc list-inside space-y-2">
              {lab.patents.map((pat) => (
                <li key={pat._id}>
                  <p className="font-medium">{pat.title}</p>
                  <p className="text-sm text-gray-600">
                    Filed on {new Date(pat.filingDate).toLocaleDateString()} —
                    Patent No: {pat.patentNumber}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default LabDetails;
