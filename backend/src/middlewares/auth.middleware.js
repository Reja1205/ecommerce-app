const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId).select("_id email role");
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    req.user = user; // attach logged-in user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

module.exports = { requireAuth };
