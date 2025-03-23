const { Server } = require("socket.io");

let io;

module.exports = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: "http://localhost:3000", // Update with frontend URL
                methods: ["GET", "POST"],
            },
        });

        io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
};
