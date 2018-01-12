import { addStatusMessage } from "./messages";

const initialState = {
    game: null,
    historicGames: []
};

const SET_HISTORIC_GAMES = "SET_HISTORIC_GAMES";
const SET_HISTORIC_GAME = "SET_HISTORIC_GAME";
const CLEAR_HISTORIC_GAME = "CLEAR_HISTORIC_GAME";

export const setHistoricGames = games => ({
    type: SET_HISTORIC_GAMES,
    payload: games
});

export const requestHistoricGames = () => (dispatch, getState) => {
    const { socket } = getState().connection;

    socket.emit("requestGameHistory", {}, answer => {
        switch (answer.res) {
            case "ok":
                dispatch(setHistoricGames(answer.payload));
                break;
            case "error":
                console.log(answer.payload);
                dispatch(
                    addStatusMessage({
                        message: `Fel vid historiehämtning: ${
                            answer.payload.message
                        }`,
                        style: "danger"
                    })
                );
                break;
            default:
                console.log(
                    "Should not be here in default case in getHistoricGames"
                );
        }
    });
};

export const setHistoricGame = game => ({
    type: SET_HISTORIC_GAME,
    payload: game
});

export const clearHistoricGame = () => ({
    type: CLEAR_HISTORIC_GAME
});

export const getHistoricGame = id => (dispatch, getState) => {
    const { socket } = getState().connection;

    socket.emit("requestHistoricGame", { id }, answer => {
        console.log(answer);
        switch (answer.res) {
            case "ok":
                dispatch(setHistoricGame(answer.payload));
                break;
            case "error":
                dispatch(
                    addStatusMessage(`Fel vid spelhämtning ${answer.payload}`)
                );
                break;
            default:
                console.log(
                    "Should not be here in default case in getHistoricGame"
                );
        }
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_HISTORIC_GAMES:
            return { ...state, historicGames: action.payload };

        case SET_HISTORIC_GAME:
            console.log("historic game", action.payload);
            return { ...state, game: action.payload };

        case CLEAR_HISTORIC_GAME:
            return { ...state, game: null };

        default:
            return state;
    }
};
