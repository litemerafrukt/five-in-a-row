/**
 * test game socket stuff
 *
 * games are saved on server. Test stuff state full as a battery
 *
 */
/* global describe test expect afterAll */
const os = require("os");
const server = require("http").createServer();
const IO = require("socket.io");
const clientIo = require("socket.io-client");

const setupGameSocketHandling = require("./game");
const Games = require("../games/games");

var adress = "http://" + os.hostname() + ":1339";

server.listen(1339);

// Mock up some pending and ongoing games
const games = new Games();

const pendingGameId = games.createPending("iampending", 10);
const mockGameId = games.createPending("iamongoing", 10);

games.joinPending(mockGameId, "ijoinedongoing");

setupGameSocketHandling(new IO(server), games);

afterAll(() => {
    server.close();
});

const options = {
    "force new connection": true
};

describe("test game socket stuff", () => {
    const player = clientIo(adress, options);

    test("player1 should receive pending games after creating game", done => {
        const player1 = clientIo(adress, options);

        player1.on("pendingGames", pending => {
            expect(pending).toBeInstanceOf(Array);
            done();
        });

        setTimeout(() => {
            let id = "shouldnotbethis";

            player1.emit(
                "createPendingGame",
                { nick: "klasse", size: 19 },
                answer => {
                    expect(answer).toHaveProperty("nick");
                    expect(answer).toHaveProperty("id");
                    id = answer.id;
                }
            );
            setTimeout(() => player1.emit("cancelPendingGame", { id }));
        }, 1);
    });

    test("player should get pending games on request", done => {
        const player2 = clientIo(adress, options);

        player2.on("pendingGames", pending => {
            expect(pending).toBeInstanceOf(Array);
            done();
        });

        player2.emit("requestPendingGames");
    });

    test("request game should return", done => {
        player.emit("requestGame", { id: "notFound" }, gameIsNotFound => {
            expect(gameIsNotFound).toBeNull();
            done();
        });
    });

    test("request mock game should return not null", done => {
        player.emit("requestGame", { id: mockGameId }, game => {
            expect(game).toHaveProperty("game");
            expect(game).toHaveProperty("id", mockGameId);
            done();
        });
    });

    test("request ongoing game list should return ongoing games", done => {
        const player3 = clientIo(adress, options);

        player3.on("ongoingGames", games => {
            expect(games).toBeInstanceOf(Array);
            done();
        });

        setTimeout(() => player3.emit("requestOngoingGames"), 1);
    });

    describe("create, make move and abandon game", () => {
        const player4 = clientIo(adress, options);
        const gameId = pendingGameId;

        test("joining a game should couse emit of 'gameCreated'", done => {
            player4.on("gameCreated", game => {
                expect(game).toHaveProperty("id", gameId);
                done();
            });

            player4.emit("joinPendingGame", {
                nick: "another",
                id: pendingGameId
            });
        });

        test("make a valid move", done => {
            player4.on("gameUpdated", game => {
                expect(game).toHaveProperty("game.id", gameId);
                done();
            });

            player4.emit("makeMove", {
                id: gameId,
                nick: "iampending",
                pos: { x: 0, y: 0 }
            });
        });

        test("make invalid move", done => {
            player4.on("gameError", ({ id }) => {
                expect(id).toBe(gameId);
                done();
            });

            player4.emit("makeMove", {
                id: gameId,
                nick: "iampending",
                pos: { x: 0, y: 0 }
            });
        });

        test("cancel game should couse a 'gameAbandoned' message", done => {
            player4.on("gameAbandoned", ({ id }) => {
                expect(id).toBe(gameId);
                done();
            });

            player4.emit("cancelGame", { id: gameId });
        });
    });
});
