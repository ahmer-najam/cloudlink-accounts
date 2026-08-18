import { useEffect, useState } from "react";
import { createUser, fetchUsers, updateUser } from "../services/api.js";
import SearchableSelect from "../components/SearchableSelect.jsx";

const empty = { name: "", email: "", password: "", role: "viewer" };
const roleOptions = [
  { value: "viewer", label: "Viewer" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" }
];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await fetchUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (event) => {
    event.preventDefault();
    await createUser(form);
    setForm(empty);
    await load();
  };

  const setRole = async (id, role) => {
    await updateUser(id, { role });
    await load();
  };

  const toggleActive = async (id, active) => {
    await updateUser(id, { active: !active });
    await load();
  };

  return (
    <>
      <div className="o-control-panel">
        <div className="o-breadcrumb">
          <strong>User Privileges</strong>
        </div>
      </div>

      <section className="o-form-sheet-bg">
        <form className="o-form-sheet" onSubmit={onCreate}>
          <div className="o-group-title">Create User</div>
          <div className="o-group">
            <div className="o-inner-group">
              <div className="o-field">
                <label className="o-label">Name</label>
                <div className="o-input-wrap">
                  <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Email</label>
                <div className="o-input-wrap">
                  <input type="email" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
            </div>
            <div className="o-inner-group">
              <div className="o-field">
                <label className="o-label">Password</label>
                <div className="o-input-wrap">
                  <input type="password" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Role</label>
                <div className="o-input-wrap">
                  <SearchableSelect
                    options={roleOptions}
                    value={form.role}
                    onChange={(value) => setForm((p) => ({ ...p, role: value }))}
                    placeholder="Select role"
                  />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="o-btn o-btn-primary">Create User</button>
        </form>
      </section>

      <section className="o-list-view">
        <div className="card table-wrapper o-tree">
          <h2>Users</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5">Loading...</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id || u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <SearchableSelect
                        options={roleOptions}
                        value={u.role}
                        onChange={(value) => setRole(u._id || u.id, value)}
                        placeholder="Role"
                      />
                    </td>
                    <td>{u.active ? "Active" : "Inactive"}</td>
                    <td>
                      <button type="button" className="o-btn o-btn-secondary" onClick={() => toggleActive(u._id || u.id, u.active)}>
                        {u.active ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
