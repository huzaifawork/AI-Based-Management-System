// src/services/socketService.js
import io from 'socket.io-client';

const SOCKET_SERVER = "http://localhost:8080";

let socketInstance = null;

export const initializeSocket = (orderId) => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_SERVER, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      query: { orderId }
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};