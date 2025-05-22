import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  Bell,
  FileText,
  Megaphone,
  Package,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Manage Lab Information", path: "/admin/manage-lab", icon: <Settings size={18} /> },
  { label: "Notices", path: "/admin/notices", icon: <Bell size={18} /> },
  { label: "Circulars", path: "/admin/circulars", icon: <FileText size={18} /> },
  { label: "Advertisements", path: "/admin/advertisements", icon: <Megaphone size={18} /> },
  { label: "Products", path: "/admin/products", icon: <Package size={18} /> },
  { label: "Directors", path: "/admin/directors", icon: <Users size={18} /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className="p-6 w-64 bg-white shadow-md min-h-screen border-r">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 tracking-wide">Admin Panel</h2>
      <ul className="space-y-2">
        {navItems.map(({ label, path, icon }) => (
          <li key={path}>
            <Link
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                location.pathname === path
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100"
              }`}
            >
              {icon}
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
