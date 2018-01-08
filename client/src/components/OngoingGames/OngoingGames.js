import React from "react";
import { connect } from "react-redux";

import { requestOngoingGames, watchGame } from "../../reducers/watchGame";

const OngoingGames = class extends React.Component {
    componentWillMount() {
        this.props.requestOngoingGames();
    }

    render() {
        const { ongoingGames, watchGame, playing } = this.props;

        return (
            <div>
                <h5>Pågående spel</h5>
                <ul>
                    {ongoingGames.map(g => (
                        <li key={g.id}>
                            <button className="btn btn-link" onClick={() => watchGame(g.id)}>
                                {g.players[0]} vs {g.players[1]}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};

export default connect(({ watchGame }) => ({ ongoingGames: watchGame.ongoingGames }), {
    requestOngoingGames,
    watchGame
})(OngoingGames);
