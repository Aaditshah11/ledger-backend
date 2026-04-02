const mongoose = require("mongoose");

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

const accountModel = mongoose.model("account", accountSchema);

module.exports = accountModel;
