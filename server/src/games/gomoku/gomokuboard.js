const Maybe = require("folktale/maybe");

/********************************************************/
// Begining of my FP companion?
const array = length => Array.from({ length });

const range = (from, to) => array(to - from).map((_, i) => i + from);

/*******************************************************/
/**
 * :: Size -> Board
 *  Size = Number
 *  Board = [ [0 x Size] x Size ]
 */
// const create_ = size =>
//     Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
const create = size => array(size).map(() => array(size).fill(0));

/**
 * :: (Number, Number) -> Position
 *  Position = { x, y }
 */
const pos = (x, y) => ({ x, y });

/**
 * :: (Number, Number) -> Direction
 *  Direction = { dx, dy }
 */
const dir = (dx, dy) => ({ dx, dy });

// Named directions
const NW = dir(-1, -1);
const N = dir(0, -1);
const NE = dir(1, -1);
const E = dir(1, 0);
const SE = dir(1, 1);
const S = dir(0, 1);
const SW = dir(-1, 1);
const W = dir(-1, 0);

const allDir = [NW, N, NE, E, SE, S, SW, W];

/**
 * :: (Board, Position, DeltaPosition) -> Maybe(BoardPositionValue)
 */
const getRelative = (board, { x, y }, { dx, dy }) =>
    Maybe.fromNullable(board[y + dy]).chain(row => Maybe.fromNullable(row[x + dx]));

/**
 * :: (Board, Position) -> Maybe(BoardPositionValue)
 */
const getPos = (board, { x, y }) => getRelative(board, { x, y }, { dx: 0, dy: 0 });

/**
 * :: Board -> Bool
 */
const isFull = board => board.every(row => row.every(x => x !== 0));

/**
 * :: (Board, Position, Value) -> Maybe(Board)
 *  Value = Any
 */
const setPos = (board, { x, y }, val) =>
    Maybe.fromNullable(board[y])
        .chain(row => Maybe.fromNullable(row[x]))
        .filter(value => value === 0)
        .map(() =>
            // The above is a check, now replace with new board
            Object.assign([], board, {
                [y]: Object.assign([], board[y], { [x]: val })
            })
        );

/**
 * :: (Board, Number, Position, Direction, Array) -> Array
 */
const getChain = (board, length, pos, dir, chain = []) =>
    /* prettier-ignore */
    length > 0
        ? getChain(
            board,
            length - 1,
            pos,
            dir,
            getRelative(board, pos, {
                dx: dir.dx * (length - 1),
                dy: dir.dy * (length - 1)
            }).matchWith({
                Just: ({ value }) => [...chain, value],
                Nothing: () => chain
            })
        )
        : chain.reverse();

const fiveChainedFrom = (board, pos) => dir => getChain(board, 5, pos, dir);

const allDirectionChains = (board, pos) => allDir.map(fiveChainedFrom(board, pos));

const allPossiblePos = ({ length }) =>
    range(0, length)
        .map(y => range(0, length).map(x => ({ x, y })))
        .reduce((flat, yRow) => flat.concat(yRow), []);

/**
 * :: (Board, Position) -> Maybe(Player)
 */
const getWinnerAt = (board, pos) =>
    getPos(board, pos)
        .filter(x => x !== 0)
        .filter(player =>
            allDirectionChains(board, pos).some(
                direction => direction.length > 4 && direction.every(x => x === player)
            )
        );

const findWinner = board =>
    allPossiblePos(board).reduce(
        (foundWinner, pos) => foundWinner.orElse(() => getWinnerAt(board, pos)),
        Maybe.Nothing()
    );

const flatten = board => ({
    size: board.length,
    board: board.reduce((flat, row) => flat.concat(row), [])
});

module.exports = {
    create,
    pos,
    dir,
    setPos,
    getPos,
    isFull,
    getChain,
    getRelative,
    getWinnerAt,
    findWinner,
    flatten
};
