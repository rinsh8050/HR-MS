import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import "./Navbar.css";

const titles = {
  "/": "Overview",
  "/employees": "Employees",
  "/departments": "Departments",
  "/leave-requests": "Leave requests",
};

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    return {};
  }
}

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const title = titles[pathname] || "Workspace";
  const user = getUser();
  const name = user.name || "User";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

        <div style={{ position: "relative" }}>
          <button className="profile-btn" onClick={() => setOpen(!open)}>
            <div className="avatar">{initials}</div>
            <span className="user-name">{name}</span>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "110%",
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                minWidth: 160,
                zIndex: 50,
              }}
            >
              <button
                onClick={logout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "#b91c1c",
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}