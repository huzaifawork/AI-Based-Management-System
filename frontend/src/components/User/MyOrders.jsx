import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { FiSearch, FiFilter, FiShoppingBag, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "./MyOrders.css";
import { toast } from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  // Function to check if an order should be marked as delivered
  const checkOrderDeliveryStatus = (order) => {
    if (!order || order.status !== 'pending') return false;
    
    const estimatedDeliveryTime = order.estimatedDeliveryTime 
      ? new Date(order.estimatedDeliveryTime) 
      : new Date(order.createdAt).getTime() + (45 * 60 * 1000); // Default 45 minutes
    
    const currentTime = new Date().getTime();
    const deliveryTime = new Date(estimatedDeliveryTime).getTime();
    
    return currentTime > deliveryTime;
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state immediately
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );

      // Refresh orders from server to ensure consistency
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Initialize socket connection
    const newSocket = io("http://localhost:8080", {
      auth: { token }
    });
    setSocket(newSocket);

    // Setup socket event listeners
    newSocket.on("orderStatusUpdate", (data) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId
            ? { 
                ...order, 
                status: data.status === 'Delivered' ? 'delivered' : order.status,
                deliveryStatus: data.deliveryStatus 
              }
            : order
        )
      );
    });

    newSocket.on("orderCancelled", (data) => {
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === data.orderId
            ? { ...order, status: "cancelled" }
            : order
        )
      );
    });

    // Fetch initial orders
    fetchOrders();

    // Check pending orders immediately
    const checkPendingOrders = () => {
      setOrders(prevOrders => {
        let hasUpdates = false;
        const updatedOrders = prevOrders.map(order => {
          if (checkOrderDeliveryStatus(order)) {
            hasUpdates = true;
            updateOrderStatus(order._id, 'delivered');
            return { ...order, status: 'delivered' };
          }
          return order;
        });
        return hasUpdates ? updatedOrders : prevOrders;
      });
    };

    // Run initial check
    checkPendingOrders();

    // Set up interval to check for delivered orders
    const deliveryCheckInterval = setInterval(checkPendingOrders, 30000); // Check every 30 seconds

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      clearInterval(deliveryCheckInterval);
    };
  }, []);

  // Fetch orders when page or filters change
  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      console.log("Fetching orders with token:", token ? "Present" : "Missing"); // Debug log
      
      const response = await axios.get(`http://localhost:8080/api/orders`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          page,
          limit: 10,
          ...filters
        }
      });

      console.log("Orders response:", response.data); // Debug log

      if (response.data && Array.isArray(response.data.orders)) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  const handleSort = (sortBy) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc"
    }));
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert(error.response?.data?.message || "Failed to cancel order. Please try again.");
    }
  };

  const handleReorder = async (order) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/orders/${order._id}/reorder`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/cart");
    } catch (error) {
      console.error("Error reordering:", error);
      alert(error.response?.data?.message || "Failed to reorder. Please try again.");
    }
  };

  const handleRateOrder = async (orderId, rating, feedback) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8080/api/orders/${orderId}/rate`,
        { rating, feedback },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error rating order:", error);
      alert(error.response?.data?.message || "Failed to rate order. Please try again.");
    }
  };

  const handleViewInvoice = (order) => {
    if (!order || !order._id) {
      toast.error('Invalid order data');
      return;
    }
    navigate(`/invoice/${order._id}`);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: "warning",
      confirmed: "info",
      preparing: "primary",
      out_for_delivery: "success",
      delivered: "success",
      cancelled: "danger"
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateOrderTotal = (order) => {
    if (!order || !order.items) return 0;
    
    const subtotal = order.items.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 0));
    }, 0);
    
    const deliveryFee = order.deliveryFee || 4.00; // Default delivery fee
    return subtotal + deliveryFee;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <Button variant="primary" onClick={fetchOrders}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="my-orders-header">
        <h1 className="page-title">My Orders</h1>
      </div>

      <div className="filters-container">
        <div className="filter-item">
          <label className="filter-label">Status:</label>
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Form.Select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Sort By:</label>
          <Form.Select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="filter-input"
          >
            <option value="createdAt">Date</option>
            <option value="total">Total</option>
            <option value="status">Status</option>
          </Form.Select>
        </div>

        <div className="filter-item">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search orders..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <Card className="empty-orders-card">
          <Card.Body className="text-center">
            <h4>No Orders Found</h4>
            <p>Try adjusting your filters or start a new order!</p>
            <Button variant="primary" onClick={() => navigate("/order-food")}>
              Order Now
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="orders-grid">
            {orders.map((order) => {
              const total = calculateOrderTotal(order);
              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <span className="order-id">Order #{order._id?.slice(-6) || 'N/A'}</span>
                    <Badge 
                      className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}
                    >
                      {order.status || 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="order-date">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date not available'}
                  </div>

                  <div className="order-items">
                    {(order.items || []).map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.name || 'Unknown Item'} × {item.quantity || 0}</span>
                        <span>$ {(item.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Subtotal:</span>
                      <span>$ {((total - (order.deliveryFee || 4.00)) || 0).toFixed(2)}</span>
                    </div>
                    <div className="price-row">
                      <span>Delivery Fee:</span>
                      <span>$ {(order.deliveryFee || 4.00).toFixed(2)}</span>
                    </div>
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <span>$ {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    {(order.status === 'pending' || !order.status) && (
                      <Button
                        variant="danger"
                        size="sm"
                        className="btn-cosmic btn-cosmic-danger"
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        <FiXCircle /> Cancel Order
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      className="btn-cosmic"
                      onClick={() => navigate(`/track-order/${order._id}`)}
                    >
                      <FiClock /> Track Order
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      className="btn-cosmic"
                      onClick={() => handleViewInvoice(order)}
                      disabled={!order._id}
                    >
                      <FiShoppingBag /> View Invoice
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <Button
                variant="outline-primary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="mx-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyOrders;