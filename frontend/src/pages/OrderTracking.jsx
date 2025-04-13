import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { MdRestaurant } from 'react-icons/md';
import axios from 'axios';
import { 
  initializeSocket, 
  disconnectSocket, 
  subscribeToOrderUpdates,
  formatTimestamp,
  formatEstimatedDelivery
} from '../services/socketService';
import './OrderTracking.css';

// Define timeline statuses outside component
const defaultTimeline = [
  {
    status: 'Order Received',
    description: 'Restaurant has received your order',
    completed: false
  },
  {
    status: 'Preparing',
    description: 'Your food is being prepared',
    completed: false
  },
  {
    status: 'Ready for Pickup',
    description: 'Order is ready for delivery pickup',
    completed: false
  },
  {
    status: 'On the Way',
    description: 'Your order is out for delivery',
    completed: false
  },
  {
    status: 'Arriving Soon',
    description: 'Driver is near your location',
    completed: false
  }
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);

  // Fetch order data if not available in location state
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || orderId === 'undefined') {
        setError('Invalid order ID');
        setLoading(false);
        return;
      }

      if (location.state?.order) {
        setOrder(location.state.order);
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:8080/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data) {
          setOrder(response.data);
          // Initialize timeline with current status
          if (response.data.status) {
            setTimeline([{
              status: response.data.status,
              timestamp: new Date(),
              completed: true
            }]);
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, location.state]);

  // Socket connection and updates
  useEffect(() => {
    if (!orderId || orderId === 'undefined' || loading) {
      return;
    }

    const socket = initializeSocket(orderId);
    let unsubscribe;

    if (socket) {
      unsubscribe = subscribeToOrderUpdates((data) => {
        console.log('[OrderTracking] Received update:', data);
        
        // Update timeline
        setTimeline(prevTimeline => {
          const existingStatus = prevTimeline.find(item => item.status === data.status);
          if (existingStatus) {
            return prevTimeline.map(item =>
              item.status === data.status ? { ...item, ...data } : item
            );
          }
          return [...prevTimeline, data];
        });

        // Update estimated delivery time
        if (data.estimatedDelivery) {
          setEstimatedDelivery(data.estimatedDelivery);
        }

        // Update order status
        setOrder(prev => ({
          ...prev,
          status: data.status
        }));

        // Mark previous steps as completed
        const statusIndex = defaultTimeline.findIndex(item => item.status === data.status);
        if (statusIndex > -1) {
          setTimeline(prevTimeline => {
            const updatedTimeline = [...prevTimeline];
            for (let i = 0; i <= statusIndex; i++) {
              const status = defaultTimeline[i].status;
              if (!updatedTimeline.find(item => item.status === status)) {
                updatedTimeline.push({
                  status,
                  timestamp: new Date(),
                  completed: true
                });
              }
            }
            return updatedTimeline;
          });
        }
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      disconnectSocket();
    };
  }, [orderId, loading]);

  const handleBackToConfirmation = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="tracking-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="tracking-container">
        <div className="error-message">
          <p>{error || 'Order not found. Please try again later.'}</p>
          <button className="back-button" onClick={handleBackToConfirmation}>
            Back to Order Confirmation
          </button>
        </div>
      </div>
    );
  }

  const getOrderStatus = () => {
    return order.status || 'Order Received';
  };

  const getEstimatedDelivery = () => {
    if (estimatedDelivery) {
      return formatEstimatedDelivery(estimatedDelivery);
    }
    return '15-20 minutes';
  };

  // Merge real-time updates with default timeline
  const mergedTimeline = defaultTimeline.map(defaultStatus => {
    const realTimeStatus = timeline.find(item => item.status === defaultStatus.status);
    const currentOrderStatus = order?.status?.toLowerCase() || '';
    const statusIndex = defaultTimeline.findIndex(s => s.status.toLowerCase() === currentOrderStatus);
    const thisStatusIndex = defaultTimeline.findIndex(s => s.status === defaultStatus.status);
    
    // Mark as completed if this status comes before or is the current status
    const isCompleted = thisStatusIndex <= statusIndex;
    
    if (realTimeStatus) {
      return {
        ...defaultStatus,
        ...realTimeStatus,
        completed: isCompleted,
        time: formatTimestamp(realTimeStatus.timestamp)
      };
    }
    return {
      ...defaultStatus,
      completed: isCompleted,
      time: isCompleted ? formatTimestamp(new Date()) : 'Pending'
    };
  });

  return (
    <div className="tracking-container">
      <div className="tracking-card">
        <div className="tracking-header">
          <div className="status-icon">
            <MdRestaurant size={24} />
          </div>
          <h2>{getOrderStatus()}</h2>
          <p className="estimated-delivery">
            Estimated delivery by<br />
            {getEstimatedDelivery()}
          </p>
          <div className="delivery-info">
            <FiMapPin className="icon" />
            <div>
              <p>Delivery to: {order.customerName || 'Customer'}</p>
              <p className="address">{order.deliveryAddress || 'Loading address...'}</p>
            </div>
          </div>
        </div>

        <div className="tracking-details">
          <p className="tracking-label">Order ID: {orderId}</p>
        </div>

        <div className="timeline-container">
          {mergedTimeline.map((event, index) => (
            <div 
              key={index} 
              className={`timeline-message ${event.completed ? 'completed' : ''} ${
                !event.completed && index > 0 && mergedTimeline[index - 1].completed ? 'current' : ''
              }`}
            >
              <div className="message-dot"></div>
              <div className="message-content">
                <h4>{event.status}</h4>
                <p>{event.description}</p>
                <span className="message-time">
                  {event.time || 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking; 