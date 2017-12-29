/**
 * test chat server
 */
/* global test expect */
const os = require("os");
const server = require("http").createServer();
const clientIo = require("socket.io-client");

const { createChat } = require("./chat");

createChat(server);

var adress = "http://" + os.hostname() + ":1337";

server.listen(1337);

const options = {
    "force new connection": true
};

test("get something running", done => {
    const clientSocket = clientIo(adress, options);
    const clientMessenger = clientIo(adress, options);

    clientSocket.on("message", ({ message }) => {
        expect(message).toBe("test message");
        done();
    });
    setTimeout(() => {
        clientMessenger.emit("message", { nick: "test", message: "test message" });
    }, 0);
});

test("request nick", done => {
    const clientSocket = clientIo(adress, options);

    clientSocket.on("newFriend", ({ message }) => {
        expect(message).toBe("client1 anslöt till chatten.");
        done();
    });

    clientSocket.on("requestNick", (_, fun) => fun("client1"));
});
