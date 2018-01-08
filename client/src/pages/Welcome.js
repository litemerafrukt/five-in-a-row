import React from "react";
import { connect } from "react-redux";
import { inputNickname } from "../reducers/nickname";
import { connectSocket } from "../reducers/connection";
import Message from "../components/Message/Message";

const Welcome = props => {
    const { currentInput, name, inputNickname, connectSocket } = props;

    const handleInputChange = ({ target }) => inputNickname(target.value);

    const handleEnter = ({ key }) => key === "Enter" && connectSocket(currentInput);

    return (
        <div>
            <h2>Välkommen till fem i rad!</h2>
            {name ? (
                <p>
                    Du är känd som: <strong>{name}</strong>
                </p>
            ) : (
                <div>
                    <Message />
                    <p>Ange ett nickname och joina communityn</p>
                    <input
                        type="text"
                        onChange={handleInputChange}
                        onKeyDown={handleEnter}
                        value={currentInput}
                    />
                </div>
            )}
        </div>
    );
};

export default connect(
    store => ({
        currentInput: store.nick.currentInput,
        name: store.nick.name
    }),
    {
        inputNickname,
        connectSocket
    }
)(Welcome);
