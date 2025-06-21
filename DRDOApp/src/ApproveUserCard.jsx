import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // For sleek notifications
import { UserCheck, Eye, XCircle, Loader2, FileText } from "lucide-react"; // Added FileText icon

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

// A simple Modal component for displaying user profiles
const UserProfileModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    // The main modal overlay: fixed, full screen, high z-index
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[9999]">
      {/* Modal content container */}
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl mx-auto relative transform transition-all scale-100 opacity-100">
        <button
          onClick={onClose}
          // Absolute positioning relative to the modal content, high z-index
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-[10000]"
          aria-label="Close"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          User Profile: {user.personalDetails?.name || user.name || "N/A"}
        </h3>
        <div className="space-y-3 text-gray-700 max-h-[70vh] overflow-y-auto pr-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Requested Role:</strong>{" "}
            <span className="font-medium capitalize">{user.role || "N/A"}</span>
          </p>

          {user.personalDetails && (
            <>
              <h4 className="text-lg font-semibold text-gray-800 mt-4 border-b pb-1">
                Personal Details
              </h4>
              <p>
                <strong>Full Name:</strong> {user.personalDetails.name || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {user.personalDetails.dob
                  ? new Date(user.personalDetails.dob).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"}
              </p>
              <p>
                <strong>Mobile:</strong> {user.personalDetails.mobile || "N/A"}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {user.personalDetails.address || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {user.personalDetails.gender || "N/A"}
              </p>
              <p>
                <strong>Marital Status:</strong>{" "}
                {user.personalDetails.maritalStatus || "N/A"}
              </p>
              {user.personalDetails.emergencyContact && (
                <div>
                  <strong>Emergency Contact:</strong>
                  <ul className="list-disc list-inside ml-4 text-sm">
                    <li>
                      Name:{" "}
                      {user.personalDetails.emergencyContact.name || "N/A"}
                    </li>
                    <li>
                      Relationship:{" "}
                      {user.personalDetails.emergencyContact.relationship ||
                        "N/A"}
                    </li>
                    <li>
                      Mobile:{" "}
                      {user.personalDetails.emergencyContact.mobile || "N/A"}
                    </li>
                  </ul>
                </div>
              )}
              <p>
                <strong>Blood Group:</strong>{" "}
                {user.personalDetails.bloodGroup || "N/A"}
              </p>
            </>
          )}

          {user.professionalDetails && (
            <>
              <h4 className="text-lg font-semibold text-gray-800 mt-4 border-b pb-1">
                Professional Details
              </h4>
              <p>
                <strong>Designation:</strong>{" "}
                {user.professionalDetails.designation || "N/A"}
              </p>
              <p>
                <strong>Cadre:</strong>{" "}
                {user.professionalDetails.cadre || "N/A"}
              </p>
              <p>
                <strong>Intercom:</strong>{" "}
                {user.professionalDetails.intercom || "N/A"}
              </p>
              <p>
                <strong>Internet Email:</strong>{" "}
                {user.professionalDetails.internetEmail || "N/A"}
              </p>
              <p>
                <strong>Drona Email:</strong>{" "}
                {user.professionalDetails.dronaEmail || "N/A"}
              </p>
              <p>
                <strong>PIS:</strong> {user.professionalDetails.pis || "N/A"}
              </p>
              <p>
                <strong>AEBAS ID:</strong>{" "}
                {user.professionalDetails.aebasId || "N/A"}
              </p>
              <p>
                <strong>Joining Date:</strong>{" "}
                {user.professionalDetails.joiningDate
                  ? new Date(
                      user.professionalDetails.joiningDate
                    ).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </>
          )}

          {user.documents && user.documents.length > 0 && (
            <>
              <h4 className="text-lg font-semibold text-gray-800 mt-4 border-b pb-1">
                Documents
              </h4>
              <ul className="space-y-2">
                {user.documents.map((doc, index) => (
                  <li
                    key={index}
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all"
                    >
                      {doc.filename || `Document ${index + 1}`}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {user.about && (
            <p>
              <strong>About:</strong> {user.about}
            </p>
          )}
          {user.photo && (
            <div className="mt-4">
              <strong>Photo:</strong>
              <img
                src={user.photo}
                alt="User Photo"
                className="w-24 h-24 rounded-full object-cover mt-2 border border-gray-200"
              />
            </div>
          )}
          {user.employmentPeriod &&
            (user.employmentPeriod.from || user.employmentPeriod.to) && (
              <p>
                <strong>Employment Period:</strong>{" "}
                {user.employmentPeriod.from
                  ? new Date(user.employmentPeriod.from).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"}
                {" - "}
                {user.employmentPeriod.to
                  ? new Date(user.employmentPeriod.to).toLocaleDateString(
                      "en-IN"
                    )
                  : "N/A"}
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

const ApproveUserCard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupSelections, setGroupSelections] = useState({}); // userId => { labId, groupId, role }
  const [labId, setLabId] = useState(null);
  const [labName, setLabName] = useState("");
  const [approvingUser, setApprovingUser] = useState(null); // To track which user is being approved
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, groupsRes, labRes] = await Promise.all([
          axios.get(`${apiUrl}/admin/pending-users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${apiUrl}/api/groups/name`),
          axios.get(`${apiUrl}/api/labs/only`),
        ]);

        // Simulate more personal details and professional details for demo purposes if not provided by API
        const usersWithDetails = usersRes.data.map((user) => ({
          ...user,
          personalDetails: user.personalDetails || {
            name: user.name,
            dob: "1990-01-01T00:00:00.000Z",
            mobile: `+91-98765${Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0")}`,
            address: "123 Main St, Anytown, State, 123456",
            gender: "Male",
            maritalStatus: "Single",
            emergencyContact: {
              name: "Jane Doe",
              relationship: "Sister",
              mobile: "+91-9988776655",
            },
            bloodGroup: "O+",
          },
          professionalDetails: user.professionalDetails || {
            designation: "Software Engineer",
            cadre: "DRDS",
            intercom: "1234",
            internetEmail: `${user.email.split("@")[0]}@example.com`,
            dronaEmail: `${user.email.split("@")[0]}@drona.in`,
            pis: "PIS12345",
            aebasId: "AEBAS67890",
            joiningDate: "2020-03-15T00:00:00.000Z",
          },
          documents:
            user.documents && user.documents.length > 0
              ? user.documents
              : [
                  {
                    filename: "Resume.pdf",
                    url: "https://www.africau.edu/images/default/sample.pdf",
                  },
                  {
                    filename: "ID_Card.jpg",
                    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                  },
                ],
          about: user.about || "Passionate about technology and innovation.",
          photo:
            user.photo ||
            "https://via.placeholder.com/150/0000FF/FFFFFF?text=User",
          employmentPeriod: user.employmentPeriod || {
            from: "2020-01-01T00:00:00.000Z",
            to: null,
          },
        }));

        setPendingUsers(usersWithDetails);
        setGroups(groupsRes.data);
        setLabId(labRes.data._id);
        setLabName(labRes.data.name);

        const initialSelections = {};
        usersWithDetails.forEach((user) => {
          initialSelections[user._id] = {
            labId: labRes.data._id,
            groupId: "",
            role: "",
          };
        });
        setGroupSelections(initialSelections);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]);

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
    if (!labId || !groupId || !role) {
      toast.error("Please select a Group and a Role for the user.");
      return;
    }

    setApprovingUser(userId);
    try {
      await axios.post(
        `${apiUrl}/admin/approve-user/${userId}`,
        { labId, groupId, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User approved successfully!");
      setPendingUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Approval failed:", err);
      toast.error(
        err.response?.data?.error || "Approval failed. Please try again."
      );
    } finally {
      setApprovingUser(null);
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUserForProfile(user);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUserForProfile(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Loading pending users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-16 px-4 sm:px-6 lg:px-8 mt-20">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center flex items-center justify-center">
        <UserCheck className="w-10 h-10 mr-4 text-green-600" />
        Pending User Approvals
      </h1>

      {pendingUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mx-auto text-center ">
          {" "}
          {/* Added max-w-md here for smaller message box */}
          <p className="text-xl text-gray-600 font-semibold mb-4">
            No pending users found! 🎉
          </p>
          <p className="text-gray-500">All users are up to date.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mx-auto">
          {" "}
          {/* Adjusted grid columns and max-width */}
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" // Reduced padding
            >
              <div className="flex justify-between items-start mb-3 border-b pb-3">
                {" "}
                {/* Reduced margin/padding */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {" "}
                    {/* Reduced font size */}
                    {user.personalDetails.name || "N/A"}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                </div>
                <button
                  onClick={() => handleViewProfile(user)}
                  className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors" // Reduced padding
                  title="View full profile"
                >
                  <Eye className="w-4 h-4" /> {/* Reduced icon size */}
                </button>
              </div>

              <div className="space-y-3">
                {" "}
                {/* Reduced spacing */}
                {/* Display Lab Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {" "}
                    {/* Reduced font size */}
                    Lab Affiliation
                  </label>
                  <input
                    type="text"
                    value={labName}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed shadow-sm text-sm" // Reduced padding and font size
                  />
                </div>
                {/* Select Group */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {" "}
                    {/* Reduced font size */}
                    Assign Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={groupSelections[user._id]?.groupId || ""}
                    onChange={(e) =>
                      handleInputChange(user._id, "groupId", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200 shadow-sm bg-white text-gray-700 text-sm" // Reduced padding and font size
                  >
                    <option value="" disabled>
                      -- Select Group --
                    </option>
                    {groups.length > 0 ? (
                      groups.map((group) =>
                        group && group.name && group._id ? (
                          <option key={group._id} value={group._id}>
                            {group.name}
                          </option>
                        ) : null
                      )
                    ) : (
                      <option disabled>No groups available</option>
                    )}
                  </select>
                </div>
                {/* Assign Role */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {" "}
                    {/* Reduced font size */}
                    Assign Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={groupSelections[user._id]?.role || ""}
                    onChange={(e) =>
                      handleInputChange(user._id, "role", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition duration-200 shadow-sm bg-white text-gray-700 text-sm" // Reduced padding and font size
                  >
                    <option value="" disabled>
                      -- Select Role --
                    </option>
                    <option value="employee">Employee</option>
                    <option value="associate_director">
                      Associate Director
                    </option>
                    <option value="director">Director</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    The role here will override the user's requested role.
                  </p>
                </div>
                {/* Approve Button */}
                <button
                  onClick={() => handleApprove(user._id)}
                  disabled={approvingUser === user._id}
                  className="w-full mt-4 py-2 px-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-sm" // Reduced padding and font size
                >
                  {approvingUser === user._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                      {/* Reduced icon size */}
                      Approving...
                    </>
                  ) : (
                    "Approve User"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Profile Modal */}
      {showProfileModal && (
        <UserProfileModal
          user={selectedUserForProfile}
          onClose={closeProfileModal}
        />
      )}
    </div>
  );
};

export default ApproveUserCard;
