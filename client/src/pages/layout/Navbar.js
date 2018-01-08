import React from "react";
import { connect } from "react-redux";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ name }) => (
    <div className="navbar container">
        <span className="nav-brand">
            <Link to="/">{name}</Link>
        </span>
        <span>
            <nav>
                <NavLink to="/game" activeClassName="nav-selected">
                    Spela
                </NavLink>
                <NavLink to="/watch" activeClassName="nav-selected">
                    Pågående spel
                </NavLink>
                <NavLink to="/history" activeClassName="nav-selected">
                    Sparade spel
                </NavLink>
            </nav>
        </span>
    </div>
);

export default connect(state => ({ name: state.nick.name }))(Navbar);
