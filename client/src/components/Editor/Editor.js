import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-dark.css";
import "./../../css/codemirror.css";

export class Editor extends Component {
    constructor(props) {
        super(props);
        this.state = { value: "" };
    }
    render() {
        return (
            <div>
                <CodeMirror
                    className="me"
                    value={this.state.value}
                    options={{
                        mode: "javascript",
                        theme: "base16-dark",
                        lineNumbers: true
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.setState({ value });
                    }}
                    onChange={(editor, data, value) => {
                        console.log(data, value);
                    }}
                />
            </div>
        );
    }
}
