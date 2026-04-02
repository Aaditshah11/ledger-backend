const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountRouter = express.Router();
const accountController = require("../controllers/account.controller");

accountRouter.post(
  "/",
  authMiddleware,
  accountController.createAccountController,
);

module.exports = accountRouter;
