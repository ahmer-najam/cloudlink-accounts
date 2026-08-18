import mongoose from "mongoose";

const investorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    investedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    ownershipPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    joinDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Investor", investorSchema);
