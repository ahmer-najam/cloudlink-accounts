import { useState } from "react";
import OdooField from "./OdooField.jsx";
import SearchableSelect from "./SearchableSelect.jsx";

const initialData = {
  type: "expense",
  title: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  notes: ""
};

const statuses = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
  { value: "investment", label: "Investment" },
  { value: "purchase", label: "Purchase" }
];

const typeOptions = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Customer Income" },
  { value: "investment", label: "Investment" },
  { value: "purchase", label: "Purchase" }
];

export default function TransactionForm({ onSubmit }) {
  const [formData, setFormData] = useState(initialData);
  const [tab, setTab] = useState("notes");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialData);
    setTab("notes");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...formData,
      amount: Number(formData.amount)
    });
    resetForm();
  };

  return (
    <form className="o-form-view" onSubmit={handleSubmit}>
      <div className="o-control-panel">
        <div className="o-cp-buttons">
          <button type="submit" className="o-btn o-btn-primary">
            Save
          </button>
          <button type="button" className="o-btn o-btn-secondary" onClick={resetForm}>
            Discard
          </button>
        </div>
        <div className="o-breadcrumb">
          <span>Finance</span>
          <span>/</span>
          <strong>New Transaction</strong>
        </div>
      </div>

      <div className="o-form-sheet-bg">
        <div className="o-form-sheet">
          <div className="o-statusbar">
            {statuses.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`o-status ${formData.type === item.value ? "active" : ""}`}
                onClick={() => setFormData((prev) => ({ ...prev, type: item.value }))}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="o-title">
            <input
              name="title"
              placeholder="Transaction title..."
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="o-group">
            <div className="o-inner-group">
              <div className="o-group-title">General Information</div>
              <OdooField label="Type" required>
                <SearchableSelect
                  options={typeOptions}
                  value={formData.type}
                  onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                  placeholder="Choose type"
                />
              </OdooField>
              <OdooField label="Date" required>
                <input name="date" type="date" value={formData.date} onChange={handleChange} required />
              </OdooField>
            </div>
            <div className="o-inner-group">
              <div className="o-group-title">Accounting</div>
              <OdooField label="Amount" required>
                <input
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </OdooField>
              <OdooField label="Reference">
                <input value={`TXN-${formData.type.toUpperCase()}`} readOnly />
              </OdooField>
            </div>
          </div>

          <div className="o-notebook">
            <div className="o-notebook-nav">
              <button type="button" className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>
                Notes
              </button>
              <button type="button" className={tab === "other" ? "active" : ""} onClick={() => setTab("other")}>
                Other Info
              </button>
            </div>
            <div className="o-notebook-page">
              {tab === "notes" ? (
                <OdooField label="Internal Note">
                  <textarea
                    name="notes"
                    rows="4"
                    placeholder="Add a note that will be displayed on the transaction"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </OdooField>
              ) : (
                <div className="o-help">
                  Use this form to record expenses, customer income, investments, and purchases. Required fields are
                  marked with a red asterisk.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
