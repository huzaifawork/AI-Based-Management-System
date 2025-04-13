import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button, Spinner } from "react-bootstrap";
import { FiDownload } from "react-icons/fi";
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
      
      // Create a clone of the invoice element
      const clone = invoiceElement.cloneNode(true);
      
      // Apply white background and black text to the clone and all its children
      const applyStyles = (element) => {
        element.style.backgroundColor = '#ffffff';
        element.style.color = '#000000';
        element.style.borderColor = '#000000';
        // Remove any glass effects or transparency
        element.classList.remove('glass');
        element.style.backdropFilter = 'none';
        element.style.background = '#ffffff';
        
        // Ensure table borders are visible
        if (element.tagName === 'TABLE') {
          element.style.borderCollapse = 'collapse';
          element.style.width = '100%';
        }
        if (element.tagName === 'TD' || element.tagName === 'TH') {
          element.style.border = '1px solid #000000';
          element.style.padding = '8px';
        }
        
        // Process all child elements
        Array.from(element.children).forEach(applyStyles);
      };
      
      applyStyles(clone);
      clone.style.padding = '20px';
      document.body.appendChild(clone);

      // Capture the clone with html2canvas
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        imageTimeout: 0,
        removeContainer: true,
        letterRendering: true,
        allowTaint: true,
        foreignObjectRendering: false,
        quality: 1,
        width: clone.offsetWidth,
        height: clone.offsetHeight
      });
      
      // Remove the clone after capturing
      document.body.removeChild(clone);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      // Calculate dimensions
      const pageWidth = 210;  // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 10;
      
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 1.0), 
        'JPEG', 
        margin, 
        margin, 
        imgWidth, 
        imgHeight,
        '',
        'FAST'
      );

      // Handle multiple pages if needed
      if (imgHeight > pageHeight - (margin * 2)) {
        let heightLeft = imgHeight;
        let position = 0;
        
        for (let i = 1; heightLeft > 0; i++) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 1.0),
            'JPEG',
            margin,
            position + margin,
            imgWidth,
            imgHeight,
            '',
            'FAST'
          );
          heightLeft -= (pageHeight - (margin * 2));
        }
      }

      // Save PDF
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
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <Button variant="outline-primary" onClick={fetchOrderDetails}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Order not found</h3>
          <Button variant="outline-primary" onClick={() => navigate("/my-orders")}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-wrapper">
      <div id="invoice" className="invoice-container">
        <div className="invoice-header">
          <div className="company-info">
            <h1>Hotel Management System</h1>
            <p>123 Main Street, Islamabad, Pakistan</p>
            <p>Phone: +92 123 456 7890</p>
            <p>Email: info@hotelmanagement.com</p>
          </div>
          <div className="invoice-info">
            <h2>INVOICE</h2>
            <p>Invoice #: INV-{orderId.slice(-6)}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Time: {new Date(order.createdAt).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="bill-to">
          <h3>Bill To:</h3>
          <p>Name: Customer</p>
          <p>Email: </p>
          <p>Phone: </p>
        </div>

        <div className="order-items">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Add-ons</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => {
                const itemTotal = (item.price || 0) * (item.quantity || 0);
                const addOnsTotal = item.addons?.reduce((acc, addon) => 
                  acc + (addon.price || 0), 0) || 0;
                const total = itemTotal + (addOnsTotal * (item.quantity || 0));

                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price || 0).toFixed(2)}</td>
                    <td>
                      {item.addons && item.addons.length > 0 ? (
                        <ul className="addons-list">
                          {item.addons.map((addon, idx) => (
                            <li key={idx}>
                              {addon.name} (+${(addon.price || 0).toFixed(2)})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        'No add-ons'
                      )}
                    </td>
                    <td>${total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="invoice-summary">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${(order.totalPrice - (order.deliveryFee || 0)).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%):</span>
            <span>${((order.totalPrice - (order.deliveryFee || 0)) * 0.1).toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="invoice-footer">
          <Button 
            variant="primary" 
            onClick={generatePDF} 
            className="btn-cosmic btn-download"
            disabled={generatingPDF}
          >
            {generatingPDF ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <FiDownload className="me-2" />
                Download Invoice
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
