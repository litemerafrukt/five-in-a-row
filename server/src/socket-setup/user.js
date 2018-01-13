// const Maybe = require("folktale/maybe");
const fromNullable = require("folktale/conversions/nullable-to-maybe");

const noop = () => {};

const setupUserSocketHandling = (io, users, games) => {
    io.on("connection", socket => {
        socket.emit("requestNick", {}, nick => {
            if (users.nickAvailable(nick)) {
                users.add(nick, socket.id);
                socket.emit("nickAccepted");
                io.emit("newFriend", nick);
                return;
            }
            socket.emit("nickRejected");
            socket.disconnect(true);
        });

        socket.on("requestPeers", (_, fn) => {
            fn(users.users.map(user => user.nick));
        });

        socket.on("disconnect", () => {
            const maybeUser = fromNullable(
                users.users.find(user => user.socketId === socket.id),
            );
            const maybePendingGame = maybeUser.chain(user =>
                fromNullable(games.pending.find(pg => pg.nick === user.nick)),
            );
            const maybeGame = maybeUser.chain(user =>
                fromNullable(
                    games.ongoing.find(
                        g =>
                            g.game.players.find(n => n === user.nick) !==
                            undefined,
                    ),
                ),
            );

            maybeGame.matchWith({
                Just: ({ value }) => {
                    games.removeOngoing(value.id);
                    io.emit("abandonedGame", value.id);
                },
                Nothing: noop,
            });
            maybePendingGame.matchWith({
                Just: ({ value }) => {
                    games.removePending(value.id);
                    io.emit("pendingGames", games.pending);
                },
                Nothing: noop,
            });
            maybeUser.matchWith({
                Just: ({ value }) => {
                    users.remove(value.socketId);
                    io.emit("lostFriend", `${value.nick}`);
                },
                Nothing: noop,
            });
        });
    });

    return io;
};

module.exports = setupUserSocketHandling;
