const gomoku = require("../games/gomoku/gomokugame");

const noop = () => {};

const saveOnGameEnd = game =>
    game.state !== gomoku.STATE.PLAYING && console.log("Game ended!", game);

const setupGameSocketHandling = (io, games) => {
    io.on("connection", socket => {
        socket.on("createPendingGame", ({ nick, size }, fn) => {
            const id = games.createPending(nick, size);

            fn({ nick, id });
            io.emit("pendingGames", games.pending);
        });

        socket.on("requestPendingGames", () =>
            socket.emit("pendingGames", games.pending)
        );

        socket.on("requestOngoingGames", () =>
            socket.emit(
                "ongoingGames",
                games.ongoing.map(g => ({ id: g.id, players: g.game.players }))
            )
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
                games.ongoing.map(g => ({ id: g.id, players: g.game.players }))
            );
        });
        socket.on("cancelPendingGame", ({ id }) => {
            games.removePending(id);
            io.emit("pendingGames", games.pending);
        });

        socket.on("cancelGame", ({ id }) => {
            games.removeOngoing(id);
            io.emit("gameAbandoned", { id });
            console.log("removed game: ", id);
            console.log(games.ongoing);
        });

        socket.on("makeMove", ({ id, nick, pos }) => {
            const resultGame = games.makeMove(id, nick, pos);

            resultGame.matchWith({
                Ok: ({ value }) => saveOnGameEnd(value.game),
                Error: noop
            });

            resultGame.matchWith({
                Ok: ({ value }) => io.emit("gameUpdated", { game: value }),
                Error: ({ value }) =>
                    console.log(value) ||
                    io.emit("gameError", { id, error: value })
            });
        });
    });

    return io;
};

module.exports = setupGameSocketHandling;
