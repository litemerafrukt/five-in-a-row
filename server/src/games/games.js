const Result = require("folktale/result");
const uniqid = require("uniqid");
const gomoku = require("./gomoku/gomokugame");

const playerIndexToPlayer = index => {
    switch (index) {
        case 0:
            return gomoku.PLAYER.ONE;
        case 1:
            return gomoku.PLAYER.TWO;
        default:
            return undefined;
    }
};

class PendingGame {
    constructor(nick, size) {
        this.nick = nick;
        this.size = size;
        this.id = uniqid();
    }
}

class Game {
    constructor(pendingGame, nick2) {
        this.game = gomoku.create(pendingGame.nick, nick2, pendingGame.size);
        this.id = pendingGame.id;
    }

    setGame(game) {
        this.game = game;
        return game;
    }

    makeMove(nick, pos) {
        const player = playerIndexToPlayer(this.game.players.findIndex(n => n === nick));

        return player === undefined
            ? Result.Error(`Player ${nick} not part of game ${this.id}`)
            : gomoku.makeMove(this.game, player, pos).matchWith({
                Ok: ({ value }) => {
                    this.game = value;
                    return Result.Ok(this);
                },
                Error: ({ value }) => Result.Error({ value })
            });
    }
}

class Games {
    constructor() {
        this.ongoing = [];
        this.pending = [];
    }

    joinPending(id, nick2) {
        const pendingGame = this.pending.find(pg => pg.id === id);
        const game = new Game(pendingGame, nick2);

        this.ongoing.push(game);
        this.removePending(id);

        return game;
    }

    createPending(nick, size) {
        const pending = new PendingGame(nick, size);

        this.pending.push(pending);
        return pending.id;
    }

    removePending(id) {
        this.pending = this.pending.filter(pg => pg.id !== id);
    }

    removeOngoing(id) {
        this.ongoing = this.ongoing.filter(o => o.id !== id);
    }

    makeMove(id, nick, pos) {
        return Result.fromNullable(
            this.ongoing.find(game => game.id === id),
            `No game with id: ${id}`
        ).chain(game => game.makeMove(nick, pos));
    }
}

module.exports = Games;
