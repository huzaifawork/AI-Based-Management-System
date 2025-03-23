import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Button, Spinner, Form, InputGroup, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import "./MyOrders.css";

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
            ? { ...order, status: data.status, deliveryStatus: data.deliveryStatus }
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

    // Cleanup
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
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
    <div className="my-orders-container container mt-4">
      <h2 className="mb-4">My Orders</h2>
      
      {/* Filters */}
      <Card className="filter-card mb-4">
        <Card.Body>
          <div className="row g-3">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={filters.status} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Sort By</Form.Label>
                <Form.Select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                  <option value="createdAt">Date</option>
                  <option value="totalPrice">Total Price</option>
                  <option value="status">Status</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Search</Form.Label>
                <Form.Control
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search orders..."
                />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Sort Order</Form.Label>
                <Form.Select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {orders.length === 0 ? (
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
          <div className="orders-list">
            {orders.map((order) => (
              <Card key={order._id} className="order-card mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">Order #{order._id.slice(-6).toUpperCase()}</h5>
                    <small className="text-muted">{formatDate(order.createdAt)}</small>
                  </div>
                  <div>
                    <Badge bg="primary" className="me-2">
                      Rs. {(order.totalPrice || 0).toFixed(2)}
                    </Badge>
                    {getStatusBadge(order.status)}
                  </div>
                </Card.Header>
                <Card.Body>
                  <Table hover className="order-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>Rs. {(item.price || 0).toFixed(2)}</td>
                          <td>Rs. {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <div className="order-details mt-3">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        <p><strong>Delivery Fee:</strong> Rs. {(order.deliveryFee || 0).toFixed(2)}</p>
                        {order.estimatedDeliveryTime && (
                          <p><strong>Estimated Delivery:</strong> {formatDate(order.estimatedDeliveryTime)}</p>
                        )}
                      </div>
                      <div className="col-md-6 text-md-end">
                        <Button 
                          variant="outline-primary" 
                          onClick={() => navigate(`/invoice/${order._id}`)}
                          className="me-2"
                        >
                          View Invoice
                        </Button>
                        {order.status === "out_for_delivery" && (
                          <Button 
                            variant="success"
                            onClick={() => navigate(`/track-order/${order._id}`)}
                            className="me-2"
                          >
                            Track Order
                          </Button>
                        )}
                        {order.status === "pending" && (
                          <Button 
                            variant="danger"
                            onClick={() => handleCancelOrder(order._id)}
                            className="me-2"
                          >
                            Cancel Order
                          </Button>
                        )}
                        {order.status === "delivered" && !order.rating && (
                          <Button 
                            variant="warning"
                            onClick={() => navigate(`/rate-order/${order._id}`)}
                          >
                            Rate Order
                          </Button>
                        )}
                        {order.status === "delivered" && (
                          <Button 
                            variant="info"
                            onClick={() => handleReorder(order)}
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.First 
                disabled={page === 1} 
                onClick={() => setPage(1)} 
              />
              <Pagination.Prev 
                disabled={page === 1} 
                onClick={() => setPage(prev => prev - 1)} 
              />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                disabled={page === totalPages} 
                onClick={() => setPage(prev => prev + 1)} 
              />
              <Pagination.Last 
                disabled={page === totalPages} 
                onClick={() => setPage(totalPages)} 
              />
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;