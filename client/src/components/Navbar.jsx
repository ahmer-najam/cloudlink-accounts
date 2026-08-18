import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, permissions } = useAuth();

  return (
    <nav className="o-navbar">
      <div className="brand">
        <span className="brand-mark">BP</span>
        <strong>Business Portal</strong>
      </div>
      <div className="nav-links">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/finance">Finance</NavLink>
        <NavLink to="/investors">Investors</NavLink>
        <NavLink to="/reports">Reports</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {permissions.settingsManage ? <NavLink to="/settings">Settings</NavLink> : null}
        {permissions.usersManage ? <NavLink to="/users">Users</NavLink> : null}
        <button type="button" className="o-btn o-btn-secondary nav-logout" onClick={logout}>
          Logout ({user?.role || "user"})
        </button>
      </div>
    </nav>
  );
}
