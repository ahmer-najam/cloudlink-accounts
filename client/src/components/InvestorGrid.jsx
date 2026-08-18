import { money } from "../utils/format.js";

const formatDate = (value) => new Date(value).toLocaleDateString();

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

export default function InvestorGrid({ investors, onEdit, onDelete }) {
  if (investors.length === 0) {
    return (
      <div className="card empty-state">
        <h3>No investors yet</h3>
        <p>Add partners and capital contributors to track ownership and invested amounts.</p>
      </div>
    );
  }

  return (
    <div className="investor-grid">
      {investors.map((investor) => (
        <article className="card investor-card" key={investor._id}>
          <div className="investor-head">
            <span className="avatar">{initials(investor.name)}</span>
            <div>
              <h3>{investor.name}</h3>
              <span className={`status-chip ${investor.status}`}>{investor.status}</span>
            </div>
          </div>
          <dl className="investor-meta">
            <div>
              <dt>Invested</dt>
              <dd>{money(investor.investedAmount)}</dd>
            </div>
            <div>
              <dt>Ownership</dt>
              <dd>{investor.ownershipPercent}%</dd>
            </div>
            <div>
              <dt>Joined</dt>
              <dd>{formatDate(investor.joinDate)}</dd>
            </div>
          </dl>
          <p className="muted">{investor.email || investor.phone || investor.notes || "No contact details"}</p>
          {onEdit && onDelete ? (
            <div className="form-actions">
              <button type="button" className="o-btn o-btn-secondary" onClick={() => onEdit(investor)}>
                Edit
              </button>
              <button type="button" className="o-btn o-btn-danger" onClick={() => onDelete(investor._id)}>
                Delete
              </button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
