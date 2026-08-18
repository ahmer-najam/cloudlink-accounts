import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardInsights from "../components/DashboardInsights.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import TransactionTable from "../components/TransactionTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchInvestorSummary, fetchSummary, fetchTransactions, removeTransaction } from "../services/api.js";

export default function Dashboard() {
  const { permissions } = useAuth();
  const [summary, setSummary] = useState({});
  const [investors, setInvestors] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summaryRes, investorRes, transactionsRes] = await Promise.all([
        fetchSummary(),
        fetchInvestorSummary(),
        fetchTransactions("all")
      ]);
      setSummary(summaryRes.data);
      setInvestors(investorRes.data);
      setTransactions(transactionsRes.data.slice(0, 8));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="o-control-panel">
        <div className="o-breadcrumb">
          <strong>Dashboard</strong>
        </div>
        <div className="o-cp-buttons">
          {permissions.financeWrite ? (
            <Link to="/finance" className="o-btn o-btn-primary">
              New Transaction
            </Link>
          ) : null}
          {permissions.investorsWrite ? (
            <Link to="/investors" className="o-btn o-btn-secondary">
              New Investor
            </Link>
          ) : null}
        </div>
      </div>

      <SummaryCards summary={summary} />
      <DashboardInsights summary={{ ...summary, ...investors }} transactions={transactions} />

      {loading ? (
        <div className="card">Loading dashboard...</div>
      ) : (
        <TransactionTable
          rows={transactions}
          onDelete={
            permissions.financeWrite
              ? async (id) => {
                  await removeTransaction(id);
                  await loadData();
                }
              : undefined
          }
        />
      )}
    </>
  );
}
