import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiMapPin, FiPackage, FiFileText } from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderId = '67fab24d9a3558b7a0c8267f';
  
  const orderDetails = {
    estimatedTime: '30-45 minutes',
    address: 'Abbottabad, Pakistan',
    status: 'pending',
    items: [
      { name: 'pizzaasdxw', quantity: 1, price: 10.00 }
    ],
    deliveryFee: 4.00,
    subtotal: 10.00,
    total: 14.00
  };

  return (
    <div className="order-page">
      <div className="order-card">
        <div className="order-header">
          <BiRestaurant className="restaurant-icon" />
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="order-number">Order ID: {orderId}</p>
        </div>

        <div className="order-details">
          <div className="detail-row">
            <div className="detail-item">
              <FiClock className="detail-icon" />
              <div className="detail-content">
                <div className="detail-label">Estimated Delivery Time</div>
                <div className="detail-value">{orderDetails.estimatedTime}</div>
              </div>
            </div>

            <div className="detail-item">
              <FiMapPin className="detail-icon" />
              <div className="detail-content">
                <div className="detail-label">Delivery Address</div>
                <div className="detail-value">{orderDetails.address}</div>
              </div>
            </div>

            <div className="detail-item">
              <FiPackage className="detail-icon" />
              <div className="detail-content">
                <div className="detail-label">Order Status</div>
                <div className="detail-value">{orderDetails.status}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="button-group">
          <button 
            className="track-button"
            onClick={() => navigate(`/track-order/${orderId}`)}
          >
            Track Order
          </button>
          <button 
            className="invoice-button"
            onClick={() => navigate(`/invoice/${orderId}`)}
          >
            <FiFileText className="button-icon" />
            View Invoice
          </button>
        </div>

        <div className="order-summary">
          <h3 className="summary-title">Order Summary</h3>
          {orderDetails.items.map((item, index) => (
            <div key={index} className="order-item">
              <div>
                <h4 className="item-name">{item.name}</h4>
                <p className="item-quantity">Qty: {item.quantity}</p>
              </div>
              <div>${item.price.toFixed(2)}</div>
            </div>
          ))}

          <div className="price-details">
            <div className="price-row">
              <span className="price-label">Subtotal</span>
              <span className="price-value">${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span className="price-label">Delivery Fee</span>
              <span className="price-value">${orderDetails.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span className="total-label">Total</span>
              <span className="total-value">${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 