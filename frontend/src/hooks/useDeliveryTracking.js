// src/hooks/useDeliveryTracking.js
import { useEffect, useState } from 'react';
import { initializeSocket, disconnectSocket } from '../services/socketService';

const useDeliveryTracking = (orderId) => {
  const [orderStatus, setOrderStatus] = useState('Preparing');
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const socket = initializeSocket(orderId);
    
    // Emit the trackOrder event to trigger backend updates
    socket.emit("trackOrder", { orderId });

    const handleStatusUpdate = (data) => {
      if (data.orderId === orderId) {
        setOrderStatus(data.deliveryStatus);
      }
    };

    const handleLocationUpdate = (data) => {
      if (data.orderId === orderId) {
        setDeliveryLocation(data.deliveryLocation);
      }
    };

    socket.on('orderStatus', handleStatusUpdate);
    socket.on('updateDeliveryLocation', handleLocationUpdate);
    socket.on('connect_error', (err) => {
      setSocketError('Connection error. Trying to reconnect...');
      console.error('Connection error:', err);
    });

    return () => {
      socket.off('orderStatus', handleStatusUpdate);
      socket.off('updateDeliveryLocation', handleLocationUpdate);
      socket.off('connect_error');
      disconnectSocket();
    };
  }, [orderId]);

  return { orderStatus, deliveryLocation, socketError };
};

export default useDeliveryTracking;
