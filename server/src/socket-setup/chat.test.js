/**
 * test chat socket stuff
 *
 * The chat is inherently statefull. Test it as a statefull battery.
 */
/* global describe test expect afterAll */
const os = require("os");
const server = require("http").createServer();
const IO = require("socket.io");
const clientIo = require("socket.io-client");

const setupChatSocketHandling = require("./chat");
const RunningBuffer = require("../running-buffer/running-buffer");

var adress = "http://" + os.hostname() + ":1337";

server.listen(1337);

const runningBuffer = new RunningBuffer(1);

runningBuffer.add({ nick: "test", message: "testmessage", time: 0 });

setupChatSocketHandling(new IO(server), runningBuffer);

afterAll(() => {
    server.close();
});

const options = {
    "force new connection": true
};

describe("test chat", () => {
    const client1 = clientIo(adress, options);

    test("listener should receive history", done => {
        const listener = clientIo(adress, options);

        listener.on("chatMessage", message => {
            expect(message).toMatchObject({
                nick: "test",
                message: "testmessage"
            });
            done();
        });

        listener.emit("requestHistory");
    });

    test("listener should receive message from client1", done => {
        const listener = clientIo(adress, options);

        listener.on("chatMessage", ({ message }) => {
            expect(message).toBe("testmessage");
            done();
        });
        setTimeout(() => {
            client1.emit("chatMessage", {
                nick: "test",
                message: "testmessage"
            });
        }, 100);
    });
});
