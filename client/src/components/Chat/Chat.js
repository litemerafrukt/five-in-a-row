import React from "react";
import { connect } from "react-redux";

import { sendMessage, requestHistory } from "../../reducers/chat";

import "./css/chat.css";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

class Chat extends React.Component {
    componentDidMount() {
        this.props.requestHistory();
    }

    render() {
        const { chat, sendMessage } = this.props;

        return (
            <div>
                <h5>Chat</h5>
                <div>
                    <ChatInput sendMessage={sendMessage} />
                </div>
                <span>{chat.statusMessage}</span>
                <ChatMessages messages={chat.messages} />
            </div>
        );
    }
}

export default connect(
    store => ({
        chat: store.chat,
        socket: store.connection.socket
    }),
    { sendMessage, requestHistory }
)(Chat);
