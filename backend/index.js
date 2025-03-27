const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("./Models/db");

const app = express();
const server = http.createServer(app);

// 🔹 Configure Socket.io with CORS settings
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

// 🔹 CORS Setup for Express
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 📌 Import Routes
const menuRoutes = require("./Routes/menuRoutes");
const fileRoutes = require("./Routes/PicRoutes");
const tableRoutes = require("./Routes/tableRoutes");
const roomRoutes = require("./Routes/roomRoutes");
const staffRoutes = require("./Routes/staffRoutes");
const shiftRoutes = require("./Routes/shiftroutes");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");
const GoogleRoutes = require("./Routes/GoogleRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const reservationRoutes = require("./Routes/ReservationRoutes");
const userRoutes = require("./Routes/UserRoutes");
const feedbackRoutes = require("./Routes/feedbackRoutes");

// 📌 Serve Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Register Routes
app.use("/api/menus", menuRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/shift", shiftRoutes);
app.use("/auth", AuthRouter);
app.use("/api/products", ProductRouter);
app.use("/auth/google", GoogleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);

// 🚀 **Real-time Order Tracking with Socket.io**

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);
  const intervals = [];

  socket.on("trackOrder", (data) => {
    if (!data || !data.orderId) {
      console.error("❌ Invalid order data:", data);
      socket.emit("error", { message: "Invalid request" });
      return;
    }

    const { orderId } = data;
    console.log(`🔔 Tracking Order: ${orderId}`);

    // Extended order status timings for a longer delivery simulation
    emitOrderStatus(socket, orderId, "Preparing", 1000);          // 1 second delay
    emitOrderStatus(socket, orderId, "Out for Delivery", 7000);     // 7 seconds delay
    emitOrderStatus(socket, orderId, "Delivered", 20000);           // 20 seconds delay

    // Simulate Delivery Location Updates for an Abbottabad route
    const locationInterval = trackDeliveryLocation(socket, orderId);
    intervals.push(locationInterval);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    intervals.forEach(clearInterval);
  });
});

// Helper to emit order status updates with a given delay
const emitOrderStatus = (socket, orderId, status, delay) => {
  setTimeout(() => {
    console.log(`🍹 Order ${orderId} status: ${status}`);
    socket.emit("orderStatus", { orderId, deliveryStatus: status });
  }, delay);
};

// Updated function to simulate an Abbottabad route with more granular location updates
const trackDeliveryLocation = (socket, orderId) => {
  const locations = [
    { lat: 34.1600, lng: 73.2100 }, // Starting point (restaurant location)
    { lat: 34.1620, lng: 73.2120 },
    { lat: 34.1640, lng: 73.2140 },
    { lat: 34.1660, lng: 73.2160 },
    { lat: 34.1680, lng: 73.2180 },
    { lat: 34.1688, lng: 73.2215 }  // Destination (Abbottabad city center)
  ];

  let index = 0;
  const interval = setInterval(() => {
    if (index < locations.length) {
      socket.emit("updateDeliveryLocation", { orderId, deliveryLocation: locations[index] });
      index++;
    } else {
      clearInterval(interval);
    }
  }, 2000); // update every 2 seconds
  return interval;
};

// 🔹 Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT}`);
});
