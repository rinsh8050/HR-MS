import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, Building2, CalendarDays } from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">N</div>
        <div>
          <div className="brand-name">northstar</div>
          <div className="brand-sub">People operations</div>
        </div>
      </div>

      <div className="menu-title">WORKSPACE</div>

      <NavLink to="/" end className="menu-item">
        <LayoutGrid size={20} />
        <span>Overview</span>
      </NavLink>

      <NavLink to="/employees" className="menu-item">
        <Users size={20} />
        <span>Employees</span>
      </NavLink>

      <NavLink to="/departments" className="menu-item">
        <Building2 size={20} />
        <span>Departments</span>
      </NavLink>

      <NavLink to="/leave-requests" className="menu-item">
        <CalendarDays size={20} />
        <span>Leave requests</span>
      </NavLink>
    </aside>
  );
}