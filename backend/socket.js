const socketIO = require('socket.io');

let io;

// Simulated order statuses with timestamps
const orderStatuses = new Map();

const updateOrderStatus = (orderId, status) => {
    const currentTime = new Date();
    const statusUpdate = {
        status,
        timestamp: currentTime,
        completed: true
    };

    if (!orderStatuses.has(orderId)) {
        orderStatuses.set(orderId, []);
    }
    
    const orderStatus = orderStatuses.get(orderId);
    orderStatus.push(statusUpdate);
    
    console.log(`[${currentTime.toLocaleTimeString()}] Order ${orderId} status updated to: ${status}`);
    return statusUpdate;
};

const getEstimatedDeliveryTime = (startTime) => {
    const estimatedMinutes = 30; // Changed to 30 minutes
    const deliveryTime = new Date(startTime);
    deliveryTime.setMinutes(deliveryTime.getMinutes() + estimatedMinutes);
    return deliveryTime;
};

const init = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket ${socket.id}] Client connected`);

        // Handle connection verification
        socket.on('ping', () => {
            console.log(`[Socket ${socket.id}] Ping received, sending pong`);
            socket.emit('pong');
        });

        socket.on('trackOrder', ({ orderId }) => {
            if (!orderId) {
                console.error(`[Socket ${socket.id}] Invalid order ID received`);
                return;
            }

            console.log(`[Socket ${socket.id}] Tracking order: ${orderId}`);
            
            // Join a room specific to this order
            socket.join(`order_${orderId}`);

            // Clear any existing timeouts for this order
            if (global.orderTimeouts && global.orderTimeouts[orderId]) {
                global.orderTimeouts[orderId].forEach(timeout => clearTimeout(timeout));
            }

            // Initialize timeouts array for this order
            if (!global.orderTimeouts) global.orderTimeouts = {};
            global.orderTimeouts[orderId] = [];

            // Send initial status
            const initialStatus = {
                status: 'Order Received',
                timestamp: new Date(),
                estimatedDelivery: new Date(Date.now() + 30 * 60000) // 30 minutes from now
            };

            io.to(`order_${orderId}`).emit('orderUpdate', initialStatus);
            console.log(`[Socket ${socket.id}] Order ${orderId} - Status: ${initialStatus.status}`);

            // Schedule status updates
            const statusUpdates = [
                { status: 'Preparing', delay: 10000 },
                { status: 'Ready for Pickup', delay: 20000 },
                { status: 'On the Way', delay: 30000 },
                { status: 'Arriving Soon', delay: 40000 },
                { status: 'Delivered', delay: 50000 }
            ];

            statusUpdates.forEach(({ status, delay }) => {
                const timeout = setTimeout(() => {
                    const update = {
                        status,
                        timestamp: new Date(),
                        estimatedDelivery: new Date(Date.now() + 30 * 60000)
                    };
                    
                    io.to(`order_${orderId}`).emit('orderUpdate', update);
                    console.log(`[Socket ${socket.id}] Order ${orderId} - Status: ${status}`);
                }, delay);

                global.orderTimeouts[orderId].push(timeout);
            });
        });

        socket.on('disconnect', () => {
            console.log(`[Socket ${socket.id}] Client disconnected`);
        });

        socket.on('error', (error) => {
            console.error(`[Socket ${socket.id}] Error:`, error);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = {
    init,
    getIO
};
