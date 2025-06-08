import React, { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const LettersManager = () => {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [form, setForm] = useState({
    letterLanguage: "",
    letterCommunBy: "",
    docketDate: "",
    category: "",
    letterNo: "",
    letterDate: "",
    establishment: "",
    letterSub: "",
    docketNo: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const API_BASE = `${apiUrl}/api/dac`;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLetters(res.data);
    } catch {
      setMessage("⚠️ Failed to fetch letters");
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSelect = (letter) => {
    setSelectedLetter(letter);
    setForm({
      letterLanguage: letter.letterLanguage || "",
      letterCommunBy: letter.letterCommunBy || "",
      docketDate: letter.docketDate?.slice(0, 10) || "",
      category: letter.category || "",
      letterNo: letter.letterNo || "",
      letterDate: letter.letterDate?.slice(0, 10) || "",
      establishment: letter.establishment || "",
      letterSub: letter.letterSub || "",
      docketNo: letter.docketNo || "",
    });
    setFile(null);
    setMessage("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("⚠️ Please select a file");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append("file", file);
      await axios.post(API_BASE, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Letter uploaded");
      setForm({ letterLanguage:"",letterCommunBy:"",docketDate:"",category:"",letterNo:"",letterDate:"",establishment:"",letterSub:"",docketNo:"" });
      setFile(null);
      fetchLetters();
    } catch (err) {
      setMessage("❌ Upload failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedLetter) return;
    try {
      await axios.put(
        `${API_BASE}/${selectedLetter._id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Letter updated");
      setSelectedLetter(null);
      setForm({ letterLanguage:"",letterCommunBy:"",docketDate:"",category:"",letterNo:"",letterDate:"",establishment:"",letterSub:"",docketNo:"" });
      fetchLetters();
    } catch {
      setMessage("❌ Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this letter?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Letter deleted");
      if (selectedLetter?._id === id) {
        setSelectedLetter(null);
        setForm({ letterLanguage:"",letterCommunBy:"",docketDate:"",category:"",letterNo:"",letterDate:"",establishment:"",letterSub:"",docketNo:"" });
      }
      fetchLetters();
    } catch {
      setMessage("❌ Delete failed");
    }
  };

  return (
    <div className="mt-14 max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold text-gray-800">
        Letters Manager
      </h1>

      {message && (
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
          {message}
        </div>
      )}

      {/* Letters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {letters.map((l) => (
          <div
            key={l._id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => handleSelect(l)}
          >
            <h2 className="text-xl font-medium text-blue-700">
              {l.letterSub}
            </h2>
            <p className="text-gray-600 text-sm">
              By: {l.uploadedBy?.name || "Unknown"}
            </p>
            <p className="mt-2 text-gray-700">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(l.letterDate).toLocaleDateString()}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(l._id);
              }}
              className="mt-3 inline-block bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {selectedLetter ? "Edit Letter" : "Upload New Letter"}
        </h2>
        <form
          onSubmit={selectedLetter ? handleUpdate : handleUpload}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "letterLanguage", label: "Language", type: "text" },
              { name: "letterCommunBy", label: "Communicated By", type: "text" },
              { name: "docketDate", label: "Docket Date", type: "date" },
              { name: "letterDate", label: "Letter Date", type: "date" },
              { name: "letterNo", label: "Letter No", type: "text" },
              { name: "category", label: "Category", type: "text" },
              { name: "establishment", label: "Establishment", type: "text" },
              { name: "letterSub", label: "Subject", type: "text" },
              { name: "docketNo", label: "Docket No", type: "text" },
            ].map((f) => (
              <div key={f.name} className="flex flex-col">
                <label className="mb-1 text-gray-600">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}
          </div>

          {!selectedLetter && (
            <div>
              <label className="block mb-1 text-gray-600">Upload File</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.png"
                required
                className="block w-full text-sm text-gray-700"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              {selectedLetter ? "Save Changes" : "Upload"}
            </button>
            {selectedLetter && (
              <button
                type="button"
                onClick={() => {
                  setSelectedLetter(null);
                  setForm({
                    letterLanguage: "",
                    letterCommunBy: "",
                    docketDate: "",
                    category: "",
                    letterNo: "",
                    letterDate: "",
                    establishment: "",
                    letterSub: "",
                    docketNo: "",
                  });
                  setFile(null);
                  setMessage("");
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LettersManager;
