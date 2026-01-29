const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const { listMyOrders, getMyOrderById } = require("../controllers/order.controller");

router.get("/", requireAuth, listMyOrders);
router.get("/:id", requireAuth, getMyOrderById);

module.exports = router;
