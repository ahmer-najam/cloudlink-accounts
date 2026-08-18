import { money } from "../utils/format.js";

const cardConfig = [
  { key: "income", label: "Customer Income" },
  { key: "investment", label: "Investments" },
  { key: "expense", label: "Expenses" },
  { key: "purchase", label: "Purchases" },
  { key: "balance", label: "Balance" }
];

export default function SummaryCards({ summary }) {
  return (
    <section className="summary-grid">
      {cardConfig.map((card) => (
        <article className="o-stat-btn" key={card.key}>
          <span>{card.label}</span>
          <strong>{money(summary?.[card.key])}</strong>
        </article>
      ))}
    </section>
  );
}
