import React, { Component } from "react";
import { connect } from "react-redux";

import * as gomoku from "../../gomoku/gomokugame";
import { clearHistoricGame } from "../../reducers/history";
import { GameCell, GameState, NextInTurn } from "./Game";

class HistoricGomokuGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            game: this.props.game,
            display: {
                game: this.props.game,
                moves: this.props.game.moves,
                nextMoveIndex: null
            },
            ticker: null
        };

        this.handleClose = this.handleClose.bind(this);
        this.replayGame = this.replayGame.bind(this);
        this.stopReplay = this.stopReplay.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.state.ticker);
    }

    handleClose() {
        clearInterval(this.state.ticker);
        this.props.clearHistoricGame();
    }

    replayGame() {
        this.startReplay();
        const intervalNum = setInterval(this.tickGame.bind(this), 500);

        this.setState(() => ({ ticker: intervalNum }));
    }

    startReplay() {
        this.setState(state => ({
            display: {
                ...state.display,
                game: gomoku.create(
                    this.state.game.players[0],
                    this.state.game.players[1],
                    this.state.game.board.length
                ),
                nextMoveIndex: state.display.moves.length - 1
            }
        }));
    }

    stopReplay() {
        clearInterval(this.state.ticker);
        this.setState(() => ({ ticker: null }));
    }

    tickGame() {
        const { game, moves, nextMoveIndex: moveIndex } = this.state.display;

        if (moveIndex === null) {
            this.stopReplay();
            return;
        }

        const nextMove = moves[moveIndex];
        const nextDisplayGame = gomoku
            .makeMove(game, nextMove.player, gomoku.pos(nextMove.x, nextMove.y))
            .matchWith({
                Ok: ({ value }) => value,
                Error: ({ value }) => console.log(value) || game
            });

        const nextMoveIndex = moveIndex > 0 ? moveIndex - 1 : null;

        this.setState(() => ({
            display: { game: nextDisplayGame, moves, nextMoveIndex }
        }));
    }

    render() {
        const { ticker } = this.state;
        const { game } = this.state.display;

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
                {ticker ? (
                    <button className="btn btn-link" onClick={this.stopReplay}>
                        Stoppa uppspelningen
                    </button>
                ) : (
                    <button className="btn btn-link" onClick={this.replayGame}>
                        Spela upp
                    </button>
                )}
                <button className="btn btn-link" onClick={this.handleClose}>
                    Stäng
                </button>
            </div>
        );
    }
}

export default connect(({ history }) => ({ game: history.game }), {
    clearHistoricGame
})(HistoricGomokuGame);
