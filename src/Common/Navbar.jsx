import { useLocation } from "react-router-dom";
import { Bell, ChevronDown } from "lucide-react";
import "./Navbar.css";

const titles = {
  "/": "Overview",
  "/employees": "Employees",
  "/departments": "Departments",
  "/leave-requests": "Leave requests",
};

export default function Navbar() {
  const { pathname } = useLocation();
  const title = titles[pathname] || "Workspace";

  return (
    <header className="navbar">
      <div className="breadcrumb">
        <span className="breadcrumb-muted">People</span>
        <span className="breadcrumb-muted">/</span>
        <span className="breadcrumb-current">{title}</span>
      </div>

      <div className="navbar-right">
        <button className="bell-btn">
          <Bell size={20} />
          <span className="bell-dot"></span>
        </button>

        <div className="divider"></div>

        <button className="profile-btn">
          <div className="avatar">AR</div>
          <span className="user-name">Alex Rivera</span>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
}