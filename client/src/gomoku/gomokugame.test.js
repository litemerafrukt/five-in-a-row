/**
 * Using 3x3 sizes in test but we can have no winner less then five in a row
 */
/* global it expect */
const Result = require("folktale/result");
const Game = require("./gomokugame");

const nick1 = "Tom";
const nick2 = "jamenvadåda";

// prettier-ignore
const boardOneFromWinningPlayerOneNext = [
    [0, 0, 1, 0, 2],
    [0, 1, 0, 1, 2],
    [0, 1, 2, 0, 0],
    [0, 1, 2, 0, 0],
    [0, 1, 2, 2, 0],
];

// prettier-ignore
const boardOneFromWinningPlayerTwoNext = [
    [0, 0, 0, 1, 2],
    [0, 0, 2, 1, 2],
    [0, 1, 2, 1, 0],
    [0, 1, 2, 0, 0],
    [1, 1, 2, 0, 0],
];

// prettier-ignore
const boardPlayingNextPlayerTwo = [
    [1, 0, 2],
    [0, 1, 0],
    [0, 0, 0]
];

// prettier-ignore
const boardOneFromFullNoWinner = [
    [1, 2, 2],
    [2, 1, 1],
    [0, 1, 2]
];

// prettier-ignore
const emptyTicTacToe = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

const gameNewlyCreatedTicTacToe = {
    players: [nick1, nick2],
    state: Game.STATE.PLAYING,
    nextToMove: 1,
    board: emptyTicTacToe,
    moves: []
};

const gameOneFromWinner = {
    players: [nick1, nick2],
    state: Game.STATE.PLAYING,
    nextToMove: 1,
    board: boardOneFromWinningPlayerOneNext,
    moves: []
};

const gamePlayerTwoOneFromWinner = {
    players: [nick1, nick2],
    state: Game.STATE.PLAYING,
    nextToMove: 2,
    board: boardOneFromWinningPlayerTwoNext,
    moves: []
};

const gameNextPlayerTwo = {
    players: [nick1, nick2],
    state: Game.STATE.PLAYING,
    nextToMove: 2,
    board: boardPlayingNextPlayerTwo,
    moves: []
};

const gameOneFromADraw = {
    players: [nick1, nick2],
    state: Game.STATE.PLAYING,
    nextToMove: 1,
    board: boardOneFromFullNoWinner,
    moves: []
};

it("should create a empty game", () => {
    const game = Game.create(nick1, nick2, 3);

    expect(game).toEqual(gameNewlyCreatedTicTacToe);
});

it("history should be present after making moves and the board reflect moves.", () => {
    const game = Game.create(nick1, nick2, 3);

    const expectedHistory = [
        { player: 1, x: 0, y: 0 },
        { player: 2, x: 2, y: 0 },
        { player: 1, x: 1, y: 1 }
    ];

    const game1 = Game.makeMove(game, Game.PLAYER.ONE, Game.pos(1, 1)).getOrElse(false);

    expect(game1.moves).toEqual([expectedHistory[2]]);

    const game2 = Game.makeMove(game1, Game.PLAYER.TWO, Game.pos(2, 0)).getOrElse(false);

    expect(game2.moves).toEqual([expectedHistory[1], expectedHistory[2]]);

    const game3 = Game.makeMove(game2, Game.PLAYER.ONE, Game.pos(0, 0)).getOrElse(false);

    expect(game3.moves).toEqual(expectedHistory);

    expect(game3.board).toEqual(boardPlayingNextPlayerTwo);
});

it("gamestate for a full board without a winner should be draw", () => {
    const game = Game.makeMove(gameOneFromADraw, Game.PLAYER.ONE, Game.pos(0, 2)).getOrElse(false);

    expect(game.state).toBe(Game.STATE.DRAW);
});

it("result of trying to move on a full board should be Result.Error(STATE.DRAW)", () => {
    const game = Game.makeMove(gameOneFromADraw, Game.PLAYER.ONE, Game.pos(0, 2)).getOrElse(false);

    const gameFin = Game.makeMove(game, Game.PLAYER.TWO, Game.pos(1, 1));

    expect(gameFin).toEqual(Result.Error(Game.STATE.DRAW));
});

it("gamestate should be winner player one after a winning move", () => {
    const game = Game.makeMove(gameOneFromWinner, Game.PLAYER.ONE, Game.pos(1, 0)).getOrElse(false);

    expect(game.state).toBe(Game.STATE.WINNER_PLAYER1);
});

it("gamestate should be winner player two after a winning move", () => {
    const game = Game.makeMove(
        gamePlayerTwoOneFromWinner,
        Game.PLAYER.TWO,
        Game.pos(2, 0)
    ).getOrElse(false);

    expect(game.state).toBe(Game.STATE.WINNER_PLAYER2);
});

it("should get Result.Error with winner if gamestate is winner", () => {
    const game = Game.makeMove(gameOneFromWinner, Game.PLAYER.ONE, Game.pos(1, 0)).chain(game =>
        Game.makeMove(game, Game.PLAYER.TWO, Game.pos(0, 0))
    );

    expect(game).toEqual(Result.Error(Game.STATE.WINNER_PLAYER1));
});

it("should get Result.Error(GAME_ERROR.ILLEGAL_MOVE) if trying to place on a taken pos", () => {
    const game = Game.makeMove(gameNextPlayerTwo, Game.PLAYER.TWO, Game.pos(1, 1));

    expect(game).toEqual(Result.Error(Game.GAME_ERROR.ILLEGAL_MOVE));
});

it("should get Result.Error(GAME_ERROR.NOT_IN_TURN) if wrong player is trying to place", () => {
    const game = Game.makeMove(gameNextPlayerTwo, Game.PLAYER.ONE, Game.pos(2, 2));

    expect(game).toEqual(Result.Error(Game.GAME_ERROR.NOT_IN_TURN));
});
