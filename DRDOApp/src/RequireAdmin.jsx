// components/RequireAdmin.jsx
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/" replace />; // redirect non-admins
  }

  return children;
};

export default RequireAdmin;
