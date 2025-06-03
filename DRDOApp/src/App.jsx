import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import GroupDetails from "./GroupDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAdmin from "./RequireAdmin";
import AddGroup from "./pages/AddGroup";
import Navbar from "./Navbar";
import Footer from "./Footer";
import UserList from "./UserList";
import EditGroup from "./EditGroup";
import LabDetails from "./pages/Labs";
import Profile from "./pages/Profile";
import DocumentMarquee from "./DocumentMarquee";
import DirectorProfile from "./pages/DirectorProfile";
import TopNavbar from "./TopNavbar";
import AdminLayout from "./AdminLayout";
import ManageLabInfo from "./pages/ManageLabInfo";
import AdminPanel from "./AdminPanel";
import ManageNoticesCirculars from "./ManageNoticesCirculars";
import ManageGroups from "./ManageGroups";
import AdminGroupPanel from "./AdminGroupPanel";
import ProtectedRoute from "./ProtectedRoute";
import ApproveUserCard from "./ApproveUserCard";
import MyGroup from "./MyGroup";
import AdminLogs from "./AdminLogs";
import CloseGroupManager from "./CloseGroupManager";
import UserCloseGroupDocs from "./UserCloseGroupDocs";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Fixed Top Marquee and Navbars */}
        <DocumentMarquee />
        <TopNavbar />
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow mt-[150px]">
          <Routes>
            {/* ... all your routes ... */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/group/id/:id" element={<GroupDetails />} />
            <Route
              path="/add-group"
              element={
                <RequireAdmin>
                  <AddGroup />
                </RequireAdmin>
              }
            />
            <Route path="/employees" element={<UserList />} />
            <Route path="/groups/:id/edit" element={<EditGroup />} />
            <Route path="/labs" element={<LabDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/closeGroup" element={<UserCloseGroupDocs />} />
            <Route path="/directorprofile" element={<DirectorProfile />} />
            <Route
              path="/my-group"
              element={
                <ProtectedRoute>
                  <MyGroup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/group/id/:id"
              element={
                <ProtectedRoute>
                  <GroupDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approval"
              element={
                <RequireAdmin>
                  <ApproveUserCard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <RequireAdmin>
                  <AdminLogs />
                </RequireAdmin>
              }
            ></Route>
            <Route
              path="/admin/closeGroup"
              element={
                <RequireAdmin>
                  <CloseGroupManager />
                </RequireAdmin>
              }
            ></Route>
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            >
              <Route path="manage-lab" element={<ManageLabInfo />} />
              <Route path="manage" element={<ManageNoticesCirculars />} />
              <Route path="groups/:id" element={<GroupDetails />} />
            </Route>
            <Route path="/admin/group/:id" element={<AdminGroupPanel />} />
          </Routes>
        </main>

        {/* Footer always at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
