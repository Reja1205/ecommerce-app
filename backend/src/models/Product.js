const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "", maxlength: 2000 },
    priceUSD: { type: Number, required: true, min: 0 },
    stockQty: { type: Number, required: true, min: 0, default: 0 },
    active: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

// Useful indexes
productSchema.index({ active: 1, createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);
