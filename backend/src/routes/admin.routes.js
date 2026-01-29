const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth.middleware");
const { requireAdmin } = require("../middlewares/admin.middleware");

const {
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  listAllOrders,
  updateOrderStatus,
} = require("../controllers/adminOrder.controller");

// Admin product management
router.get("/products/:id", requireAuth, requireAdmin, getProductByIdAdmin);
router.post("/products", requireAuth, requireAdmin, createProduct);
router.patch("/products/:id", requireAuth, requireAdmin, updateProduct);
router.delete("/products/:id", requireAuth, requireAdmin, deleteProduct);

// Admin order management
router.get("/orders", requireAuth, requireAdmin, listAllOrders);
router.patch("/orders/:id/status", requireAuth, requireAdmin, updateOrderStatus);

module.exports = router;
