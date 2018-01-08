import React from "react";
import { connect } from "react-redux";

import {
    requestPendingGames,
    createPendingGame,
    joinPendingGame,
    cancelMyPendingGame
} from "../../reducers/games";

const PendingGames = class extends React.Component {
    componentDidMount() {
        this.props.requestPendingGames();
    }

    render() {
        const {
            pendingGames,
            myPendingGame,
            createPendingGame,
            joinPendingGame,
            cancelMyPendingGame
        } = this.props;

        const createPending7 = () => createPendingGame(7);
        const createPending13 = () => createPendingGame(13);
        const createPending19 = () => createPendingGame(19);
        const joinPending = id => () => joinPendingGame(id);

        return (
            <div>
                <h5>Spelförfrågningar</h5>
                {myPendingGame === null ? (
                    <div>
                        <button className="btn btn-link" onClick={createPending7}>
                            Ny 7x7
                        </button>
                        <button className="btn btn-link" onClick={createPending13}>
                            Ny 13x13
                        </button>
                        <button className="btn btn-link" onClick={createPending19}>
                            Ny 19x19
                        </button>
                    </div>
                ) : null}
                <ul>
                    {pendingGames.map(
                        pg =>
                            pg.id !== myPendingGame ? (
                                <li key={pg.id}>
                                    <button className="btn btn-link" onClick={joinPending(pg.id)}>
                                        {pg.nick}
                                    </button>
                                </li>
                            ) : (
                                <li key={pg.id}>
                                    Min spelförfrågan
                                    <button className="btn btn-link" onClick={cancelMyPendingGame}>
                                        Ta bort
                                    </button>
                                </li>
                            )
                    )}
                </ul>
            </div>
        );
    }
};

export default connect(
    store => ({ pendingGames: store.games.pendingGames, myPendingGame: store.games.myPendingGame }),
    {
        requestPendingGames,
        createPendingGame,
        joinPendingGame,
        cancelMyPendingGame
    }
)(PendingGames);
