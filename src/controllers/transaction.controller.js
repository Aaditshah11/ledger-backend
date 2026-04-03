const transactionModel = require("../models/transaction.model");
const createTransactionController = async (req, res) => {
  try {
    /**
     * validate request body
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const fromUserAccount = await accountModel.findById(fromAccount);
    const toUserAccount = await accountModel.findById(toAccount);

    if (!fromUserAccount || !toUserAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    /**
     * check idempotency key
     */
    const existingTransaction = await transactionModel.findOne({
      idempotencyKey,
    });
    if (existingTransaction) {
      if (existingTransaction.status === "completed") {
        return res
          .status(400)
          .json(
            { message: "Transaction already completed" },
            existingTransaction,
          );
      }
      if (existingTransaction.status === "pending") {
        return res.status(400).json({ message: "Transaction pending" });
      }
      if (existingTransaction.status === "failed") {
        return res.status(400).json({ message: "Transaction failed" });
      }
      if (existingTransaction.status === "reversed") {
        return res
          .status(400)
          .json({ message: "Transaction reversed, please retry" });
      }
    }

    /**
     * check acount status
     */
    if (
      fromUserAccount.status !== "active" ||
      toUserAccount.status !== "active"
    ) {
      return res.status(400).json({ message: "Account is not active" });
    }

    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const transaction = await transactionModel.create({
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
    });
    res.status(201).json({ transaction });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createTransactionController };
