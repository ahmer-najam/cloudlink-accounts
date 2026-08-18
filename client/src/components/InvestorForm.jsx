import { useEffect, useState } from "react";
import OdooField from "./OdooField.jsx";
import SearchableSelect from "./SearchableSelect.jsx";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  investedAmount: "",
  ownershipPercent: "",
  joinDate: new Date().toISOString().slice(0, 10),
  status: "active",
  notes: ""
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

export default function InvestorForm({ onSubmit, editing, onCancel }) {
  const [formData, setFormData] = useState(emptyForm);
  const [tab, setTab] = useState("notes");

  useEffect(() => {
    if (editing) {
      setFormData({
        name: editing.name || "",
        email: editing.email || "",
        phone: editing.phone || "",
        investedAmount: editing.investedAmount ?? "",
        ownershipPercent: editing.ownershipPercent ?? "",
        joinDate: editing.joinDate ? editing.joinDate.slice(0, 10) : emptyForm.joinDate,
        status: editing.status || "active",
        notes: editing.notes || ""
      });
      return;
    }

    setFormData(emptyForm);
  }, [editing]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDiscard = () => {
    if (editing) {
      onCancel();
      return;
    }
    setFormData(emptyForm);
    setTab("notes");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      investedAmount: Number(formData.investedAmount),
      ownershipPercent: Number(formData.ownershipPercent)
    });
    if (!editing) {
      setFormData(emptyForm);
      setTab("notes");
    }
  };

  return (
    <form className="o-form-view" onSubmit={handleSubmit}>
      <div className="o-control-panel">
        <div className="o-cp-buttons">
          <button type="submit" className="o-btn o-btn-primary">
            {editing ? "Save" : "Create"}
          </button>
          <button type="button" className="o-btn o-btn-secondary" onClick={handleDiscard}>
            Discard
          </button>
        </div>
        <div className="o-breadcrumb">
          <span>Investors</span>
          <span>/</span>
          <strong>{editing ? editing.name : "New"}</strong>
        </div>
      </div>

      <div className="o-form-sheet-bg">
        <div className="o-form-sheet">
          <div className="o-statusbar">
            <button
              type="button"
              className={`o-status ${formData.status === "active" ? "active" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, status: "active" }))}
            >
              Active
            </button>
            <button
              type="button"
              className={`o-status ${formData.status === "inactive" ? "active" : ""}`}
              onClick={() => setFormData((prev) => ({ ...prev, status: "inactive" }))}
            >
              Inactive
            </button>
          </div>

          <div className="o-title">
            <input
              name="name"
              placeholder="Investor name..."
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="o-group">
            <div className="o-inner-group">
              <div className="o-group-title">Contact</div>
              <OdooField label="Email">
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </OdooField>
              <OdooField label="Phone">
                <input name="phone" placeholder="+92..." value={formData.phone} onChange={handleChange} />
              </OdooField>
              <OdooField label="Join Date" required>
                <input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} required />
              </OdooField>
            </div>
            <div className="o-inner-group">
              <div className="o-group-title">Investment</div>
              <OdooField label="Capital" required>
                <input
                  name="investedAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.investedAmount}
                  onChange={handleChange}
                  required
                />
              </OdooField>
              <OdooField label="Ownership" required>
                <input
                  name="ownershipPercent"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  value={formData.ownershipPercent}
                  onChange={handleChange}
                  required
                />
              </OdooField>
              <OdooField label="Status">
                <SearchableSelect
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  placeholder="Choose status"
                />
              </OdooField>
            </div>
          </div>

          <div className="o-notebook">
            <div className="o-notebook-nav">
              <button type="button" className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>
                Internal Notes
              </button>
              <button type="button" className={tab === "other" ? "active" : ""} onClick={() => setTab("other")}>
                Extra Info
              </button>
            </div>
            <div className="o-notebook-page">
              {tab === "notes" ? (
                <OdooField label="Notes">
                  <textarea
                    name="notes"
                    rows="4"
                    placeholder="Agreement terms, reminders, or partner remarks"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </OdooField>
              ) : (
                <div className="o-help">
                  Ownership should total 100% across active partners. Inactive investors stay in history but are excluded
                  from available ownership.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
