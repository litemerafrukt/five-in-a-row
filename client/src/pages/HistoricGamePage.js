import React from "react";
import { connect } from "react-redux";

import HistoricGames from "../components/HistoricGames/HistoricGames";
import HistoricGame from "../components/Game/HistoricGame";

const HistoricGamePage = props => {
    const { game } = props.game;

    return <div>{game ? <HistoricGame /> : <HistoricGames />}</div>;
};

export default connect(state => ({ game: state.history }))(HistoricGamePage);
