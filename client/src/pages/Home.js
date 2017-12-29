import React from "react";
import { connect } from "react-redux";
import { inputNickname, setNickname } from "../reducers/nickname";

const Home = props => {
    const { currentInput, name, inputNickname, setNickname } = props;

    const handleInputChange = ({ target }) => inputNickname(target.value);

    const handleEnter = ({ key }) => key === "Enter" && setNickname();

    return (
        <div>
            <h2>Välkommen till fem i rad!</h2>
            {name ? (
                <p>
                    Du är just nu känd som: <strong>{name}</strong>
                </p>
            ) : (
                <p>Ange ett nickname och joina communityn</p>
            )}
            <input
                type="text"
                onChange={handleInputChange}
                onKeyDown={handleEnter}
                value={currentInput}
            />
        </div>
    );
};

export default connect(({ nick }) => nick, {
    inputNickname,
    setNickname
})(Home);
