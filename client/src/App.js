import React from "react";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import PageLayout from "./pages/layout/PageLayout";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";

const App = props => (
    <Router>
        {props.name === "" ? (
            <Route path="/" component={Home} />
        ) : (
            <Switch>
                <Redirect from="/join" to="/" />
                <PageLayout>
                    <Route exact path="/" component={Home} />
                    <Route path="/lobby" component={Lobby} />
                </PageLayout>
            </Switch>
        )}
    </Router>
);

export default connect(({ nick }) => ({ name: nick.name }))(App);
