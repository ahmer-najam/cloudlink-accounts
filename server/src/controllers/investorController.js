import Investor from "../models/Investor.js";

export const getInvestors = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status && status !== "all" ? { status } : {};
    const investors = await Investor.find(query).sort({ investedAmount: -1, createdAt: -1 });
    res.json(investors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch investors", error: error.message });
  }
};

export const createInvestor = async (req, res) => {
  try {
    const investor = await Investor.create(req.body);
    res.status(201).json(investor);
  } catch (error) {
    res.status(400).json({ message: "Failed to create investor", error: error.message });
  }
};

export const updateInvestor = async (req, res) => {
  try {
    const updated = await Investor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Investor not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update investor", error: error.message });
  }
};

export const deleteInvestor = async (req, res) => {
  try {
    const deleted = await Investor.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Investor not found" });
    }

    return res.json({ message: "Investor deleted" });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete investor", error: error.message });
  }
};

export const getInvestorSummary = async (_req, res) => {
  try {
    const investors = await Investor.find({});
    const active = investors.filter((item) => item.status === "active");

    const totalCapital = investors.reduce((sum, item) => sum + item.investedAmount, 0);
    const activeCapital = active.reduce((sum, item) => sum + item.investedAmount, 0);
    const ownershipAssigned = active.reduce((sum, item) => sum + item.ownershipPercent, 0);

    res.json({
      totalInvestors: investors.length,
      activeInvestors: active.length,
      totalCapital,
      activeCapital,
      ownershipAssigned,
      ownershipAvailable: Math.max(0, 100 - ownershipAssigned)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to build investor summary", error: error.message });
  }
};
