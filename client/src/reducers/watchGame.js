import { addStatusMessage } from "./messages";
import { gameUpdated } from "./games";

const initialState = {
    game: null,
    ongoingGames: [],
    watching: null,
    // gameMessage: ""
};

const GAME_UPDATED = "GAME_UPDATED";
// const GAME_MESSAGE = "GAME_MESSAGE";
// const CLEAR_GAME_MASSAGE = "CLEAR_GAME_MASSAGE";
const SET_ONGOING_GAMES = "SET_ONGOING_GAMES";
const WATCH_GAME = "WATCH_GAME";
const CLEAR_WATCHING = "CLEAR_WATCHING";

// export const gameMessage = message => ({ type: GAME_MESSAGE, payload: message });
// export const clearGameMessage = () => ({ type: CLEAR_GAME_MASSAGE });
export const setOngoingGames = ongoingGames => ({
    type: SET_ONGOING_GAMES,
    payload: ongoingGames,
});
export const setWatchGame = id => ({ type: WATCH_GAME, payload: id });
export const clearWatching = () => ({ type: CLEAR_WATCHING });

export const gameAbandoned = id => (dispatch, getState) => {
    const { watching } = getState().watchGame;

    if (watching === id) {
        dispatch(addStatusMessage("Spelet du tittade på övergavs"));
        dispatch(clearWatching());
    }
};

export const requestOngoingGames = () => (dispatch, getState) => {
    const { socket } = getState().connection;

    socket.emit("requestOngoingGames");
};

export const watchGame = id => (dispatch, getState) => {
    const { socket } = getState().connection;

    dispatch(setWatchGame(id));
    socket.emit("requestGame", { id }, game => {
        game ? dispatch(gameUpdated(game)) : dispatch(clearWatching());
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_ONGOING_GAMES:
            return { ...state, ongoingGames: action.payload };

        case GAME_UPDATED: {
            const { watching } = state;
            const { id, game } = action.payload;

            if (watching === id) {
                return { ...state, game: game };
            }
            return state;
        }

        case WATCH_GAME:
            return { ...state, watching: action.payload };

        case CLEAR_WATCHING:
            return { ...state, game: null, watching: null };

        // case GAME_MESSAGE:
        //     return { ...state, gameMessage: action.payload };

        // case CLEAR_GAME_MASSAGE:
        //     return { ...state, gameMessage: "" };

        default:
            return state;
    }
};
