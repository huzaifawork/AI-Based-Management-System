import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Home, Booking, AboutUs, Contact, PageNotFound, Room, Services, Team, Testimonial } from "./pages/index";
import Header from "./components/common/Header";
import Footer from "./components/Footer";
import LoginPage from "./components/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Dashboard from "./components/Admin/Sidebar";
import BookRoom from "./pages/BookRoom";
import OrderFood from "./pages/OrderFood";
import Cart from "./components/orders/Cart";
import MyOrders from "./components/MyOrders";
import Invoice from "./components/Invoice";
import MyReservations from "./components/MyReservations";
import MyBookings from "./components/MyBookings";
import AdminOrders from "./pages/AdminOrders";
import DeliveryTracking from "./components/DeliveryTracking";
import DeliveryTrackingPage from "./components/DeliveryTracking";
import ReserveTable from "./pages/ReserveTable";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Add Bootstrap CSS
import Profile from "./components/Profile";
import Feedback from "./components/User/Feedback";

// Layout Component for Header and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const excludeHeaderFooter = location.pathname === "/dashboard";
  return (
    <>
      {!excludeHeaderFooter && <Header />}
      {children}
      {!excludeHeaderFooter && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={3000} // Close toast after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

// Authenticated Route Wrapper
const AuthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <GoogleOAuthProvider clientId="985359243899-vgjcmnu5921lk7ginjn9lvkoqib7t5po.apps.googleusercontent.com">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/team" element={<Team />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/*" element={<PageNotFound />} />
            <Route path="/rooms" element={<Room />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book-room" element={<BookRoom />} />
            <Route path="/order-food" element={<OrderFood />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/invoice/:orderId" element={<Invoice />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/track-order/:orderId" element={<DeliveryTrackingPage />} />
            <Route path="/reserve-table" element={<ReserveTable />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Protected Feedback Route */}
            <Route
              path="/feedback"
              element={
                <AuthenticatedRoute>
                  <Feedback />
                </AuthenticatedRoute>
              }
            />

            {/* Protected Admin Route */}
            <Route
              path="/dashboard"
              element={
                <AuthenticatedRoute>
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                </AuthenticatedRoute>
              }
            />
          </Routes>
        </Layout>
      </GoogleOAuthProvider>
    </Router>
  );
}