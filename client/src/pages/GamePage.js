import React from "react";
import { connect } from "react-redux";

import PendingGames from "../components/PendingGames/PendingGames";
import Game from "../components/Game/Game";

const GamePage = props => {
    const { playing } = props.games;

    return <div>{playing ? <Game /> : <PendingGames />}</div>;
};

export default connect(state => ({ games: state.games }))(GamePage);
