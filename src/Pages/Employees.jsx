import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { apiFetch } from "../api";
import "./Employees.css";

const API = "/api";
const emptyForm = { name: "", email: "", role: "", department: "" };

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch(`${API}/employees`).then((r) => r.json()),
      apiFetch(`${API}/departments`).then((r) => r.json()),
    ])
      .then(([emps, deps]) => {
        setEmployees(emps);
        setDepartments(deps);
      })
      .catch(() => setPageError("Failed to load employees. Is the server running?"))
      .finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      role: emp.role || "",
      department: emp.department?._id || "",
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payload = { ...form, department: form.department || undefined };
    const url = editingId ? `${API}/employees/${editingId}` : `${API}/employees`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setEmployees((prev) =>
        editingId
          ? prev.map((emp) => (emp._id === editingId ? data : emp))
          : [data, ...prev]
      );
      closeForm();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}?`)) return;
    try {
      const res = await apiFetch(`${API}/employees/${emp._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEmployees((prev) => prev.filter((e) => e._id !== emp._id));
    } catch {
      alert("Could not delete the employee");
    }
  };

  const filtered = employees.filter((emp) => {
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      (emp.role || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="emp">
      {/* Header */}
      <div className="emp-header">
        <div>
          <p className="emp-eyebrow">PEOPLE DIRECTORY</p>
          <h1 className="emp-title">Employees</h1>
          <p className="emp-subtitle">A clear view of everyone on your team.</p>
        </div>

        <button className="emp-add-btn" onClick={openAdd}>
          <Plus size={18} /> Add employee
        </button>
      </div>

      {/* Table card */}
      <div className="emp-card">
        <div className="emp-card-head">
          <h3>
            All employees <span className="emp-count">{employees.length}</span>
          </h3>

          <div className="emp-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search employees"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading && <p className="emp-message">Loading...</p>}
        {pageError && <p className="emp-message emp-error">{pageError}</p>}

        {!loading && !pageError && (
          <div className="emp-table-wrap">
            <table className="emp-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>ROLE</th>
                  <th>DEPARTMENT</th>
                  <th>STATUS</th>
                  <th className="emp-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="emp-person">
                        <div className="emp-avatar">{getInitials(emp.name)}</div>
                        <div>
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-email">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{emp.role || "-"}</td>
                    <td>{emp.department?.name || "-"}</td>
                    <td>
                      <span className={`emp-status emp-status-${emp.status}`}>
                        {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                      </span>
                    </td>
                    <td className="emp-right">
                      <button className="emp-icon-btn" onClick={() => openEdit(emp)}>
                        <Pencil size={16} />
                      </button>
                      <button className="emp-icon-btn" onClick={() => handleDelete(emp)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="emp-empty">
                      No employees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeForm}>
              <X size={20} />
            </button>

            <h2>{editingId ? "Edit employee" : "Add employee"}</h2>
            <p className="modal-sub">Keep this person's details up to date.</p>

            <form onSubmit={handleSubmit}>
              <label>Full name</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Work email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <label>Job title</label>
              <input name="role" value={form.role} onChange={handleChange} />

              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange}>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>

              {formError && <p className="modal-error">{formError}</p>}

              <button type="submit" className="modal-submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add employee"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}