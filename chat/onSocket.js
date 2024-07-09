const {User, Notification} = require('../models/model');

const onSocket = (io) => {
    io.on("connection", (socket) => {
        socket.on("message:send", async (payload) => {
            const usersId = await User.findAll();
            usersId.forEach(user => {
                const newMessage = Notification.create({
                    message: payload.message,
                    UserUserId: user.user_id,
                    status: true
                });
            })
            io.emit("message:receive", payload);
        });
        socket.on("disconnect", () => {
        });
    })};

module.exports = { onSocket };
