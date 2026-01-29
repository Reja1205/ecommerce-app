const express = require("express");
const router = express.Router();

const {
  listProducts,
  getProductBySlug,
} = require("../controllers/product.controller");

router.get("/", listProducts);
router.get("/:slug", getProductBySlug);

module.exports = router;
