import React from "react";
import { connect } from "react-redux";

import { Chat } from "../components/Chat/Chat";

const Lobby = ({ name }) => <Chat nick={name} />;

export default connect(({ nick }) => ({ name: nick.name }))(Lobby);
