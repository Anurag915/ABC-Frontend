import { useEffect, useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const ApproveUserCard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupSelections, setGroupSelections] = useState({}); // userId => { labId, groupId, role }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, groupsRes] = await Promise.all([
          axios.get(`${apiUrl}/admin/pending-users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${apiUrl}/api/groups/name`),
        ]);

        setPendingUsers(usersRes.data);
        setGroups(groupsRes.data);
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

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading...</p>;
  if (pendingUsers.length === 0)
    return <p className="text-center mt-10 text-gray-500 text-lg">No pending users found ✅</p>;

  return (
    <div className="p-6  mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Pending User Approvals</h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {pendingUsers.map((user) => (
          <div key={user._id} className="border p-5 rounded-2xl shadow-md hover:shadow-lg transition-all bg-white">
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">📧 {user.email}</p>
            <p className="text-gray-500 mb-3">Role Requested: <span className="font-medium">{user.role}</span></p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Lab ID</label>
                <input
                  type="text"
                  placeholder="Enter Lab ID"
                  value={groupSelections[user._id]?.labId || ""}
                  onChange={(e) => handleInputChange(user._id, "labId", e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Group</label>
                <select
                  value={groupSelections[user._id]?.groupId || ""}
                  onChange={(e) => handleInputChange(user._id, "groupId", e.target.value)}
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
                <label className="block text-sm font-medium text-gray-700">Assign Role</label>
                <select
                  value={groupSelections[user._id]?.role || ""}
                  onChange={(e) => handleInputChange(user._id, "role", e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Role</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
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
