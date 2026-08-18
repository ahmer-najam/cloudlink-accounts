import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { addTransaction, fetchTransactions, removeTransaction } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const filters = ["all", "income", "investment", "expense", "purchase"];

export default function Finance() {
  const { permissions } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const loadData = async (selectedFilter = filter) => {
    setLoading(true);
    try {
      const transactionsRes = await fetchTransactions(selectedFilter);
      setTransactions(transactionsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData("all");
  }, []);

  const handleAdd = async (payload) => {
    await addTransaction(payload);
    await loadData(filter);
  };

  const handleDelete = async (id) => {
    await removeTransaction(id);
    await loadData(filter);
  };

  const handleFilter = async (nextFilter) => {
    setFilter(nextFilter);
    await loadData(nextFilter);
  };

  return (
    <>
      {permissions.financeWrite ? <TransactionForm onSubmit={handleAdd} /> : null}

      <section className="o-list-view">
        <div className="o-control-panel">
          <div className="o-breadcrumb">
            <strong>Transactions</strong>
          </div>
          <div className="filter-row">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? "active" : ""}
                onClick={() => handleFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="card">Loading records...</div>
        ) : (
          <TransactionTable rows={transactions} onDelete={permissions.financeWrite ? handleDelete : undefined} />
        )}
      </section>
    </>
  );
}
