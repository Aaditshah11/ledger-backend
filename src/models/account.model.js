const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Acc must be associated with a user"],
      index: true,
    },

    status: {
      type: String,
      default: "ACTIVE",
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Enter a valid account status",
      },
    },

    currency: {
      type: String,
      required: [true, "Currency is required"],
      default: "INR",
    },
  },
  { timestamps: true },
);

accountSchema.index({ user: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
  const balance = await ledgerModel.aggregate([
    {
      $match: {
        account: this._id,
      },
    },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "debit"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "credit"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        balance: { $subtract: ["$totalCredit", "$totalDebit"] },
      },
    },
  ]);

  if (balance.length === 0) {
    return 0;
  }

  return balance[0].balance;
};

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;
