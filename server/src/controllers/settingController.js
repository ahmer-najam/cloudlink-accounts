import BusinessSetting from "../models/BusinessSetting.js";

const defaultSetting = {
  currency: "USD",
  locale: "en-US",
  banks: []
};

const getOrCreateSetting = async () => {
  let setting = await BusinessSetting.findOne({});
  if (!setting) {
    setting = await BusinessSetting.create(defaultSetting);
  }
  return setting;
};

export const getSettings = async (_req, res) => {
  try {
    const setting = await getOrCreateSetting();
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error: error.message });
  }
};

export const updateCurrency = async (req, res) => {
  try {
    const { currency, locale } = req.body;
    if (!currency) {
      return res.status(400).json({ message: "Currency is required" });
    }

    const setting = await getOrCreateSetting();
    setting.currency = String(currency).toUpperCase();
    if (locale) {
      setting.locale = locale;
    }

    await setting.save();
    return res.json(setting);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update currency", error: error.message });
  }
};

export const addBank = async (req, res) => {
  try {
    const { bankName, accountTitle, accountNumber, iban, branchCode, openingBalance, currency } = req.body;
    if (!bankName || !accountTitle || !accountNumber) {
      return res.status(400).json({ message: "bankName, accountTitle and accountNumber are required" });
    }

    const setting = await getOrCreateSetting();
    setting.banks.push({
      bankName,
      accountTitle,
      accountNumber,
      iban: iban || "",
      branchCode: branchCode || "",
      openingBalance: Number(openingBalance || 0),
      currency: (currency || setting.currency || "USD").toUpperCase()
    });

    await setting.save();
    return res.status(201).json(setting);
  } catch (error) {
    return res.status(400).json({ message: "Failed to add bank", error: error.message });
  }
};

export const updateBank = async (req, res) => {
  try {
    const setting = await getOrCreateSetting();
    const bank = setting.banks.id(req.params.bankId);

    if (!bank) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const payload = req.body;
    if (payload.bankName !== undefined) bank.bankName = payload.bankName;
    if (payload.accountTitle !== undefined) bank.accountTitle = payload.accountTitle;
    if (payload.accountNumber !== undefined) bank.accountNumber = payload.accountNumber;
    if (payload.iban !== undefined) bank.iban = payload.iban;
    if (payload.branchCode !== undefined) bank.branchCode = payload.branchCode;
    if (payload.openingBalance !== undefined) bank.openingBalance = Number(payload.openingBalance || 0);
    if (payload.currency !== undefined) bank.currency = String(payload.currency).toUpperCase();

    await setting.save();
    return res.json(setting);
  } catch (error) {
    return res.status(400).json({ message: "Failed to update bank", error: error.message });
  }
};

export const deleteBank = async (req, res) => {
  try {
    const setting = await getOrCreateSetting();
    const bank = setting.banks.id(req.params.bankId);

    if (!bank) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    setting.banks.pull(req.params.bankId);
    await setting.save();

    return res.json(setting);
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete bank", error: error.message });
  }
};
