const Order = require("../models/Order");

const listMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  listMyOrders,
  getMyOrderById,
};
