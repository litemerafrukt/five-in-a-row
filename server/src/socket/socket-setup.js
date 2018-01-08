const Maybe = require("folktale/maybe");
const Games = require("../games/games");
const Users = require("../users/users.js");
const RunningBuffer = require("./running-buffer/running-buffer");

const gomoku = require("../games/gomoku/gomokugame");

const games = new Games();
const users = new Users();
const runningMessageBuffer = new RunningBuffer(15);

const noop = () => {};

const saveOnGameEnd = game =>
    game.state !== gomoku.STATE.PLAYING && console.log("Game ended!", game);

const createMessage = ({ message = "", nick = "server", time = Date.now() }) => ({
    message,
    nick,
    time
});

const setupUserSocketHandling = io => {
    io.on("connection", socket => {
        console.log("connection");

        socket.emit("requestNick", {}, nick => {
            if (users.nickAvailable(nick)) {
                users.add(nick, socket.id);
                socket.emit("nickAccepted");
                io.emit("newFriend", nick);
                return;
            }
            console.log("två med samma nick: ", nick);
            socket.emit("nickRejected");
            socket.disconnect(true);
        });

        // socket.on("requestPeers", () => {
        //     socket.emit("peerList", users.users.map(user => user.nick));
        // });

        socket.on("requestPeers", (_, fn) => {
            fn(users.users.map(user => user.nick));
        });

        socket.on("disconnect", () => {
            const maybeUser = Maybe.fromNullable(
                users.users.find(user => user.socketId === socket.id)
            );
            const maybePendingGame = maybeUser.chain(user =>
                Maybe.fromNullable(games.pending.find(pg => pg.nick === user.nick))
            );
            const maybeGame = maybeUser.chain(user =>
                Maybe.fromNullable(
                    games.ongoing.find(g => g.game.players.find(n => n === user.nick) !== undefined)
                )
            );

            maybeGame.matchWith({
                Just: ({ value }) => {
                    console.log(`removing ongoing game: ${value.id}`);
                    games.removeOngoing(value.id);
                    io.emit("abandonedGame", value.id);
                },
                Nothing: noop
            });
            maybePendingGame.matchWith({
                Just: ({ value }) => {
                    console.log(`removing pending game: ${value.id}`);
                    games.removePending(value.id);
                    io.emit("pendingGames", games.pending);
                },
                Nothing: noop
            });
            maybeUser.matchWith({
                Just: ({ value }) => {
                    console.log(`removing user: ${value.nick}`);
                    users.remove(value.socketId);
                    io.emit("lostFriend", `${value.nick}`);
                },
                Nothing: noop
            });
        });
    });

    return io;
};

const setupChatSocketHandling = io => {
    io.on("connection", socket => {
        socket.on("requestHistory", () => {
            runningMessageBuffer.buffer.forEach(message => {
                console.log(message);
                socket.emit("chatMessage", message);
            });
        });

        socket.on("chatMessage", ({ nick, message }) => {
            const outgoing = createMessage({ nick, message, time: Date.now() });

            runningMessageBuffer.add(outgoing);
            io.emit("chatMessage", outgoing);
        });
    });

    return io;
};

const setupGameSocketHandling = io => {
    io.on("connection", socket => {
        socket.on("createPendingGame", ({ nick, size }, fn) => {
            const id = games.createPending(nick, size);

            fn({ nick, id });
            io.emit("pendingGames", games.pending);
        });

        socket.on("requestPendingGames", () => socket.emit("pendingGames", games.pending));

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
                Error: ({ value }) => io.emit("gameError", { id, gameError: value })
            });
        });
    });

    return io;
};

const socketSetup = io => {
    setupUserSocketHandling(io);
    setupChatSocketHandling(io);
    setupGameSocketHandling(io);
};

module.exports = socketSetup;
