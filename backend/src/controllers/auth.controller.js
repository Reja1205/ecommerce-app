const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * REGISTER
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || password.length < 8) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGIN
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash"
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // prod এ true
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Logged in",
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * LOGOUT
 */
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  return res.json({ message: "Logged out" });
};

/**
 * ME (current user)
 */
const me = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  logout,
  me,
};
