/**
 * test user socket stuff
 *
 * users are saved on server. Test stuff state full as a battery
 *
 * TODO: add tests to remove ongoing games and pending games
 */
/* global describe test expect afterAll */
const os = require("os");
const server = require("http").createServer();
const IO = require("socket.io");
const clientIo = require("socket.io-client");

const setupUserSocketHandling = require("./user");
const Users = require("../users/users");
const Games = require("../games/games");

var adress = "http://" + os.hostname() + ":1338";

server.listen(1338);

setupUserSocketHandling(new IO(server), new Users(), new Games());

afterAll(() => {
    server.close();
});

const options = {
    "force new connection": true
};

describe("test user socket stuff", () => {
    const client1 = clientIo(adress, options);

    test("client1 should receive a request nick message", done => {
        client1.on("requestNick", (_, fun) => {
            expect(fun).toBeInstanceOf(Function);
            setTimeout(() => done(), 0);
            return fun("client1");
        });
    });

    test("client1 should receive a newFriend event", done => {
        client1.on("newFriend", nick => {
            expect(nick).toBe("client1");
            done();
        });
    });

    test("two clients with same nick are not allowed", done => {
        const sameNick = clientIo(adress, options);

        sameNick.on("disconnect", reason => {
            expect(reason).toEqual("io server disconnect");
            done();
        });

        sameNick.on("requestNick", (_, fn) => fn("client1"));
    });

    test("should receive array on requestPeers", done => {
        client1.emit("requestPeers", {}, peers => {
            expect(peers).toBeInstanceOf(Array);
            done();
        });
    });

    test("listener should receive lostFriend message", done => {
        const listener = clientIo(adress, options);

        listener.on("lostFriend", message => {
            expect(message).toContain("client1");
            done();
        });

        setTimeout(() => {
            client1.close();
        }, 300);
    });
});
