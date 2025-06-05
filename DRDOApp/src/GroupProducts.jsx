import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BookOpen,
  FileText,
  Lightbulb,
  Briefcase,
  AlertCircle,
} from "lucide-react";

const apiUri = import.meta.env.VITE_API_URL || "http://localhost:5000";
import axiosInstance from "./axiosInstance";

const iconMap = {
  "Technologies Developed": <Lightbulb className="text-yellow-600 w-5 h-5" />,
  Patents: <FileText className="text-purple-600 w-5 h-5" />,
  Publications: <BookOpen className="text-green-600 w-5 h-5" />,
  Projects: <Briefcase className="text-blue-600 w-5 h-5" />,
};

const GroupProducts = ({ groupId }) => {
  const [data, setData] = useState({
    technologies: [],
    patents: [],
    publications: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/api/groups/id/${groupId}`);
        setData({
          technologies: res.data.technologies || [],
          patents: res.data.patents || [],
          publications: res.data.publications || [],
          projects: res.data.projects || [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to fetch group details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  const renderSection = (title, items) => (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {iconMap[title]}
        <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500 italic ml-7">
          No {title.toLowerCase()} available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {item.name}
              </h4>
              <p className="text-gray-700 text-sm">{item.description}</p>
              {item.fileUrl && (
                <a
                  href={`${apiUri}${item.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-2 inline-block text-sm"
                >
                  View Document
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className=" mx-auto p-6 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Group Details
      </h2>

      {renderSection("Technologies Developed", data.technologies)}
      {renderSection("Patents", data.patents)}
      {renderSection("Publications", data.publications)}
      {renderSection("Projects", data.projects)}
    </div>
  );
};

export default GroupProducts;
