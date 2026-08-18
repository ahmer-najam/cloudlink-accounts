import { useEffect, useMemo, useState } from "react";
import ReportCharts from "../components/ReportCharts.jsx";
import ReportKpis from "../components/ReportKpis.jsx";
import ReportTables from "../components/ReportTables.jsx";
import { fetchReport } from "../services/api.js";
import { exportReportPdf } from "../utils/exportReportPdf.js";
import { endOfMonth, startOfMonth, startOfYear, toInputDate } from "../utils/format.js";

const today = new Date();

const presets = [
  { id: "this-month", label: "This Month", from: toInputDate(startOfMonth(today)), to: toInputDate(endOfMonth(today)) },
  { id: "last-month", label: "Last Month", from: toInputDate(startOfMonth(new Date(today.getFullYear(), today.getMonth() - 1, 1))), to: toInputDate(endOfMonth(new Date(today.getFullYear(), today.getMonth() - 1, 1))) },
  { id: "this-year", label: "This Year", from: toInputDate(startOfYear(today)), to: toInputDate(today) },
  { id: "all", label: "All Time", from: "", to: "" }
];

export default function Reports() {
  const [preset, setPreset] = useState("this-month");
  const [from, setFrom] = useState(presets[0].from);
  const [to, setTo] = useState(presets[0].to);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const rangeLabel = useMemo(
    () => presets.find((item) => item.id === preset)?.label || "Custom Range",
    [preset]
  );

  const loadReport = async (nextFrom = from, nextTo = to) => {
    setLoading(true);
    try {
      const response = await fetchReport({ from: nextFrom, to: nextTo });
      setReport(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport(from, to);
  }, []);

  const applyPreset = (item) => {
    setPreset(item.id);
    setFrom(item.from);
    setTo(item.to);
    loadReport(item.from, item.to);
  };

  const applyCustom = (event) => {
    event.preventDefault();
    setPreset("custom");
    loadReport(from, to);
  };

  const handleExport = () => {
    if (!report) return;
    setExporting(true);
    try {
      exportReportPdf(report, rangeLabel);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <div className="o-control-panel">
        <div className="o-cp-buttons">
          <button type="button" className="o-btn o-btn-primary" onClick={handleExport} disabled={!report || exporting}>
            {exporting ? "Preparing PDF..." : "Export PDF"}
          </button>
        </div>
        <div className="o-breadcrumb">
          <strong>Reports</strong>
          <span>/</span>
          <span>{rangeLabel}</span>
        </div>
      </div>

      <form className="o-form-view" onSubmit={applyCustom}>
        <div className="o-form-sheet-bg">
          <div className="o-form-sheet">
            <div className="o-title">
              <input readOnly value="Business Performance Report" />
            </div>
            <div className="filter-row" style={{ marginBottom: 16 }}>
              {presets.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={preset === item.id ? "active" : ""}
                  onClick={() => applyPreset(item)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="o-group">
              <div className="o-inner-group">
                <div className="o-group-title">Period</div>
                <div className="o-field">
                  <label className="o-label">Start Date</label>
                  <div className="o-input-wrap">
                    <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
                  </div>
                </div>
                <div className="o-field">
                  <label className="o-label">End Date</label>
                  <div className="o-input-wrap">
                    <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
                  </div>
                </div>
              </div>
              <div className="o-inner-group">
                <div className="o-group-title">Actions</div>
                <div className="o-help">Choose a preset or enter a custom date range, then apply.</div>
                <button type="submit" className="o-btn o-btn-primary">
                  Apply Range
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {loading || !report ? (
        <div className="card">Building your report...</div>
      ) : (
        <>
          <ReportKpis kpis={report.kpis} />
          <ReportCharts monthly={report.monthly} breakdown={report.breakdown} />
          <ReportTables report={report} />
        </>
      )}
    </>
  );
}
