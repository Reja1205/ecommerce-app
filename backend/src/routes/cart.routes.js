const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const {
  getCart,
  addItem,
  updateQty,
  removeItem,
} = require("../controllers/cart.controller");

router.get("/", requireAuth, getCart);
router.post("/items", requireAuth, addItem);
router.patch("/items/:productId", requireAuth, updateQty);
router.delete("/items/:productId", requireAuth, removeItem);

module.exports = router;
