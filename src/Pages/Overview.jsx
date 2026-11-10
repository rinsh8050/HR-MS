import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Clock, Building2, CalendarDays, ArrowUpRight, ArrowRight } from "lucide-react";
import "./Overview.css";

const API_URL = "http://localhost:5000/api/overview";

const emptyData = {
  totalEmployees: 0,
  activeEmployees: 0,
  departments: 0,
  pendingLeave: 0,
  recentLeave: [],
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function Overview() {
  const [data, setData] = useState(emptyData);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Server returned an error");
        return res.json();
      })
      .then((json) => setData({ ...emptyData, ...json }))
      .catch(() =>
        setError("Could not reach the server. Start it with: npm run server")
      );
  }, []);

  const today = new Date()
    .toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  const stats = [
    {
      label: "Total employees",
      value: data.totalEmployees,
      note: "Across the organization",
      icon: <Users size={18} />,
    },
    {
      label: "Active employees",
      value: data.activeEmployees,
      note: "Currently working",
      icon: <Clock size={18} />,
    },
    {
      label: "Departments",
      value: data.departments,
      note: "Teams and functions",
      icon: <Building2 size={18} />,
    },
    {
      label: "Pending leave",
      value: data.pendingLeave,
      note: "Need your attention",
      icon: <CalendarDays size={18} />,
    },
  ];

  return (
    <div className="ov">
      {/* Header */}
      <div className="ov-header">
        <div>
          <p className="ov-date">{today}</p>
          <h1 className="ov-title">{getGreeting()}, Alex</h1>
          <p className="ov-subtitle">Here's what's happening across your people team.</p>
        </div>

        <Link to="/employees" className="ov-add-btn">
          Add employee <ArrowUpRight size={16} />
        </Link>
      </div>

      {error && <div className="ov-banner">{error}</div>}

      {/* Stat cards */}
      <div className="ov-stats">
        {stats.map((s) => (
          <div className="ov-stat" key={s.label}>
            <div className="ov-stat-top">
              <span>{s.label}</span>
              <span className="ov-stat-icon">{s.icon}</span>
            </div>
            <div className="ov-stat-value">{s.value}</div>
            <div className="ov-stat-note">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="ov-bottom">
        <div className="ov-card">
          <div className="ov-card-head">
            <div>
              <h3>Recent leave requests</h3>
              <p>Keep up with time away from work</p>
            </div>
            <Link to="/leave-requests" className="ov-view-all">
              View all
            </Link>
          </div>

          {data.recentLeave.length === 0 && (
            <p className="ov-empty">No leave requests yet.</p>
          )}

          {data.recentLeave.map((leave) => (
            <div className="ov-leave-row" key={leave._id}>
              <div className="ov-leave-left">
                <div className="ov-avatar">{getInitials(leave.employee?.name)}</div>
                <div>
                  <div className="ov-leave-name">{leave.employee?.name || "Unknown"}</div>
                  <div className="ov-leave-meta">
                    {leave.type} · {leave.days} {leave.days === 1 ? "day" : "days"}
                  </div>
                </div>
              </div>

              <span className={`ov-badge ov-badge-${leave.status}`}>
                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
              </span>
            </div>
          ))}
        </div>

        <div className="ov-promo">
          <div className="ov-promo-icon">
            <Users size={20} />
          </div>
          <h3>Your people, in one place.</h3>
          <p>Manage employee details, teams and leave requests without the busywork.</p>
          <Link to="/employees" className="ov-promo-link">
            Explore employees <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}