const Order = require("../Models/Order");
const User = require("../Models/User");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer();
const io = socketIo(server);

// ✅ Create Order (Logged-in users only)
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user._id; // Get user ID from the authenticated request

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items must be a non-empty array" });
    }

    for (const item of items) {
      if (!item.quantity || !item.price) {
        return res.status(400).json({ message: "Each item must have quantity and price" });
      }
      if (isNaN(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      if (isNaN(item.price) || item.price <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
      user: userId, // Associate order with the logged-in user
      items,
      totalPrice,
      status: "pending",
    });

    await newOrder.save();
    if (io) {
      io.emit("newOrder", newOrder);
    }
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// ✅ Get All Orders (Logged-in users only, their own orders)
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from the authenticated request
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalOrders = await Order.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalOrders / limit);

    // Fetch orders with pagination
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Ensure all price fields are valid numbers
    const validatedOrders = orders.map(order => ({
      ...order.toObject(),
      totalPrice: Number(order.totalPrice) || 0,
      deliveryFee: Number(order.deliveryFee) || 0,
      items: order.items.map(item => ({
        ...item,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 0
      }))
    }));

    res.status(200).json({
      orders: validatedOrders,
      pagination: {
        page,
        limit,
        totalPages,
        totalOrders
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Get Single Order (Logged-in users only, their own order)
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id; // Get user ID from the authenticated request

    const order = await Order.findOne({ _id: orderId, user: userId }); // Ensure the order belongs to the user
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized access" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// ✅ Update Delivery Location (Logged-in users only, their own order)
exports.updateDeliveryLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryLocation } = req.body;
    const userId = req.user._id; // Get user ID from the authenticated request

    if (!deliveryLocation) {
      return res.status(400).json({ message: "Invalid delivery location" });
    }

    const order = await Order.findOne({ _id: orderId, user: userId }); // Ensure the order belongs to the user
    if (!order) return res.status(404).json({ message: "Order not found or unauthorized access" });

    order.deliveryLocation = deliveryLocation;
    await order.save();

    if (io) {
      io.emit("updateDeliveryLocation", { orderId: order._id, deliveryLocation });
    }
    res.json({ message: "Delivery location updated", order });
  } catch (error) {
    console.error("Error updating delivery location:", error);
    res.status(500).json({ message: "Error updating delivery location", error: error.message });
  }
};

// ✅ Cancel Order (Logged-in users only, their own order)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id; // Get user ID from the authenticated request

    const order = await Order.findOneAndDelete({ _id: orderId, user: userId }); // Ensure the order belongs to the user
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized access" });
    }

    if (io) {
      io.emit("orderCancelled", { orderId: order._id });
    }

    res.status(200).json({ message: "Order cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error: error.message });
  }
};

// ✅ Update Order Status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status
    order.status = status;
    await order.save();

    // Emit socket event for real-time updates
    if (io) {
      io.emit("orderStatusUpdated", { orderId: order._id, status });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};