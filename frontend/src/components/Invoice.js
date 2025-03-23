import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Table, Card, Spinner, Alert } from "react-bootstrap";
import "./Invoice.css";

export default function Invoice() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchOrderDetails();
  }, [orderId, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError(error.response?.data?.message || "Failed to load invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      setGeneratingPDF(true);
      const invoiceElement = document.getElementById("invoice");
      
      // Wait for any images to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">
          {error}
          <Button variant="outline-danger" className="ms-3" onClick={fetchOrderDetails}>
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5">
        <Alert variant="warning">
          Order not found
          <Button variant="outline-warning" className="ms-3" onClick={() => navigate("/my-orders")}>
            Go to My Orders
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div id="invoice" className="invoice-container">
        <div className="invoice-header">
          <h2>Invoice</h2>
          <p className="order-id">Order ID: {order._id}</p>
        </div>

        <div className="invoice-details">
          <div className="row">
            <div className="col-md-6">
              <h4>Order Details</h4>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${order.status}`}>{order.status}</span></p>
            </div>
            <div className="col-md-6">
              <h4>Delivery Details</h4>
              <p><strong>Address:</strong> {order.deliveryAddress || "N/A"}</p>
              <p><strong>Delivery Fee:</strong> Rs. {(order.deliveryFee || 0).toFixed(2)}</p>
              {order.estimatedDeliveryTime && (
                <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDeliveryTime).toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

        <Table striped bordered hover className="invoice-table">
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

        <div className="invoice-summary">
          <div className="row">
            <div className="col-md-6">
              <div className="subtotal">
                <p>Subtotal: Rs. {(order.totalPrice - (order.deliveryFee || 0)).toFixed(2)}</p>
                <p>Delivery Fee: Rs. {(order.deliveryFee || 0).toFixed(2)}</p>
                <h4>Total Amount: Rs. {(order.totalPrice || 0).toFixed(2)}</h4>
              </div>
            </div>
            <div className="col-md-6">
              <Button 
                variant="primary" 
                onClick={generatePDF} 
                className="download-btn"
                disabled={generatingPDF}
              >
                {generatingPDF ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generating PDF...
                  </>
                ) : (
                  "Download Invoice as PDF"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
