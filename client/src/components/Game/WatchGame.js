import React from "react";
import { connect } from "react-redux";

import * as gomoku from "../../gomoku/gomokugame";

import { clearWatching } from "../../reducers/watchGame";

const GameCell = props => {
    const { value, x, y, handleMakeMove, myTurn } = props;

    const ascii = value === 0 ? " " : value === 1 ? "X" : "O";
    const inactive = myTurn ? "" : "no-pointer";

    return (
        <span
            className={`game-cell ${ascii} ${inactive}`}
            onClick={() => {
                handleMakeMove({ x, y });
            }}
        >
            {ascii}
        </span>
    );
};

const GameState = props => {
    const stateMessage = () => {
        switch (props.gameState) {
            case gomoku.STATE.PLAYING:
                return "Spelar";

            case gomoku.STATE.DRAW:
                return "Spelet slutade oavgjort.";

            case gomoku.STATE.WINNER_PLAYER1:
                return `${props.players[0]} har vunnit!`;

            case gomoku.STATE.WINNER_PLAYER2:
                return `${props.players[1]} har vunnit!`;

            default:
                return "";
        }
    };

    return <h5>{stateMessage()}</h5>;
};

const NextInTurn = props => {
    const nextToPlay = () => {
        switch (props.nextToMove) {
            case gomoku.PLAYER.ONE:
                return `${props.players[0]} ska göra sitt drag.`;

            case gomoku.PLAYER.TWO:
                return `${props.players[1]} ska göra sitt drag.`;

            default:
                return "";
        }
    };

    return <h6>{nextToPlay()}</h6>;
};

const GomokuGame = props => {
    const { game } = props.watchGame;
    const { clearWatching } = props;

    const gameStatePlaying = game === null ? false : game.state === gomoku.STATE.PLAYING;

    return game === null ? (
        <p>väntar på servern...</p>
    ) : (
        <div>
            <GameState gameState={game.state} players={game.players} />
            <p>Spelare: {game.players.join(", ")}</p>
            {gameStatePlaying && <NextInTurn nextToMove={game.nextToMove} players={game.players} />}
            <div>
                {game.board.map((row, y) => (
                    <div className="game-row" key={y}>
                        {row.map((cell, x) => (
                            <GameCell
                                x={x}
                                y={y}
                                value={cell}
                                handleMakeMove={() => {}}
                                myTurn={false}
                                row={row}
                                key={x}
                            />
                        ))}
                    </div>
                ))}
            </div>
            <button className="btn btn-link" onClick={clearWatching}>
                Lämna
            </button>
        </div>
    );
};

export default connect(state => ({ watchGame: state.watchGame }), {
    clearWatching
})(GomokuGame);
