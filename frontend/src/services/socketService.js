// src/services/socketService.js
import io from 'socket.io-client';

const SOCKET_SERVER = "http://localhost:8080";
const RECONNECTION_ATTEMPTS = 3;
const RECONNECTION_DELAY = 1000;

let socketInstance = null;
let activeCallbacks = new Set();
let connectionAttempts = 0;

const createSocket = () => {
  return io(SOCKET_SERVER, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: RECONNECTION_ATTEMPTS,
    reconnectionDelay: RECONNECTION_DELAY,
    withCredentials: true
  });
};

export const initializeSocket = (orderId) => {
  if (socketInstance?.connected) {
    console.log('[Socket] Already connected, re-using existing connection');
    socketInstance.emit('trackOrder', { orderId });
    return socketInstance;
  }

  console.log('[Socket] Initializing new connection');
  
  // Create new socket instance
  socketInstance = createSocket();

  // Set up event listeners
  socketInstance.on('connect', () => {
    console.log('[Socket] Connected to server');
    connectionAttempts = 0;
    socketInstance.emit('trackOrder', { orderId });
  });

  socketInstance.on('connect_error', (error) => {
    console.error('[Socket] Connection error:', error.message);
    connectionAttempts++;
    
    if (connectionAttempts >= RECONNECTION_ATTEMPTS) {
      console.error('[Socket] Max reconnection attempts reached');
      socketInstance.disconnect();
    }
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server disconnected us, try to reconnect
      socketInstance.connect();
    }
  });

  socketInstance.on('error', (error) => {
    console.error('[Socket] Error:', error);
  });

  // Ping to verify connection
  socketInstance.on('connect', () => {
    socketInstance.emit('ping');
  });

  socketInstance.on('pong', () => {
    console.log('[Socket] Connection verified');
  });

  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    console.log('[Socket] Disconnecting...');
    // Remove all callbacks
    activeCallbacks.clear();
    socketInstance.disconnect();
    socketInstance = null;
    connectionAttempts = 0;
  }
};

export const subscribeToOrderUpdates = (callback) => {
  if (!socketInstance) {
    console.error('[Socket] Cannot subscribe: Socket not initialized');
    return;
  }

  // Add callback to active callbacks set
  activeCallbacks.add(callback);

  const handleUpdate = (data) => {
    console.log('[Socket] Received order update:', data.status);
    callback(data);
  };

  socketInstance.on('orderUpdate', handleUpdate);

  // Return unsubscribe function
  return () => {
    console.log('[Socket] Unsubscribing from order updates');
    socketInstance?.off('orderUpdate', handleUpdate);
    activeCallbacks.delete(callback);
  };
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('[Socket] Error formatting timestamp:', error);
    return '';
  }
};

export const formatEstimatedDelivery = (timestamp) => {
  if (!timestamp) return '30 minutes';
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('[Socket] Error formatting estimated delivery:', error);
    return '30 minutes';
  }
};