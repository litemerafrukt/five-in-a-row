import React from "react";
import io from "socket.io-client";

import "./css/chat.css";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { messages: [], nick: props.nick };

        this.sendMessage = this.sendMessage.bind(this);
    }

    componentWillUnmount() {
        this.sendMessage("lämnar...");
        this.socket.close();
    }

    componentDidMount() {
        this.socket = io();

        this.socket.on("connect", () => {
            const message = { time: Date.now(), nick: "client", message: "anslöt till server" };

            this.setState(({ messages }) => ({ messages: [...messages, message] }));
            console.log("connected");
        });

        this.socket.on("disconnect", () => {
            const message = { time: Date.now(), nick: "client", message: "servern gick ner" };

            this.setState(({ messages }) => ({ messages: [...messages, message] }));
            console.log("disconnected");
        });

        this.socket.on("requestNick", (_, fun) => fun(this.state.nick));

        this.socket.on("newFriend", message => {
            this.setState(({ messages }) => ({ messages: [...messages, message] }));
        });

        this.socket.on("lostFriend", message => {
            this.setState(({ messages }) => ({ messages: [...messages, message] }));
        });

        this.socket.on("message", message => {
            console.log(`${message}`);
            this.setState(({ messages }) => ({ messages: [...messages, message] }));
        });

        this.socket.on("history", history => {
            const historyBegin = { time: "-", nick: "server", message: "--{ history start }--" };
            const historyEnd = { time: "-", nick: "server", message: "--{ history end }--" };

            this.setState(({ messages }) => ({
                messages: [...messages, historyBegin, ...history, historyEnd]
            }));
        });
    }

    sendMessage(message) {
        console.log("sending message: ", message);
        this.socket.emit("message", { message, nick: this.nick });
    }

    render() {
        // console.log(this.state);
        return (
            <div>
                <p>Nick: {this.state.nick}</p>
                <div>
                    <ChatInput sendMessage={this.sendMessage} />
                </div>
                <ChatMessages messages={this.state.messages} />
            </div>
        );
    }
}
