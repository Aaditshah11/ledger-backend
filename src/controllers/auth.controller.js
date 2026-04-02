const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  try {
    const { email, name, password } = req.body;

    const exists = await userModel.findOne({ email });

    if (exists)
      return res
        .status(422)
        .json({ message: "user already exists", status: "failed" });

    const user = await userModel.create({
      email,
      password,
      name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * - user login controller
 * - POST /api/auth/login
 */

async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "email or password is invalid" });

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword)
      return res.status(401).json({ message: "email or password is invalid" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { userRegisterController, userLoginController };
