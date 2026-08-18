import { money } from "../utils/format.js";

const cards = [
  { key: "totalInvestors", label: "Total Investors" },
  { key: "activeInvestors", label: "Active Partners" },
  { key: "totalCapital", label: "Total Capital", money: true },
  { key: "ownershipAssigned", label: "Ownership Assigned", percent: true },
  { key: "ownershipAvailable", label: "Ownership Available", percent: true }
];

export default function InvestorSummary({ summary }) {
  return (
    <section className="summary-grid">
      {cards.map((card) => {
        const value = summary?.[card.key] || 0;
        const display = card.money
          ? money(value)
          : card.percent
            ? `${Number(value).toFixed(1)}%`
            : value;

        return (
          <article className="o-stat-btn" key={card.key}>
            <span>{card.label}</span>
            <strong>{display}</strong>
          </article>
        );
      })}
    </section>
  );
}
