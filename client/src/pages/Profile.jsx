import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: ""
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile(form);
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="o-control-panel">
        <div className="o-breadcrumb">
          <strong>My Profile</strong>
        </div>
      </div>

      <section className="o-form-sheet-bg">
        <form className="o-form-sheet" onSubmit={submit}>
          <div className="o-group-title">Profile Details</div>
          <div className="o-group">
            <div className="o-inner-group">
              <div className="o-field">
                <label className="o-label">Name</label>
                <div className="o-input-wrap">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Email</label>
                <div className="o-input-wrap">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="o-inner-group">
              <div className="o-field">
                <label className="o-label">Current Password</label>
                <div className="o-input-wrap">
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="Required only for password change"
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">New Password</label>
                <div className="o-input-wrap">
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Leave blank to keep existing"
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
            <button type="submit" className="o-btn o-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {message ? <div className="o-help">{message}</div> : null}
          </div>
        </form>
      </section>
    </>
  );
}
