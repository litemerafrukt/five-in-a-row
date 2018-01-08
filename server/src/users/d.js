const Users = require("./users");
const createMessage = require("../chat/createMessage");

const users = new Users();

const setupUsersSocketHandling = io => {
    io.on("connection", socket => {
        socket.emit("requestNick", {}, nick => {
            if (!users.nickAvailable(nick)) {
                socket.emit("nickTaken", "nick taken");
            }
            const message = createMessage({ message: `${nick} connected` });

            users.add(nick, socket.id);
            io.emit("newFriend", message);
        });

        socket.on("disconnect", () => {
            const user = users.find(user => (user.socketId = socket.id));
        });
    });
};
