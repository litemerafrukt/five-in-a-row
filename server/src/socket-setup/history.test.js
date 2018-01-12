/**
 * test history socket stuff
 *
 */
/* global describe test expect afterAll */
const os = require("os");
const server = require("http").createServer();
const IO = require("socket.io");
const clientIo = require("socket.io-client");

const setupHistorySocketHandling = require("./history");

var adress = "http://" + os.hostname() + ":1340";

server.listen(1340);

const mockHistory = {
    all: () => Promise.resolve("all called"),
    findOneById: id => Promise.resolve(`findOneById called ${id}`)
};

setupHistorySocketHandling(new IO(server), mockHistory);

afterAll(() => {
    server.close();
});

const options = {
    "force new connection": true
};

describe("test retrieving history over socket, success story", () => {
    const client = clientIo(adress, options);

    test("requestGameHistory", done => {
        client.emit("requestGameHistory", {}, answer => {
            expect(answer).toEqual({ res: "ok", payload: "all called" });
            done();
        });
    });

    test("requestHistoricGame", done => {
        client.emit("requestHistoricGame", { id: 42 }, answer => {
            expect(answer).toEqual({
                res: "ok",
                payload: "findOneById called 42"
            });
            done();
        });
    });
});
