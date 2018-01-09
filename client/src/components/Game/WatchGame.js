import React from "react";
import { connect } from "react-redux";

import * as gomoku from "../../gomoku/gomokugame";
import { clearWatching } from "../../reducers/watchGame";
import { GameCell, GameState, NextInTurn } from "./Game";

const GomokuGame = props => {
    const { game } = props.watchGame;
    const { clearWatching } = props;

    const gameStatePlaying =
        game === null ? false : game.state === gomoku.STATE.PLAYING;

    return game === null ? (
        <p>väntar på servern...</p>
    ) : (
        <div>
            <GameState gameState={game.state} players={game.players} />
            <p>Spelare: {game.players.join(", ")}</p>
            {gameStatePlaying && (
                <NextInTurn
                    nextToMove={game.nextToMove}
                    players={game.players}
                />
            )}
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
