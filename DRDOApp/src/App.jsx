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
function App() {
  return (
    <Router>
      <Navbar />
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
