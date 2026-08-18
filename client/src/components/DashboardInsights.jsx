import { money } from "../utils/format.js";

export default function DashboardInsights({ summary = {}, transactions = [] }) {
  const recent = transactions[0];
  const totalIn = Number(summary.totalIn || 0);
  const totalOut = Number(summary.totalOut || 0);
  const balance = Number(summary.balance || 0);
  const burnRate = totalIn > 0 ? (totalOut / totalIn) * 100 : 0;

  return (
    <section className="insights-grid">
      <article className="card insight-card">
        <p className="eyebrow">Business Health</p>
        <h3>{balance >= 0 ? "Positive Cashflow" : "Attention Needed"}</h3>
        <p className="muted">
          Current balance is <strong>{money(balance)}</strong> with{" "}
          <strong>{burnRate.toFixed(1)}%</strong> outflow against inflow.
        </p>
      </article>

      <article className="card insight-card">
        <p className="eyebrow">Latest Activity</p>
        {recent ? (
          <>
            <h3>{recent.title}</h3>
            <p className="muted">
              {recent.type} of <strong>{money(recent.amount)}</strong> on{" "}
              {new Date(recent.date).toLocaleDateString()}.
            </p>
          </>
        ) : (
          <>
            <h3>No records yet</h3>
            <p className="muted">Add your first transaction to start live tracking.</p>
          </>
        )}
      </article>

      <article className="card insight-card highlight">
        <p className="eyebrow">Cash Snapshot</p>
        <h3>{money(totalIn)}</h3>
        <p className="muted">Total inflow tracked</p>
        <div className="mini-metrics">
          <span>Outflow: {money(totalOut)}</span>
          <span>Net: {money(balance)}</span>
        </div>
      </article>
    </section>
  );
}
