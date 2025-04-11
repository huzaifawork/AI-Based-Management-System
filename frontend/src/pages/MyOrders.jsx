import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add your orders data fetching logic here
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="loading-state">
          <div className="loading-spinner" />
        </div>
      </PageLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <PageLayout>
        <div className="empty-state">
          <FiShoppingBag className="empty-state-icon" />
          <h3 className="empty-state-title">No Orders Yet</h3>
          <p className="empty-state-text">
            You haven't placed any orders yet. Start exploring our menu!
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track your food orders</p>
      </div>

      <div className="orders-container">
        {orders.map((order) => (
          <div key={order.id} className="card">
            <div className="order-header">
              <div className="order-info">
                <h3 className="order-id">Order #{order.id}</h3>
                <p className="order-date">{order.date}</p>
              </div>
              <div className={`order-status ${order.status.toLowerCase()}`}>
                {order.status === 'Pending' && <FiClock />}
                {order.status === 'Completed' && <FiCheckCircle />}
                {order.status === 'Cancelled' && <FiXCircle />}
                <span>{order.status}</span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h4 className="order-item-name">{item.name}</h4>
                    <p className="order-item-price">${item.price}</p>
                    <p className="order-item-quantity">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>${order.subtotal}</span>
              </div>
              <div className="summary-item">
                <span>Tax</span>
                <span>${order.tax}</span>
              </div>
              <div className="summary-item total">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
};

export default MyOrders; 