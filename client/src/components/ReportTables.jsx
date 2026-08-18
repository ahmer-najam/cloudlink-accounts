import { money, prettyDate, TYPE_LABELS } from "../utils/format.js";

export default function ReportTables({ report }) {
  return (
    <section className="tables-grid">
      {["income", "expense", "investment", "purchase"].map((type) => (
        <article className="card table-wrapper" key={type}>
          <h2>Top {TYPE_LABELS[type]}</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {report.top?.[type]?.length ? (
                  report.top[type].map((row) => (
                    <tr key={row.id}>
                      <td>{row.title}</td>
                      <td>{money(row.amount)}</td>
                      <td>{prettyDate(row.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      ))}

      <article className="card table-wrapper span-2">
        <h2>Investor Positions</h2>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Investor</th>
                <th>Status</th>
                <th>Capital</th>
                <th>Ownership</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {report.investors?.list?.length ? (
                report.investors.list.map((row) => (
                  <tr key={row.id}>
                    <td>{row.name}</td>
                    <td className="capitalize">{row.status}</td>
                    <td>{money(row.investedAmount)}</td>
                    <td>{row.ownershipPercent}%</td>
                    <td>{prettyDate(row.joinDate)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No investors yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
