const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const checkout = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const shippingFeeUSD = Number(process.env.SHIPPING_FEE_USD || 0);

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // We’ll create order items from cart snapshots, but we must re-check stock using current Product data.
    const orderItems = cart.items.map((i) => ({
      productId: i.productId,
      titleSnapshot: i.titleSnapshot,
      slugSnapshot: i.slugSnapshot,
      priceSnapshotUSD: i.priceSnapshotUSD,
      qty: i.qty,
    }));

    const itemsTotalUSD = orderItems.reduce(
      (sum, i) => sum + i.priceSnapshotUSD * i.qty,
      0
    );

    const grandTotalUSD = itemsTotalUSD + shippingFeeUSD;

    await session.withTransaction(async () => {
      // 1) stock check + decrement for each item (atomic inside txn)
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.productId, active: true, stockQty: { $gte: item.qty } },
          { $inc: { stockQty: -item.qty } },
          { new: true, session }
        );

        if (!updated) {
          throw new Error(`Not enough stock for productId ${item.productId}`);
        }

        // Optional: refresh title/slug/price from DB if you prefer current values
        // item.titleSnapshot = updated.title;
        // item.slugSnapshot = updated.slug;
        // item.priceSnapshotUSD = updated.priceUSD;
      }

      // 2) create order
      await Order.create(
        [
          {
            userId: req.user._id,
            items: orderItems,
            itemsTotalUSD,
            shippingFeeUSD,
            grandTotalUSD,
            payment: { provider: "mock", status: "paid" },
            status: "PLACED",
          },
        ],
        { session }
      );

      // 3) clear cart
      cart.items = [];
      await cart.save({ session });
    });

    return res.status(201).json({
      message: "Order placed (mock payment)",
      totals: { itemsTotalUSD, shippingFeeUSD, grandTotalUSD },
    });
  } catch (error) {
    // If transaction throws "Not enough stock..." we return 400
    if (String(error.message || "").toLowerCase().includes("not enough stock")) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  } finally {
    session.endSession();
  }
};

module.exports = { checkout };
