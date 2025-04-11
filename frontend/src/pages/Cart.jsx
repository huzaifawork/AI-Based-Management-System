import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import PageLayout from '../components/layout/PageLayout';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add your cart data fetching logic here
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

  if (cartItems.length === 0) {
    return (
      <PageLayout>
        <div className="empty-state">
          <FiShoppingBag className="empty-state-icon" />
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-text">
            Looks like you haven't added any items to your cart yet.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">Review and manage your items</p>
      </div>

      <div className="cart-container">
        <div className="card">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">${item.price}</p>
                </div>
                <div className="cart-item-quantity">
                  <button className="quantity-btn">
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button className="quantity-btn">
                    <FiPlus />
                  </button>
                </div>
                <button className="remove-btn">
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-item">
              <span>Subtotal</span>
              <span>$0.00</span>
            </div>
            <div className="summary-item">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="summary-item total">
              <span>Total</span>
              <span>$0.00</span>
            </div>

            <button className="btn btn-primary w-100">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Cart; 