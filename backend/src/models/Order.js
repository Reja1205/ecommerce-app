const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    titleSnapshot: { type: String, required: true },
    slugSnapshot: { type: String, required: true },
    priceSnapshotUSD: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: { type: [orderItemSchema], required: true },

    itemsTotalUSD: { type: Number, required: true, min: 0 },
    shippingFeeUSD: { type: Number, required: true, min: 0 },
    grandTotalUSD: { type: Number, required: true, min: 0 },

    payment: {
      provider: { type: String, default: "mock" },
      status: { type: String, enum: ["paid"], default: "paid" },
    },

    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"],
      default: "PLACED",
      required: true,
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
