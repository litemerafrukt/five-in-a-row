import React from "react";
import { connect } from "react-redux";

import { requestHistoricGames, getHistoricGame } from "../../reducers/history";

const HistoricGames = class extends React.Component {
    componentWillMount() {
        this.props.requestHistoricGames();
    }

    render() {
        const { historicGames, getHistoricGame } = this.props;

        return (
            <div>
                <h5>Historiska spel</h5>
                <ul>
                    {historicGames.map(g => (
                        <li key={g._id}>
                            <button
                                className="btn btn-link"
                                onClick={() => getHistoricGame(g._id)}
                            >
                                {g.players[0]} vs {g.players[1]}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};

export default connect(
    ({ history }) => ({ historicGames: history.historicGames }),
    {
        requestHistoricGames,
        getHistoricGame,
    },
)(HistoricGames);
