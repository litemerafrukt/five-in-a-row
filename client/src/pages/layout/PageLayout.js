import React from "react";
import Navbar from "./Navbar.js";
import Message from "../../components/Message/Message";
import Chat from "../../components/Chat/Chat";
import Peers from "../../components/Peers/Peers";

const PageLayout = ({ children }) => (
    <div className="App">
        <Navbar />
        <main>
            <div className="container">
                <Message />
                {children}
            </div>
        </main>
        <div className="chat-peers container">
            <div className="chat">
                <Chat />
            </div>
            <div className="peers">
                <Peers />
            </div>
        </div>
    </div>
);

export default PageLayout;
