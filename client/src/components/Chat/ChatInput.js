import React, { Component } from "react";

export class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = { input: "" };

        this.handleChange = this.handleChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
    }

    handleChange(event) {
        const input = event.target.value;

        this.setState(() => ({ input }));
    }

    handleOk() {
        const message = this.state.input.trim();

        this.setState(() => ({ input: "" }));

        if (message !== "") {
            this.props.sendMessage(message);
        }
    }

    handleEnter({ key }) {
        if (key === "Enter") {
            this.handleOk();
        }
    }

    render() {
        return (
            <div className="chat-input">
                <input
                    value={this.state.input}
                    type="text"
                    placeholder=""
                    onChange={this.handleChange}
                    onKeyDown={this.handleEnter}
                />

                <button onClick={this.handleOk}>Ok</button>
            </div>
        );
    }
}
