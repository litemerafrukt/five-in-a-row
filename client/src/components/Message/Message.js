import React from "react";
import { connect } from "react-redux";
import { clearStatusMessage } from "../../reducers/messages";

const Message = ({ message, style, clearMessage }) =>
    message ? (
        <div title="Stäng" className="message-wrap" onClick={clearMessage}>
            <span className={`message ${style}`}>{message}</span>
        </div>
    ) : null;

export default connect(state => ({ message: state.message.message, style: state.message.style }), {
    clearMessage: clearStatusMessage
})(Message);
