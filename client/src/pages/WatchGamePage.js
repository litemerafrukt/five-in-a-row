import React from "react";
import { connect } from "react-redux";

import OngoingGames from "../components/OngoingGames/OngoingGames";
import WatchGame from "../components/Game/WatchGame";

const WatchGamePage = props => {
    const { watching } = props.watchGame;

    return <div>{watching ? <WatchGame /> : <OngoingGames />}</div>;
};

export default connect(state => ({ watchGame: state.watchGame }))(WatchGamePage);
