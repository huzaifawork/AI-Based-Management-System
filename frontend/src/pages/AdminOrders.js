import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form } from "react-bootstrap";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { deliveryStatus: status });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Admin Orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Food Items</th>
            <th>Total Price</th>
            <th>Delivery Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}</td>
              <td>${order.totalPrice}</td>
              <td>
                <span className={`badge bg-${order.deliveryStatus === "Delivered" ? "success" : "warning"}`}>
                  {order.deliveryStatus}
                </span>
              </td>
              <td>
                <Form.Select
                  value={order.deliveryStatus}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </Form.Select>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminOrders;
