import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const contactTypes = ["Email", "Phone", "Address", "Other"];

const GroupEditForm = ({ groupId }) => {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    about: "",
    mission: "",
    vision: "",
    GroupHistoryDetails: "",
    contactInfo: [],
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${apiUrl}/api/groups/id/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        setGroupData({
          name: data.name || "",
          description: data.description || "",
          about: data.about || "",
          mission: data.mission || "",
          vision: data.vision || "",
          GroupHistoryDetails: data.GroupHistoryDetails || "",
          contactInfo: data.contactInfo || [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching group data:", error);
        setStatus("Failed to load group data");
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...groupData.contactInfo];
    updatedContacts[index][field] = value;
    setGroupData((prev) => ({ ...prev, contactInfo: updatedContacts }));
  };

  const addContactInfo = () => {
    setGroupData((prev) => ({
      ...prev,
      contactInfo: [...prev.contactInfo, { type: "Email", label: "", value: "" }],
    }));
  };

  const removeContactInfo = (index) => {
    const updated = [...groupData.contactInfo];
    updated.splice(index, 1);
    setGroupData((prev) => ({ ...prev, contactInfo: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Updating...");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${apiUrl}/api/groups/${groupId}`,
        { ...groupData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatus("Group updated successfully");
    } catch (error) {
      console.error("Error updating group:", error);
      setStatus("Update failed");
    }
  };

  if (loading) return <div>Loading group data...</div>;

  return (
    <div className="p-6  mx-auto bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Edit Group Information</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Fields */}
        {[
          { label: "Group Name", name: "name", required: true },
          { label: "Description", name: "description" },
          { label: "About", name: "about" },
          { label: "Vision", name: "vision" },
          { label: "Mission", name: "mission" },
          { label: "Group History", name: "GroupHistoryDetails" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block font-medium mb-1">{field.label}</label>
            <textarea
              name={field.name}
              value={groupData[field.name]}
              onChange={handleChange}
              rows={field.name === "name" ? 1 : 3}
              required={field.required}
              className="w-full border rounded p-2"
            />
          </div>
        ))}

        {/* Contact Info Section */}
        <div>
          <label className="block font-medium mb-2">Contact Info</label>
          {groupData.contactInfo.map((item, index) => (
            <div
              key={index}
              className="border p-3 mb-2 rounded flex flex-col gap-2 bg-gray-50"
            >
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleContactChange(index, "type", e.target.value)
                    }
                    className="w-full border rounded p-2"
                  >
                    {contactTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      handleContactChange(index, "label", e.target.value)
                    }
                    className="w-full border rounded p-2"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Value</label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleContactChange(index, "value", e.target.value)
                    }
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeContactInfo(index)}
                className="text-red-600 text-sm mt-1 self-end"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addContactInfo}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Contact Info
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default GroupEditForm;
