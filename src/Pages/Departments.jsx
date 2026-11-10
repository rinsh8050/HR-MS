import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import "./Employees.css";

const API = "http://localhost:5000/api/departments";
const emptyForm = { name: "", description: "" };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(API)
      .then((r) => r.json())
      .then(setDepartments)
      .catch(() => setPageError("Failed to load departments. Is the server running?"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (dep) => {
    setEditingId(dep._id);
    setForm({ name: dep.name, description: dep.description || "" });
    setFormError("");
    setShowForm(true);
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch(editingId ? `${API}/${editingId}` : API, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dep) => {
    if (!window.confirm(`Delete ${dep.name}?`)) return;
    const res = await fetch(`${API}/${dep._id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.message);
    load();
  };

  return (
    <div className="emp">
      <div className="emp-header">
        <div>
          <p className="emp-eyebrow">ORGANIZATION</p>
          <h1 className="emp-title">Departments</h1>
          <p className="emp-subtitle">Teams and functions across your company.</p>
        </div>
        <button className="emp-add-btn" onClick={openAdd}>
          <Plus size={18} /> Add department
        </button>
      </div>

      <div className="emp-card">
        <div className="emp-card-head">
          <h3>
            All departments <span className="emp-count">{departments.length}</span>
          </h3>
        </div>

        {loading && <p className="emp-message">Loading...</p>}
        {pageError && <p className="emp-message emp-error">{pageError}</p>}

        {!loading && !pageError && (
          <table className="emp-table">
            <thead>
              <tr>
                <th>DEPARTMENT</th>
                <th>DESCRIPTION</th>
                <th>EMPLOYEES</th>
                <th className="emp-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dep) => (
                <tr key={dep._id}>
                  <td className="emp-name">{dep.name}</td>
                  <td>{dep.description || "-"}</td>
                  <td>{dep.employeeCount}</td>
                  <td className="emp-right">
                    <button className="emp-icon-btn" onClick={() => openEdit(dep)}>
                      <Pencil size={16} />
                    </button>
                    <button className="emp-icon-btn" onClick={() => handleDelete(dep)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td colSpan="4" className="emp-empty">
                    No departments yet. Click "Add department" to create one.
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
            <h2>{editingId ? "Edit department" : "Add department"}</h2>
            <p className="modal-sub">Group your people into teams.</p>

            <form onSubmit={handleSubmit}>
              <label>Department name</label>
              <input name="name" value={form.name} onChange={handleChange} required />

              <label>Description</label>
              <input name="description" value={form.description} onChange={handleChange} />

              {formError && <p className="modal-error">{formError}</p>}

              <button type="submit" className="modal-submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add department"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}