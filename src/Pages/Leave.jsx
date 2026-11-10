import { useEffect, useState } from "react";
import { Plus, Check, XCircle, Trash2, X } from "lucide-react";
import { apiFetch } from "../api";
import "./Employees.css";
import "./Leave.css";

const API = "/api";
const emptyForm = { employee: "", type: "Annual leave", days: 1 };

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () =>
    Promise.all([
      apiFetch(`${API}/leaves`).then((r) => r.json()),
      apiFetch(`${API}/employees`).then((r) => r.json()),
    ])
      .then(([l, e]) => {
        setLeaves(l);
        setEmployees(e);
      })
      .catch(() => setPageError("Failed to load leave requests. Is the server running?"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await apiFetch(`${API}/leaves`, {
        method: "POST",
        body: JSON.stringify({ ...form, days: Number(form.days) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id, status) => {
    await apiFetch(`${API}/leaves/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this leave request?")) return;
    await apiFetch(`${API}/leaves/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="emp">
      <div className="emp-header">
        <div>
          <p className="emp-eyebrow">TIME AWAY</p>
          <h1 className="emp-title">Leave requests</h1>
          <p className="emp-subtitle">Review and manage time away from work.</p>
        </div>

       
      </div>

      <div className="emp-card">
        <div className="emp-card-head">
          <h3>
            All requests <span className="emp-count">{leaves.length}</span>
          </h3>
        </div>

        {loading && <p className="emp-message">Loading...</p>}
        {pageError && <p className="emp-message emp-error">{pageError}</p>}

        {!loading && !pageError && (
          <table className="emp-table">
            <thead>
              <tr>
                <th>EMPLOYEE</th>
                <th>TYPE</th>
                <th>DAYS</th>
                <th>STATUS</th>
                <th className="emp-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    <div className="emp-person">
                      <div className="emp-avatar">{getInitials(leave.employee?.name)}</div>
                      <div>
                        <div className="emp-name">{leave.employee?.name || "Deleted employee"}</div>
                        <div className="emp-email">{leave.employee?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{leave.type}</td>
                  <td>{leave.days}</td>
                  <td>
                    <span className={`leave-badge leave-${leave.status}`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td className="emp-right">
                    {leave.status === "pending" && (
                      <>
                        <button
                          className="emp-icon-btn leave-approve"
                          title="Approve"
                          onClick={() => setStatus(leave._id, "approved")}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          className="emp-icon-btn leave-reject"
                          title="Reject"
                          onClick={() => setStatus(leave._id, "rejected")}
                        >
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button className="emp-icon-btn" onClick={() => handleDelete(leave._id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="5" className="emp-empty">
                    No leave requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>
              <X size={20} />
            </button>
            <h2>New leave request</h2>
            <p className="modal-sub">Record time away for an employee.</p>

            <form onSubmit={handleSubmit}>
              <label>Employee</label>
              <select name="employee" value={form.employee} onChange={handleChange} required>
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>

              <label>Leave type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option>Annual leave</option>
                <option>Sick leave</option>
                <option>Casual leave</option>
                <option>Unpaid leave</option>
              </select>

              <label>Number of days</label>
              <input
                type="number"
                min="1"
                name="days"
                value={form.days}
                onChange={handleChange}
                required
              />

              {formError && <p className="modal-error">{formError}</p>}

              <button type="submit" className="modal-submit" disabled={saving}>
                {saving ? "Saving..." : "Submit request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}