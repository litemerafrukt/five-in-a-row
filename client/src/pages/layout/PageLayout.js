import React from "react";
import Navbar from "./Navbar.js";

const PageLayout = ({ children }) => (
    <div className="App">
        <Navbar />
        <main>
            <div className="main-container">{children}</div>
        </main>
    </div>
);

export default PageLayout;
