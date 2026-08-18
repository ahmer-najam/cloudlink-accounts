import Transaction from "../models/Transaction.js";
import Investor from "../models/Investor.js";

const TYPES = ["income", "investment", "expense", "purchase"];

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const monthKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const emptyTotals = () => ({
  income: 0,
  investment: 0,
  expense: 0,
  purchase: 0,
  count: 0
});

export const getReport = async (req, res) => {
  try {
    const from = req.query.from ? startOfDay(req.query.from) : null;
    const to = req.query.to ? endOfDay(req.query.to) : null;

    const dateFilter = {};
    if (from || to) {
      dateFilter.date = {};
      if (from) dateFilter.date.$gte = from;
      if (to) dateFilter.date.$lte = to;
    }

    const [transactions, investors] = await Promise.all([
      Transaction.find(dateFilter).sort({ date: -1, createdAt: -1 }),
      Investor.find({}).sort({ investedAmount: -1 })
    ]);

    const totals = emptyTotals();
    const counts = { income: 0, investment: 0, expense: 0, purchase: 0 };
    const monthlyMap = new Map();

    transactions.forEach((item) => {
      totals[item.type] += item.amount;
      totals.count += 1;
      counts[item.type] += 1;

      const key = monthKey(new Date(item.date));
      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, { month: key, ...emptyTotals() });
      }
      const row = monthlyMap.get(key);
      row[item.type] += item.amount;
      row.count += 1;
    });

    const totalIn = totals.income + totals.investment;
    const totalOut = totals.expense + totals.purchase;
    const netProfit = totals.income - totals.expense - totals.purchase;
    const cashPosition = totalIn - totalOut;
    const profitMargin = totals.income ? (netProfit / totals.income) * 100 : 0;

    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((row) => ({
        ...row,
        totalIn: row.income + row.investment,
        totalOut: row.expense + row.purchase,
        net: row.income - row.expense - row.purchase
      }));

    const breakdown = TYPES.map((type) => ({
      type,
      amount: totals[type],
      count: counts[type],
      share: totals.count ? (counts[type] / totals.count) * 100 : 0
    }));

    const byType = (type, limit = 8) =>
      transactions
        .filter((item) => item.type === type)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, limit)
        .map((item) => ({
          id: item._id,
          title: item.title,
          amount: item.amount,
          date: item.date,
          notes: item.notes
        }));

    const investorTotals = investors.reduce(
      (acc, item) => {
        acc.totalCapital += item.investedAmount;
        acc.ownershipAssigned += item.status === "active" ? item.ownershipPercent : 0;
        if (item.status === "active") acc.active += 1;
        return acc;
      },
      { totalCapital: 0, ownershipAssigned: 0, active: 0 }
    );

    res.json({
      period: {
        from: from ? from.toISOString() : null,
        to: to ? to.toISOString() : null,
        generatedAt: new Date().toISOString()
      },
      kpis: {
        ...totals,
        totalIn,
        totalOut,
        netProfit,
        cashPosition,
        profitMargin,
        transactionCount: totals.count
      },
      breakdown,
      monthly,
      top: {
        income: byType("income"),
        expense: byType("expense"),
        investment: byType("investment"),
        purchase: byType("purchase")
      },
      transactions: transactions.map((item) => ({
        id: item._id,
        type: item.type,
        title: item.title,
        amount: item.amount,
        date: item.date,
        notes: item.notes
      })),
      investors: {
        total: investors.length,
        active: investorTotals.active,
        totalCapital: investorTotals.totalCapital,
        ownershipAssigned: investorTotals.ownershipAssigned,
        ownershipAvailable: Math.max(0, 100 - investorTotals.ownershipAssigned),
        list: investors.map((item) => ({
          id: item._id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          investedAmount: item.investedAmount,
          ownershipPercent: item.ownershipPercent,
          status: item.status,
          joinDate: item.joinDate,
          notes: item.notes
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to build report", error: error.message });
  }
};
