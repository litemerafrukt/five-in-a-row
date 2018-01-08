/* global it expect */
const Maybe = require("folktale/maybe");
const gb = require("./gomokuboard");
const R = require("ramda");
const winnerOn17x17 = require("./winning-board");

const emptyBoard10x10 = gb.create(10);

// prettier-ignore
const diagonalValuesBoard = [
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 4, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 4, 0, 0, 0, 0, 0, 0, 0, 0]
];

it("should create a 10x10 board", () => {
    expect(emptyBoard10x10.length).toBe(10);

    const totalBoardLen = R.compose(R.length, R.flatten);

    expect(totalBoardLen(emptyBoard10x10)).toBe(100);
});

it("new board should contain all zeroes", () => {
    const allZeroes = R.compose(R.all(x => x === 0), R.flatten);

    expect(allZeroes(emptyBoard10x10)).toBe(true);
});

it("getRelative should return Some(0)", () => {
    const pos = { x: 5, y: 5 };
    const posValue = gb.getRelative(emptyBoard10x10, pos, { dy: -1, dx: -1 });

    expect(posValue).toEqual(Maybe.Just(0));
});

it("getRelative should return Some(0) four pos away", () => {
    const pos = { x: 5, y: 5 };
    const posValue = gb.getRelative(emptyBoard10x10, pos, { dy: -4, dx: -4 });

    expect(posValue).toEqual(Maybe.Just(0));
});

it("getRelative should return Nothing when outside of board", () => {
    const pos = { x: -1, y: -1 };
    const posValue = gb.getRelative(emptyBoard10x10, pos, { dy: -1, dx: -1 });

    expect(posValue).toEqual(Maybe.Nothing());
});

it("should place 1 on 5, 4", () => {
    // prettier-ignore
    const expected = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const newBoard = gb.setPos(emptyBoard10x10, gb.pos(5, 4), 1);

    expect(newBoard).toEqual(Maybe.Just(expected));
});

it("should not place 1 on 5, 4 becouse it is taken", () => {
    // prettier-ignore
    const taken = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    const newBoard = gb.setPos(taken, gb.pos(5, 4), 2);

    expect(newBoard).toEqual(Maybe.Nothing());
});

it("should return 1 for fixed pos", () => {
    const newBoard = gb.setPos(emptyBoard10x10, gb.pos(5, 4), 1).getOrElse(emptyBoard10x10);

    const value = gb.getPos(newBoard, gb.pos(5, 4));

    expect(value).toEqual(Maybe.Just(1));
});

it("should return Maybe.Nothing() if trying to get pos out of bounds", () => {
    const value = gb.getPos(emptyBoard10x10, gb.pos(50, 40));

    expect(value).toEqual(Maybe.Nothing());
});

it("isBoardFull should return false for a none full board", () => {
    const value = gb.isFull(winnerOn17x17);

    expect(value).toEqual(false);
});

it("isBoardFull should return true for a full board", () => {
    const fullTicTacToe = [[1, 2, 1], [2, 1, 2], [2, 1, 1]];
    const value = gb.isFull(fullTicTacToe);

    expect(value).toEqual(true);
});

it("should return Maybe.Nothing() if trying to set pos out of bounds", () => {
    const newBoard = gb.setPos(emptyBoard10x10, gb.pos(100, 100), 1);

    expect(newBoard).toEqual(Maybe.Nothing());
});

it("getChain should return [5, 4, 3, 2, 1]", () => {
    const expected = [5, 4, 3, 2, 1];
    const pos = gb.pos(0, 0);
    const chained = gb.getChain(diagonalValuesBoard, 5, pos, { dx: 1, dy: 1 });

    expect(chained).toEqual(expected);
});

it("getChain should return [1, 2, 3, 4, 5]", () => {
    const expected = [1, 2, 3, 4, 5];
    const pos = gb.pos(4, 4);
    const chained = gb.getChain(diagonalValuesBoard, 5, pos, {
        dx: -1,
        dy: -1
    });

    expect(chained).toEqual(expected);
});

it("getChain should return [3, 4, 5]", () => {
    const expected = [3, 4, 5];
    const pos = gb.pos(2, 2);
    const chained = gb.getChain(diagonalValuesBoard, 5, pos, {
        dx: -1,
        dy: -1
    });

    expect(chained).toEqual(expected);
});

it("getChain should return [5]", () => {
    const expected = [5];
    const pos = gb.pos(0, 0);
    const chained = gb.getChain(diagonalValuesBoard, 5, pos, {
        dx: -1,
        dy: -1
    });

    expect(chained).toEqual(expected);
});

it("getChain should return [0, 0, 3, 0, 0]", () => {
    const expected = [0, 0, 3, 0, 0];
    const pos = gb.pos(0, 4);
    const chained = gb.getChain(diagonalValuesBoard, 5, pos, { dx: 1, dy: -1 });

    expect(chained).toEqual(expected);
});

it("getChain should return [0, 0, 0, 0, 1]", () => {
    const expected = [0, 0, 0, 0, 1];
    const pos = gb.pos(0, 4);
    const chained = gb.getChain(diagonalValuesBoard, 5, pos, { dx: 1, dy: 0 });

    expect(chained).toEqual(expected);
});

it("getChain should return [1, 2, 3, 4]", () => {
    const expected = [1, 2, 3, 4];
    const pos = gb.pos(4, 6);
    const chained = gb.getChain(diagonalValuesBoard, 4, pos, { dx: -1, dy: 1 });

    expect(chained).toEqual(expected);
});

it("getWinnerAt on empty board should return Maybe.Nothing", () => {
    const winner = gb.getWinnerAt(emptyBoard10x10, { x: 0, y: 0 });

    expect(winner).toEqual(Maybe.Nothing());
});

it("getWinnerAt should return Maybe.Nothing", () => {
    const winner = gb.getWinnerAt(winnerOn17x17, { x: 5, y: 5 });

    expect(winner).toEqual(Maybe.Nothing());
});

it("getWinnerAt should return Maybe.Just(1)", () => {
    const winner = gb.getWinnerAt(winnerOn17x17, { x: 14, y: 8 });

    expect(winner).toEqual(Maybe.Just(1));
});

it("findWinner should return Maybe.Just(1)", () => {
    const winner = gb.findWinner(winnerOn17x17);

    expect(winner).toEqual(Maybe.Just(1));
});

it("findWinner should return Maybe.Nothing", () => {
    const winner = gb.findWinner(emptyBoard10x10);

    expect(winner).toEqual(Maybe.Nothing());
});

it("flatten should return object with board as flat array and board size", () => {
    const flatBoard = gb.flatten(emptyBoard10x10);

    expect(flatBoard).toHaveProperty("board");
    expect(flatBoard).toHaveProperty("size");
    expect(flatBoard.size).toBe(10);
    expect(flatBoard.board.length).toBe(100);
    expect(flatBoard.board.every(x => x === 0)).toBe(true);
});
