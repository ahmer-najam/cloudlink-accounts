import { useEffect, useState } from "react";
import InvestorForm from "../components/InvestorForm.jsx";
import InvestorGrid from "../components/InvestorGrid.jsx";
import InvestorSummary from "../components/InvestorSummary.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  addInvestor,
  fetchInvestorSummary,
  fetchInvestors,
  removeInvestor,
  updateInvestor
} from "../services/api.js";

const filters = ["all", "active", "inactive"];

export default function Investors() {
  const { permissions } = useAuth();
  const [summary, setSummary] = useState({});
  const [investors, setInvestors] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (selectedFilter = filter) => {
    setLoading(true);
    try {
      const [summaryRes, investorsRes] = await Promise.all([
        fetchInvestorSummary(),
        fetchInvestors(selectedFilter)
      ]);
      setSummary(summaryRes.data);
      setInvestors(investorsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData("all");
  }, []);

  const handleSave = async (payload) => {
    if (editing) {
      await updateInvestor(editing._id, payload);
      setEditing(null);
    } else {
      await addInvestor(payload);
    }
    await loadData(filter);
  };

  const handleDelete = async (id) => {
    await removeInvestor(id);
    if (editing?._id === id) {
      setEditing(null);
    }
    await loadData(filter);
  };

  const handleFilter = async (nextFilter) => {
    setFilter(nextFilter);
    await loadData(nextFilter);
  };

  return (
    <>
      {permissions.investorsWrite ? (
        <InvestorForm
          editing={editing}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      <InvestorSummary summary={summary} />

      <section className="o-list-view">
        <div className="o-control-panel">
          <div className="o-breadcrumb">
            <strong>Investors</strong>
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
          <div className="card">Loading investors...</div>
        ) : (
          <InvestorGrid
            investors={investors}
            onEdit={permissions.investorsWrite ? setEditing : undefined}
            onDelete={permissions.investorsWrite ? handleDelete : undefined}
          />
        )}
      </section>
    </>
  );
}
