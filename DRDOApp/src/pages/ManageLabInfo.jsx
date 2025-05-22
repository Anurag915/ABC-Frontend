import React, { useState, useEffect } from "react";
import axios from "axios";

const LAB_ID = "68281329c79492a7cf984910"; // Replace with your actual Lab ID
const apiUrl= import.meta.env.VITE_API_URL;
const ManageLabInfo = () => {
  const [lab, setLab] = useState({
    name: "",
    domain: "",
    vision: "",
    mission: "",
    about: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const yourToken = localStorage.getItem("token"); // Or get from context if using AuthContext

  useEffect(() => {
    const fetchLabInfo = async () => {
      try {
        const res = await axios.get(`/api/labs/${LAB_ID}`, {
          headers: {
            Authorization: `Bearer ${yourToken}`,
          },
        });
        setLab(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch lab information.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabInfo();
  }, []);

  const handleChange = (e) => {
    setLab({ ...lab, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const res = await axios.put(`${apiUrl}/api/labs/${LAB_ID}`, lab, {
        headers: {
          Authorization: `Bearer ${yourToken}`,
        },
      });
      alert("Lab information updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update lab information.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Update Lab Information</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={lab.name}
          onChange={handleChange}
          placeholder="Lab Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="domain"
          value={lab.domain}
          onChange={handleChange}
          placeholder="Domain"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="vision"
          value={lab.vision}
          onChange={handleChange}
          placeholder="Vision"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="mission"
          value={lab.mission}
          onChange={handleChange}
          placeholder="Mission"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="about"
          value={lab.about}
          onChange={handleChange}
          placeholder="About the Lab"
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={isSaving}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            isSaving && "opacity-50 cursor-not-allowed"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ManageLabInfo;
