import React from "react";
import { connect } from "react-redux";

import { requestPeers } from "../../reducers/connection";

const Peers = class extends React.Component {
    componentDidMount() {
        this.props.requestPeers();
    }

    render() {
        const { peers } = this.props;

        return (
            <div>
                <h5>Anslutna</h5>
                <ul>{peers.map(nick => <li key={nick}>{nick}</li>)}</ul>
            </div>
        );
    }
};

export default connect(store => ({ peers: store.connection.users }), { requestPeers })(Peers);
