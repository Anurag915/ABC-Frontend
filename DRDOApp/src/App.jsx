// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./HomePage";
// import GroupDetails from "./GroupDetails";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import RequireAdmin from "./RequireAdmin";
// import AddGroup from "./pages/AddGroup";
// import Navbar from "./Navbar";
// import Footer from "./Footer";
// import UserList from "./UserList";
// import EditGroup from "./EditGroup";
// import LabDetails from "./pages/Labs";
// import Profile from "./pages/Profile";
// import DocumentMarquee from "./DocumentMarquee";
// function App() {
//   return (
//     <Router>
//       <DocumentMarquee />
//       <div style={{ marginTop: "50px" }}>
//         <Navbar />
//         {/* Other dashboard content */}
//       </div>{" "}
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/group/:id" element={<GroupDetails />} />
//         <Route
//           path="/add-group"
//           element={
//             <RequireAdmin>
//               <AddGroup />
//             </RequireAdmin>
//           }
//         />
//         <Route path="/employees" element={<UserList />} />

//         <Route path="/groups/:id/edit" element={<EditGroup />} />
//         <Route path="/labs" element={<LabDetails />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

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

function App() {
  return (
    <Router>
      {/* Fixed Top Marquee */}
      <DocumentMarquee />

      {/* Fixed Navbar below Marquee */}
      <Navbar />
      <div style={{ marginTop: "100px" }}>
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
