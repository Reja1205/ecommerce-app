const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
};

/**
 * GET /api/cart
 */
const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/cart/items
 * body: { productId, qty }
 */
const addItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const addQty = qty === undefined ? 1 : Number(qty);
    if (!Number.isFinite(addQty) || addQty < 1) {
      return res.status(400).json({ message: "qty must be >= 1" });
    }

    const product = await Product.findById(productId).select("title slug priceUSD active stockQty");
    if (!product || !product.active) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Basic stock guard (simple cart)
    if (product.stockQty < addQty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cart = await getOrCreateCart(req.user._id);

    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));
    if (idx >= 0) {
      const newQty = cart.items[idx].qty + addQty;

      if (product.stockQty < newQty) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      cart.items[idx].qty = newQty;
      // refresh snapshots in case admin updated product
      cart.items[idx].priceSnapshotUSD = product.priceUSD;
      cart.items[idx].titleSnapshot = product.title;
      cart.items[idx].slugSnapshot = product.slug;
    } else {
      cart.items.push({
        productId: product._id,
        qty: addQty,
        priceSnapshotUSD: product.priceUSD,
        titleSnapshot: product.title,
        slugSnapshot: product.slug,
      });
    }

    await cart.save();
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/cart/items/:productId
 * body: { qty }
 */
const updateQty = async (req, res) => {
  try {
    const { productId } = req.params;
    const { qty } = req.body;

    const newQty = Number(qty);
    if (!Number.isFinite(newQty) || newQty < 1) {
      return res.status(400).json({ message: "qty must be >= 1" });
    }

    const product = await Product.findById(productId).select("title slug priceUSD active stockQty");
    if (!product || !product.active) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stockQty < newQty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const cart = await getOrCreateCart(req.user._id);

    const idx = cart.items.findIndex((i) => String(i.productId) === String(productId));
    if (idx < 0) return res.status(404).json({ message: "Item not in cart" });

    cart.items[idx].qty = newQty;
    cart.items[idx].priceSnapshotUSD = product.priceUSD;
    cart.items[idx].titleSnapshot = product.title;
    cart.items[idx].slugSnapshot = product.slug;

    await cart.save();
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/cart/items/:productId
 */
const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await getOrCreateCart(req.user._id);
    const before = cart.items.length;

    cart.items = cart.items.filter((i) => String(i.productId) !== String(productId));

    if (cart.items.length === before) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    await cart.save();
    return res.json({ cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getCart,
  addItem,
  updateQty,
  removeItem,
};
