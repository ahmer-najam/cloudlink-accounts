import { useEffect, useMemo, useState } from "react";
import { addBank, fetchSettings, removeBank, updateCurrency } from "../services/api.js";
import { money, setCurrencyPreference } from "../utils/format.js";
import SearchableSelect from "../components/SearchableSelect.jsx";

const currencyOptions = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "PKR", label: "Pakistani Rupee (PKR)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "AED", label: "UAE Dirham (AED)" },
  { value: "SAR", label: "Saudi Riyal (SAR)" }
];

const defaultBank = {
  bankName: "",
  accountTitle: "",
  accountNumber: "",
  iban: "",
  branchCode: "",
  openingBalance: "",
  currency: "USD"
};

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [bankForm, setBankForm] = useState(defaultBank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const totalBankBalance = useMemo(() => {
    if (!settings?.banks) return 0;
    return settings.banks.reduce((sum, bank) => sum + Number(bank.openingBalance || 0), 0);
  }, [settings]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await fetchSettings();
      setSettings(data);
      setCurrency(data.currency || "USD");
      setBankForm((prev) => ({ ...prev, currency: data.currency || prev.currency }));
      setCurrencyPreference({ currency: data.currency, locale: data.locale || "en-US" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleCurrencySave = async () => {
    setSaving(true);
    try {
      const { data } = await updateCurrency({ currency, locale: "en-US" });
      setSettings(data);
      setCurrencyPreference({ currency: data.currency, locale: data.locale || "en-US" });
    } finally {
      setSaving(false);
    }
  };

  const handleBankSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...bankForm,
        openingBalance: Number(bankForm.openingBalance || 0)
      };
      const { data } = await addBank(payload);
      setSettings(data);
      setBankForm({ ...defaultBank, currency });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBank = async (bankId) => {
    setSaving(true);
    try {
      const { data } = await removeBank(bankId);
      setSettings(data);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="card">Loading settings...</div>;
  }

  return (
    <>
      <div className="o-control-panel">
        <div className="o-breadcrumb">
          <strong>Settings</strong>
        </div>
      </div>

      <section className="o-form-sheet-bg">
        <div className="o-form-sheet">
          <div className="o-group">
            <div className="o-inner-group">
              <div className="o-group-title">Currency Setup</div>
              <div className="o-field">
                <label className="o-label">Base Currency</label>
                <div className="o-input-wrap">
                  <SearchableSelect
                    options={currencyOptions}
                    value={currency}
                    onChange={setCurrency}
                    placeholder="Select base currency"
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Action</label>
                <div className="o-input-wrap">
                  <button type="button" className="o-btn o-btn-primary" onClick={handleCurrencySave} disabled={saving}>
                    Save Currency
                  </button>
                </div>
              </div>
            </div>

            <div className="o-inner-group">
              <div className="o-group-title">Bank Summary</div>
              <div className="o-help">Total bank accounts: {settings.banks.length}</div>
              <div className="o-help">Combined opening balance: {money(totalBankBalance)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="o-form-sheet-bg">
        <form className="o-form-sheet" onSubmit={handleBankSubmit}>
          <div className="o-group-title">Bank Setup</div>
          <div className="o-group">
            <div className="o-inner-group">
              <div className="o-field">
                <label className="o-label">Bank Name</label>
                <div className="o-input-wrap">
                  <input
                    required
                    value={bankForm.bankName}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, bankName: event.target.value }))}
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Account Title</label>
                <div className="o-input-wrap">
                  <input
                    required
                    value={bankForm.accountTitle}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, accountTitle: event.target.value }))}
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Account Number</label>
                <div className="o-input-wrap">
                  <input
                    required
                    value={bankForm.accountNumber}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, accountNumber: event.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="o-inner-group">
              <div className="o-field">
                <label className="o-label">IBAN</label>
                <div className="o-input-wrap">
                  <input
                    value={bankForm.iban}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, iban: event.target.value }))}
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Branch Code</label>
                <div className="o-input-wrap">
                  <input
                    value={bankForm.branchCode}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, branchCode: event.target.value }))}
                  />
                </div>
              </div>
              <div className="o-field">
                <label className="o-label">Opening Balance</label>
                <div className="o-input-wrap">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bankForm.openingBalance}
                    onChange={(event) => setBankForm((prev) => ({ ...prev, openingBalance: event.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit" className="o-btn o-btn-primary" disabled={saving}>
              Add Bank Account
            </button>
          </div>
        </form>
      </section>

      <section className="o-list-view">
        <div className="o-control-panel">
          <div className="o-breadcrumb">
            <strong>Configured Banks</strong>
          </div>
        </div>
        <div className="card table-wrapper o-tree">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Bank</th>
                  <th>Account Title</th>
                  <th>Account Number</th>
                  <th>IBAN</th>
                  <th>Balance</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {settings.banks.length === 0 ? (
                  <tr>
                    <td colSpan="6">No bank accounts configured yet.</td>
                  </tr>
                ) : (
                  settings.banks.map((bank) => (
                    <tr key={bank._id}>
                      <td>{bank.bankName}</td>
                      <td>{bank.accountTitle}</td>
                      <td>{bank.accountNumber}</td>
                      <td>{bank.iban || "-"}</td>
                      <td>{money(bank.openingBalance)}</td>
                      <td>
                        <button
                          type="button"
                          className="o-btn o-btn-danger"
                          onClick={() => handleDeleteBank(bank._id)}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
