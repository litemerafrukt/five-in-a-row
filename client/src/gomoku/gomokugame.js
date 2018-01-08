const Result = require("folktale/result");
const Board = require("./gomokuboard");

// Helpers
const JSONClone = obj => JSON.parse(JSON.stringify(obj));
const assoc = (key, val, obj) => Object.assign({}, JSONClone(obj), { [key]: val });

/**
 * Player and Game state
 *
 * Using instead of sum types for easy serializetion
 */

// Player
const PLAYER = {
    ONE: 1,
    TWO: 2
};

const STATE = {
    PLAYING: "playing",
    DRAW: "draw",
    WINNER_PLAYER1: PLAYER.ONE,
    WINNER_PLAYER2: PLAYER.TWO
};

const GAME_ERROR = {
    ILLEGAL_MOVE: "Illegal move",
    NOT_IN_TURN: "Player not in turn trying to make a move"
};

// :: (String, String, Number) -> Game
const create = (nick1, nick2, size) => ({
    players: [nick1, nick2],
    state: STATE.PLAYING,
    nextToMove: PLAYER.ONE,
    board: Board.create(size),
    moves: []
});

// :: (Player, Position) -> Game
const addMoveToHistory = (player, { x, y }) => game =>
    assoc("moves", [{ player, x, y }, ...game.moves], game);

const checkPlayingState = game => {
    switch (game.state) {
        case STATE.DRAW:
        case STATE.WINNER_PLAYER1:
        case STATE.WINNER_PLAYER2:
            return Result.Error(game.state);
        default:
            return Result.Ok(game);
    }
};

// :: Player -> Game -> Result.Error(GAME_ERROR) | Result.Ok(Game)
const checkPlayerToPlay = playerToPlay => game =>
    game.nextToMove !== playerToPlay ? Result.Error(GAME_ERROR.NOT_IN_TURN) : Result.Ok(game);

// :: (Player, Position) -> Game -> Result.Error(GAME_ERROR) | Result.Ok(Game)
const placeMove = (playerToPlay, pos) => game =>
    Board.setPos(game.board, pos, game.nextToMove).matchWith({
        Just: ({ value }) => Result.Ok(assoc("board", value, game)),
        Nothing: () => Result.Error(GAME_ERROR.ILLEGAL_MOVE)
    });

// :: Game -> Game
const tickPlayer = game =>
    game.nextToMove === PLAYER.ONE
        ? assoc("nextToMove", PLAYER.TWO, game)
        : assoc("nextToMove", PLAYER.ONE, game);

// :: (Game, Position) -> Game
const calculateState = (game, lastMove) =>
    Board.getWinnerAt(game.board, lastMove)
        .map(winner => (winner === PLAYER.ONE ? STATE.WINNER_PLAYER1 : STATE.WINNER_PLAYER2))
        .getOrElse(Board.isFull(game.board) ? STATE.DRAW : STATE.PLAYING);

// :: Position -> Game -> Game
const setState = lastMove => game => assoc("state", calculateState(game, lastMove), game);

// makeMove :: (Game, Player, Position) -> Result.Error(STATE | GAME_ERROR) | Result.Ok(Game)
const makeMove = (game, playerToPlay, pos) =>
    Result.of(game)
        .chain(checkPlayingState)
        .chain(checkPlayerToPlay(playerToPlay))
        .chain(placeMove(playerToPlay, pos))
        .map(addMoveToHistory(playerToPlay, pos))
        .map(tickPlayer)
        .map(setState(pos));

module.exports = {
    STATE,
    PLAYER,
    GAME_ERROR,
    create,
    makeMove,
    pos: Board.pos
};
