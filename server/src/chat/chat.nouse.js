/**
 * Simple chat with socket.io
 */
const RunningBuffer = require("./running-buffer/running-buffer");

const createMessage = ({ message = "", nick = "server", time = Date.now() }) => ({
    message,
    nick,
    time
});

const setupConnectionProcedure = (io, socket) => {
    socket.emit("requestNick", {}, nick => {
        const message = createMessage({ message: `${nick} anslöt till chatten.` });

        io.runningBuffer.add(message);
        socket.nick = nick;
        io.emit("newFriend", message);
    });
};

const setupDisconnectionProcedure = (io, socket) => {
    socket.on("disconnect", reason => {
        const message = createMessage({ message: `${socket.nick} föll bort pga: ${reason}` });

        console.log("lostFriend", message);

        io.runningBuffer.add(message);
        io.emit("lostFriend", message);
    });
};

const setupMessageProcedure = (io, socket) => {
    socket.on("message", ({ message }) => {
        const outgoing = createMessage({ nick: socket.nick, message: message, time: Date.now() });

        io.runningBuffer.add(outgoing);
        io.emit("message", outgoing);
    });
};

const sendHistory = (socket, buffer) => {
    socket.emit("history", buffer);
};

const setupChat = io => {
    io.runningBuffer = new RunningBuffer(10);

    io.on("connection", socket => {
        setupConnectionProcedure(io, socket);
        setupDisconnectionProcedure(io, socket);
        setupMessageProcedure(io, socket);
        sendHistory(socket, io.runningBuffer.buffer);
    });

    return io;
};

module.exports = { setupChat };
