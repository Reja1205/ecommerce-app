const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const { checkout } = require("../controllers/checkout.controller");

router.post("/", requireAuth, checkout);

module.exports = router;
