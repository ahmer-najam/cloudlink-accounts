import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { money, prettyMonth, TYPE_COLORS, TYPE_LABELS } from "../utils/format.js";

const pieColors = Object.values(TYPE_COLORS);

export default function ReportCharts({ monthly = [], breakdown = [] }) {
  const pieData = breakdown.map((item) => ({
    name: TYPE_LABELS[item.type],
    value: item.amount
  }));

  const barData = monthly.map((item) => ({
    ...item,
    label: prettyMonth(item.month)
  }));

  return (
    <section className="charts-grid">
      <article className="card chart-card">
        <h2>Monthly Performance</h2>
        <p className="muted">Income, spending, and capital over time</p>
        <div className="chart-wrap">
          {barData.length === 0 ? (
            <div className="empty-state compact">No monthly data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Legend />
                <Bar dataKey="income" name="Income" fill={TYPE_COLORS.income} radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill={TYPE_COLORS.expense} radius={[6, 6, 0, 0]} />
                <Bar dataKey="investment" name="Investment" fill={TYPE_COLORS.investment} radius={[6, 6, 0, 0]} />
                <Bar dataKey="purchase" name="Purchase" fill={TYPE_COLORS.purchase} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="card chart-card">
        <h2>Money Mix</h2>
        <p className="muted">Share of income, investments, expenses, and purchases</p>
        <div className="chart-wrap">
          {pieData.every((item) => !item.value) ? (
            <div className="empty-state compact">No amounts to chart yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={3}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => money(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </section>
  );
}
