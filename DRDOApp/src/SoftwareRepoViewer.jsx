import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const SoftwareRepoViewer = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    try {
      const res = await axiosInstance.get("/api/softwareRepo");
      setRepos(res.data);
    } catch (err) {
      console.error("Failed to fetch repositories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <div className="mx-auto p-6 mt-20">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Uploaded Software Repositories
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading repositories...</p>
      ) : repos.length === 0 ? (
        <p className="text-gray-600">No repositories uploaded yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {repos.map((repo) => (
            <div
              key={repo._id}
              className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {repo.group?.name || "Unnamed Group"}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Type:</span> {repo.type}
                </p>
                <p>
                  <span className="font-semibold">GitHub URL:</span>{" "}
                  {repo.githubUrl ? (
                    <a
                      href={repo.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {repo.githubUrl}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <span className="font-semibold">Cloned Repo Path:</span>{" "}
                  {repo.clonedRepoPath || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Metadata:</span>{" "}
                  {repo.metadata ? (
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                      {JSON.stringify(repo.metadata, null, 2)}
                    </pre>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <span className="font-semibold">File:</span>{" "}
                  {repo.filePath ? (
                    <a
                      href={`${
                        axiosInstance.defaults.baseURL
                      }/${repo.filePath.replace(/\\/g, "/")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 underline"
                    >
                      {repo.originalName || "Download"}
                    </a>
                  ) : (
                    "No file"
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SoftwareRepoViewer;
