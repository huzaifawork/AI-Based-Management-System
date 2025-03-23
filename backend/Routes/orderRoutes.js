const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require("../Middlewares/Auth");
const {
  createOrder,
  getOrders,
  getOrderById,
  updateDeliveryLocation,
  cancelOrder,
  updateOrderStatus
} = require("../Controllers/orderControllers");

// ✅ Create Order (Logged-in users only)
router.post("/", ensureAuthenticated, createOrder);

// ✅ Get All Orders (Admin only)
router.get("/", ensureAuthenticated, ensureAdmin, getOrders);

// ✅ Get Single Order (Logged-in users only, their own order)
router.get("/:orderId", ensureAuthenticated, getOrderById);

// ✅ Update Order Status (Admin only)
router.patch("/:orderId/status", ensureAuthenticated, ensureAdmin, updateOrderStatus);

// ✅ Update Delivery Location (Logged-in users only, their own order)
router.put("/:orderId/delivery-location", ensureAuthenticated, updateDeliveryLocation);

// ✅ Cancel Order (Logged-in users only, their own order)
router.delete("/:orderId", ensureAuthenticated, cancelOrder);

module.exports = router;