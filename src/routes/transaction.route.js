const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const transactionRouter = express.Router();

transactionRouter.post(
  "/",
  authMiddleware,
  transactionController.createTransactionController,
);

module.exports = transactionRouter;
