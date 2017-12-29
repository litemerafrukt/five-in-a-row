import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => (
    <div className="navbar">
        <span className="nav-brand">
            <Link to="/">Five in a Row</Link>
        </span>
        <span>
            <nav>
                <NavLink to="/lobby" activeClassName="nav-selected">
                    Lobby
                </NavLink>
            </nav>
        </span>
    </div>
);

export default Navbar;
