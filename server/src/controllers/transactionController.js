import Transaction from "../models/Transaction.js";

export const getTransactions = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: "Failed to create transaction", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update transaction", error: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Transaction deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete transaction", error: error.message });
  }
};

export const getSummary = async (_req, res) => {
  try {
    const transactions = await Transaction.find({});

    const summary = transactions.reduce(
      (acc, item) => {
        acc[item.type] += item.amount;
        if (item.type === "income" || item.type === "investment") {
          acc.totalIn += item.amount;
        } else {
          acc.totalOut += item.amount;
        }
        return acc;
      },
      {
        expense: 0,
        income: 0,
        investment: 0,
        purchase: 0,
        totalIn: 0,
        totalOut: 0
      }
    );

    summary.balance = summary.totalIn - summary.totalOut;
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to build summary", error: error.message });
  }
};
