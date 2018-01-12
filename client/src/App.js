import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import PageLayout from "./pages/layout/PageLayout";
import Welcome from "./pages/Welcome";
import GamePage from "./pages/GamePage";
import WatchGamePage from "./pages/WatchGamePage";
import HistoricGamePage from "./pages/HistoricGamePage"

const App = ({ nickname }) => (
    <Router>
        {nickname === "" ? (
            <Route path="/" component={Welcome} />
        ) : (
            <Switch>
                <PageLayout>
                    <Route exact path="/" component={Welcome} />
                    <Route path="/game" component={GamePage} />
                    <Route path="/watch" component={WatchGamePage} />
                    <Route path="/history" component={HistoricGamePage} />
                </PageLayout>
            </Switch>
        )}
    </Router>
);

export default connect(({ nick }) => ({ nickname: nick.name }))(App);
