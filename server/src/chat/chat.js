/**
 * Simple chat server with socket.io
 */
const RunningBuffer = require("./running-buffer/running-buffer");

const IO = require("socket.io");

const createMessage = ({ message = "", nick = "server", time = Date.now() }) => ({
    message,
    nick,
    time
});

const setupConnectionProcedure = (chat, socket) => {
    socket.emit("requestNick", {}, nick => {
        const message = createMessage({ message: `${nick} anslöt till chatten.` });

        chat.runningBuffer.add(message);
        socket.nick = nick;
        chat.emit("newFriend", message);
    });
};

const setupDisconnectionProcedure = (chat, socket) => {
    socket.on("disconnect", reason => {
        const message = createMessage({ message: `${socket.nick} föll bort pga: ${reason}` });

        chat.runningBuffer.add(message);
        chat.emit("lostFriend", message);
    });
};

const setupMessageProcedure = (chat, socket) => {
    socket.on("message", ({ message }) => {
        const outgoing = createMessage({ nick: socket.nick, message: message, time: Date.now() });

        chat.runningBuffer.add(outgoing);
        chat.emit("message", outgoing);
    });
};

const sendHistory = (socket, buffer) => {
    socket.emit("history", buffer);
};

const createChat = server => {
    const chat = new IO(server);

    chat.runningBuffer = new RunningBuffer(10);

    chat.on("connection", socket => {
        setupConnectionProcedure(chat, socket);
        setupDisconnectionProcedure(chat, socket);
        setupMessageProcedure(chat, socket);
        sendHistory(socket, chat.runningBuffer.buffer);
    });

    return chat;
};

module.exports = { createChat };
