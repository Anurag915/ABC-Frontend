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
function App() {
  return (
    <Router>
      {/* Fixed Top Marquee */}
      <DocumentMarquee />
      <TopNavbar />
      <Navbar />
      <div style={{ marginTop: "180px" }}>
        {/* Main content starts after marquee (40px) + navbar (50px) = ~90px */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/group/:id" element={<GroupDetails />} />
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
          <Route path="/directorprofile" element={<DirectorProfile />} />
          {/* Admin Routes */}
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
            <Route path="groups" element={<ManageGroups />} />
            <Route path="groups/:id" element={<GroupDetails />} />
          </Route>
          <Route path="/admin/group/:id" element={<AdminGroupPanel />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// export default App;
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./HomePage";
// import GroupDetails from "./GroupDetails";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import RequireAdmin from "./RequireAdmin";
// import AddGroup from "./pages/AddGroup";
// import UserList from "./UserList";
// import EditGroup from "./EditGroup";
// import LabDetails from "./pages/Labs";
// import Profile from "./pages/Profile";
// import DirectorProfile from "./pages/DirectorProfile";
// import ManageLabInfo from "./pages/ManageLabInfo";
// import AdminPanel from "./AdminPanel";

// // Layout
// import MainLayout from "./MainLayout";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route element={<MainLayout />}>
//           {/* Public Routes */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/group/:id" element={<GroupDetails />} />
//           <Route
//             path="/add-group"
//             element={
//               <RequireAdmin>
//                 <AddGroup />
//               </RequireAdmin>
//             }
//           />
//           <Route path="/employees" element={<UserList />} />
//           <Route path="/groups/:id/edit" element={<EditGroup />} />
//           <Route path="/labs" element={<LabDetails />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/directorprofile" element={<DirectorProfile />} />

//           {/* Admin Route (with navbars and footer) */}
//           <Route
//             path="/admin"
//             element={
//               <RequireAdmin>
//                 <AdminPanel />
//               </RequireAdmin>
//             }
//           />
//           <Route path="/manage-lab" element={<ManageLabInfo />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

export default App;
