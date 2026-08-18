import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    bankName: { type: String, required: true, trim: true },
    accountTitle: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    iban: { type: String, default: "", trim: true },
    branchCode: { type: String, default: "", trim: true },
    openingBalance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD", trim: true }
  },
  { _id: true }
);

const businessSettingSchema = new mongoose.Schema(
  {
    currency: { type: String, default: "USD", trim: true },
    locale: { type: String, default: "en-US", trim: true },
    banks: { type: [bankSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("BusinessSetting", businessSettingSchema);
