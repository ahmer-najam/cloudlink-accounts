import { money } from "../utils/format.js";

const formatDate = (value) => new Date(value).toLocaleDateString();

export default function TransactionTable({ rows, onDelete }) {
  return (
    <div className="card table-wrapper o-tree">
      <h2>Records</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Notes</th>
              {onDelete ? <th /> : null}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={onDelete ? "6" : "5"}>No records found.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id}>
                  <td className="capitalize">{row.type}</td>
                  <td>{row.title}</td>
                  <td>{money(row.amount)}</td>
                  <td>{formatDate(row.date)}</td>
                  <td>{row.notes || "-"}</td>
                  {onDelete ? (
                    <td>
                      <button type="button" className="o-btn o-btn-danger" onClick={() => onDelete(row._id)}>
                        Delete
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
