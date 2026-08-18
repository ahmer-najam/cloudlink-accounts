import { money, percent } from "../utils/format.js";

const kpiConfig = [
  { key: "income", label: "Customer Income", tone: "teal" },
  { key: "expense", label: "Expenses", tone: "red" },
  { key: "netProfit", label: "Net Profit", tone: "green" },
  { key: "cashPosition", label: "Cash Position", tone: "blue" },
  { key: "investment", label: "Investments", tone: "blue" },
  { key: "purchase", label: "Purchases", tone: "orange" },
  { key: "profitMargin", label: "Profit Margin", tone: "teal", percent: true },
  { key: "transactionCount", label: "Records", tone: "navy", raw: true }
];

export default function ReportKpis({ kpis = {} }) {
  return (
    <section className="summary-grid">
      {kpiConfig.map((card) => {
        const value = kpis[card.key] || 0;
        const display = card.percent ? percent(value) : card.raw ? value : money(value);
        return (
          <article className={`o-stat-btn kpi-${card.tone}`} key={card.key}>
            <span>{card.label}</span>
            <strong>{display}</strong>
          </article>
        );
      })}
    </section>
  );
}
