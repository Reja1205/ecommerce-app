const express = require("express");
const router = express.Router();

const { register, login, logout, me } = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);

// protected
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);

module.exports = router;
