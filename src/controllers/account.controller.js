const accountModel = require("../models/account.model");

const createAccountController = async (req, res) => {
  try {
    const { userId } = req.user;

    const account = await accountModel.create({
      user: userId,
    });
    res.status(201).json({ account });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createAccountController };
