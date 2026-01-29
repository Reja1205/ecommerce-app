const Order = require("../models/Order");

const listAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ order });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { listAllOrders, updateOrderStatus };
