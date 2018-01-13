const Maybe = require("folktale/maybe");
const gomoku = require("../games/gomoku/gomokugame");
const gameHistory = require("../history/games");

const noop = () => {};

const gameEnded = game => game.state !== gomoku.STATE.PLAYING;

const saveGame = game => {
    gameHistory.insert(game);
};

const setupGameSocketHandling = (io, games) => {
    io.on("connection", socket => {
        socket.on("createPendingGame", ({ nick, size }, fn) => {
            const id = games.createPending(nick, size);

            fn({ nick, id });
            io.emit("pendingGames", games.pending);
        });

        socket.on("requestPendingGames", () =>
            socket.emit("pendingGames", games.pending),
        );

        socket.on("requestOngoingGames", () =>
            socket.emit(
                "ongoingGames",
                games.ongoing.map(g => ({ id: g.id, players: g.game.players })),
            ),
        );

        socket.on("requestGame", ({ id }, fn) => {
            fn(games.ongoing.find(g => g.id === id));
        });

        socket.on("joinPendingGame", ({ id, nick }) => {
            const game = games.joinPending(id, nick);

            io.emit("gameCreated", game);
            io.emit("pendingGames", games.pending);
            io.emit(
                "ongoingGames",
                games.ongoing.map(g => ({ id: g.id, players: g.game.players })),
            );
        });

        socket.on("cancelPendingGame", ({ id }) => {
            games.removePending(id);
            io.emit("pendingGames", games.pending);
        });

        socket.on("cancelGame", ({ id }) => {
            games.removeOngoing(id);
            io.emit("gameAbandoned", { id });
        });

        socket.on("makeMove", ({ id, nick, pos }) => {
            const resultGame = games.makeMove(id, nick, pos);

            Maybe.fromResult(resultGame)
                .filter(g => gameEnded(g.game))
                .matchWith({
                    Just: ({ value }) => {
                        saveGame(value.game);
                        io.emit("gameEnded", value);
                    },
                    Nothing: noop,
                });

            resultGame.matchWith({
                Ok: ({ value }) => io.emit("gameUpdated", { game: value }),
                Error: ({ value }) =>
                    io.emit("gameError", { id, error: value }),
            });
        });
    });

    return io;
};

module.exports = setupGameSocketHandling;
