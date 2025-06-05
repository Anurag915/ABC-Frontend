import { useEffect, useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const ApproveUserCard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupSelections, setGroupSelections] = useState({}); // userId => { labId, groupId, role }
  const [labId, setLabId] = useState(null);
  const [labName, setLabName] = useState(""); // 👈 New

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, groupsRes, labRes] = await Promise.all([
          axios.get(`${apiUrl}/admin/pending-users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${apiUrl}/api/groups/name`),
          axios.get(`${apiUrl}/api/labs/only`),
        ]);

        setPendingUsers(usersRes.data);
        setGroups(groupsRes.data);
        setLabId(labRes.data._id); // Store the only lab's ID
        setLabName(labRes.data.name); // 👈 Set name too

        // Pre-fill labId for all pending users
        const initialSelections = {};
        usersRes.data.forEach((user) => {
          initialSelections[user._id] = {
            labId: labRes.data._id,
            groupId: "",
            role: "",
          };
        });
        setGroupSelections(initialSelections);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleInputChange = (userId, field, value) => {
    setGroupSelections((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const handleApprove = async (userId) => {
    const { labId, groupId, role } = groupSelections[userId] || {};
    if (!labId || !groupId || !role) return alert("Please fill all fields.");

    try {
      await axios.post(
        `${apiUrl}/admin/approve-user/${userId}`,
        { labId, groupId, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("✅ User approved successfully");
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error(err);
      alert("❌ Approval failed");
    }
  };

  if (loading)
    return <p className="text-center mt-14 text-gray-600">Loading...</p>;
  // if (pendingUsers.length === 0)
  //   return <p className="text-center mt-10 text-gray-500 text-lg">No pending users found ✅</p>;
  if (pendingUsers.length === 0)
    return (
      <div className="mt-24 sm:mt-20 px-4">
        <p className="text-center text-gray-500 text-base sm:text-lg">
          No pending users found ✅
        </p>
      </div>
    );

  return (
    <div className="mt-14 p-6  mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Pending User Approvals
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {pendingUsers.map((user) => (
          <div
            key={user._id}
            className="border p-5 rounded-2xl shadow-md hover:shadow-lg transition-all bg-white"
          >
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">📧 {user.email}</p>
            <p className="text-gray-500 mb-3">
              Role Requested: <span className="font-medium">{user.role}</span>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lab
                </label>
                <input
                  type="text"
                  value={labName}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Group
                </label>
                <select
                  value={groupSelections[user._id]?.groupId || ""}
                  onChange={(e) =>
                    handleInputChange(user._id, "groupId", e.target.value)
                  }
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Group</option>
                  {groups.map((group) =>
                    group && group.name && group._id ? (
                      <option key={group._id} value={group._id}>
                        {group.name}
                      </option>
                    ) : null
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign Role
                </label>
                <select
                  value={groupSelections[user._id]?.role || ""}
                  onChange={(e) =>
                    handleInputChange(user._id, "role", e.target.value)
                  }
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Role</option>
                  <option value="employee">Employee</option>
                  <option value="associate_director">Associate Director</option>
                  <option value="director">Director</option>
                  {/* <option value="employee">Employee</option> */}
                  {/* <option value="admin">Admin</option> */}
                </select>
              </div>

              <button
                onClick={() => handleApprove(user._id)}
                className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✅ Approve User
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApproveUserCard;
