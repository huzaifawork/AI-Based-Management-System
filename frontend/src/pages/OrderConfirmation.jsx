import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPackage, FiClock, FiMapPin } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import PageLayout from '../components/layout/PageLayout';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || {};
  
  // Get order ID from either _id or orderId field
  const getOrderId = () => {
    return order._id || order.orderId || 'undefined';
  };

  const handleTrackOrder = () => {
    const orderId = getOrderId();
    if (orderId === 'undefined') {
      console.error('Order ID is undefined:', order);
      return;
    }
    navigate(`/track-order/${orderId}`, { 
      state: { 
        order: {
          ...order,
          orderId: orderId // Ensure orderId is set
        } 
      } 
    });
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00';
  };

  const calculateSubtotal = () => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <PageLayout>
      <div className="order-confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-left">
            <div className="confirmation-header">
              <div className="status-icon">
                <MdRestaurant size={24} />
              </div>
              <h2>Order Confirmed!</h2>
              <p className="order-id">Order ID: {getOrderId()}</p>
            </div>

            <div className="delivery-info">
              <div className="info-row">
                <FiClock className="info-icon" />
                <div className="info-content">
                  <p className="info-label">Estimated Delivery Time</p>
                  <p className="info-value">{order.estimatedDelivery || '30-45 minutes'}</p>
                </div>
              </div>

              <div className="info-row">
                <FiMapPin className="info-icon" />
                <div className="info-content">
                  <p className="info-label">Delivery Address</p>
                  <p className="info-value">{order.deliveryAddress || 'Address not available'}</p>
                </div>
              </div>

              <div className="info-row">
                <FiPackage className="info-icon" />
                <div className="info-content">
                  <p className="info-label">Order Status</p>
                  <p className="info-value">{order.status || 'Processing'}</p>
                </div>
              </div>
            </div>

            <button className="track-order-btn" onClick={handleTrackOrder}>
              Track Order
            </button>
          </div>

          <div className="confirmation-right">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.image || '/images/food-placeholder.jpg'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = '/images/food-placeholder.jpg';
                      }}
                    />
                    <div className="item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <p className="item-price">${formatPrice(item.price)}</p>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="total-row">
                  <span>Delivery Fee</span>
                  <span>${formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="total-row final">
                  <span>Total</span>
                  <span>${formatPrice(order.totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrderConfirmation; 
