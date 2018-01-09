const createMessage = ({
    message = "",
    nick = "server",
    time = Date.now()
}) => ({
    message,
    nick,
    time
});

const setupChatSocketHandling = (io, runningMessageBuffer) => {
    io.on("connection", socket => {
        socket.on("requestHistory", () => {
            runningMessageBuffer.buffer.forEach(message => {
                console.log(message);
                socket.emit("chatMessage", message);
            });
        });

        socket.on("chatMessage", ({ nick, message }) => {
            const outgoing = createMessage({ nick, message, time: Date.now() });

            runningMessageBuffer.add(outgoing);
            io.emit("chatMessage", outgoing);
        });
    });

    return io;
};

module.exports = setupChatSocketHandling;
