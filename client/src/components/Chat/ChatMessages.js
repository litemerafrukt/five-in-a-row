import React from "react";

const toLocalTime = t => new Date(t).toLocaleTimeString("sv") || t;

const ChatMessage = ({ message }) => (
    <div className="chat-message underdash">
        <div className="chat-time-nick">
            <span className="chat-time">
                [{typeof message.time === "number" ? toLocalTime(message.time) : message.time}]
            </span>
            <span className="chat-nick">{message.nick}</span>
        </div>
        <div className="">{message.message}</div>
    </div>
);

export const ChatMessages = ({ messages }) => (
    <div className="chat-messages">
        {messages.map((m, i) => console.log(m) || <ChatMessage key={i} message={m} />)}
    </div>
);
