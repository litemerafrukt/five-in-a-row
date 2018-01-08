/**
 * test chat server
 *
 * The chat is inherently statefull. Test it as a statefull bettery.
 */
/* global describe test expect */
const os = require("os");
const server = require("http").createServer();
const IO = require("socket.io");
const clientIo = require("socket.io-client");

const { setupChat } = require("./chat");

var adress = "http://" + os.hostname() + ":1337";

server.listen(1337);

setupChat(new IO(server));

const options = {
    "force new connection": true
};

describe("test chat", () => {
    const client1 = clientIo(adress, options);

    test("client1 should receive a request nick message", done => {
        client1.on("requestNick", (_, fun) => {
            expect(fun).toBeInstanceOf(Function);
            setTimeout(() => done(), 0);
            return fun("client1");
        });
    });

    test("client1 should receive a newFriend event", done => {
        client1.on("newFriend", ({ message }) => {
            expect(message).toBe("client1 anslöt till chatten.");
            done();
        });
    });

    test("listener should receive history", done => {
        const listener = clientIo(adress, options);

        listener.on("history", history => {
            expect(history).toBeInstanceOf(Array);
            done();
        });
    });

    test("listener should receive message from client1", done => {
        const listener = clientIo(adress, options);

        listener.on("message", ({ message }) => {
            expect(message).toBe("whatnot");
            done();
        });
        setTimeout(() => {
            client1.emit("message", { nick: "client1", message: "whatnot" });
        }, 100);
    });

    test("listener should receive lostFriend message", done => {
        const listener = clientIo(adress, options);

        listener.on("lostFriend", ({ message }) => {
            expect(message).toContain("föll bort");
            done();
        });

        setTimeout(() => {
            client1.close();
        }, 500);
    });
});

// test("get something running", done => {
//     const clientSocket = clientIo(adress, options);
//     const clientMessenger = clientIo(adress, options);

//     clientSocket.on("message", ({ message }) => {
//         expect(message).toBe("test message");
//         done();
//     });
//     setTimeout(() => {
//         clientMessenger.emit("message", { nick: "test", message: "test message" });
//     }, 0);
// });

// test("request nick", done => {
//     const clientSocket = clientIo(adress, options);

//     clientSocket.on("newFriend", ({ message }) => {
//         expect(message).toBe("client1 anslöt till chatten.");
//         done();
//     });

//     // clientSocket.on("requestNick", (_, fun) => fun("client1"));
// });

// test("message on client disconnect", done => {
//     const clientReceiver = clientIo(adress, options);
//     const clientDisconnecter = clientIo(adress, options);

//     clientReceiver.on("lostFriend", ({ message }) => {
//         expect(message).toEqual("disconnecter föll bort pga");
//         done();
//     });

//     clientDisconnecter.on("requestNick", (_, fun) => fun("disconnecter"));

//     setTimeout(() => {
//         clientDisconnecter.close();
//     }, 100);
// });
