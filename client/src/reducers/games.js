import { addStatusMessage } from "./messages";

const initialState = {
    game: null,
    playing: null,
    pendingGames: [],
    myPendingGame: null
    // gameMessage: ""
};

const SET_PENDING_GAMES = "SET_PENDING_GAMES";
const SET_MY_PENDING_GAME = "SET_MY_PENDING_GAME";
const CLEAR_MY_PENDING_GAME = "CLEAR_MY_PENDING_GAME";
const SET_PLAYING = "SET_PLAYING";
const GAME_STARTED = "GAME_CREATED";
const GAME_UPDATED = "GAME_UPDATED";
const CLEAR_GAME = "CLEAR_GAME";
// const GAME_MESSAGE = "GAME_MESSAGE";
// const CLEAR_GAME_MASSAGE = "CLEAR_GAME_MASSAGE";

export const setPendingGames = pendingGames => ({ type: SET_PENDING_GAMES, payload: pendingGames });
export const setMyPendingGame = id => ({
    type: SET_MY_PENDING_GAME,
    payload: id
});
export const clearMyPendingGame = () => ({ type: CLEAR_MY_PENDING_GAME });
export const clearGame = () => ({ type: CLEAR_GAME });
export const gameStarted = game => ({ type: GAME_STARTED, payload: game });
export const setPlaying = id => ({ type: SET_PLAYING, payload: id });
// export const gameMessage = message => ({ type: GAME_MESSAGE, payload: message });
// export const clearGameMessage = () => ({ type: CLEAR_GAME_MASSAGE });

export const requestPendingGames = () => (_, getState) => {
    const { socket } = getState().connection;

    socket.emit("requestPendingGames");
};

export const createPendingGame = size => (dispatch, getState) => {
    const { socket } = getState().connection;
    const { name } = getState().nick;

    socket.emit("createPendingGame", { nick: name, size }, ({ id }) => {
        dispatch(setMyPendingGame(id));
    });
};

export const cancelMyPendingGame = () => (dispatch, getState) => {
    const { socket } = getState().connection;
    const { myPendingGame } = getState().games;

    socket.emit("cancelPendingGame", { id: myPendingGame });
    dispatch(clearMyPendingGame());
};

export const joinPendingGame = pendingGameId => (dispatch, getState) => {
    const { socket } = getState().connection;
    const { name } = getState().nick;

    dispatch(setPlaying(pendingGameId));
    dispatch(cancelMyPendingGame());

    socket.emit("joinPendingGame", { id: pendingGameId, nick: name });
};

export const gameCreated = game => (dispatch, getState) => {
    const { myPendingGame, playing } = getState().games;

    if (game.id === myPendingGame) {
        dispatch(addStatusMessage("Ditt spel har startat"));
        dispatch(gameStarted(game));
    } else if (game.id === playing) {
        dispatch(gameStarted(game));
    }
};

export const makeMove = pos => (_, getState) => {
    const { socket } = getState().connection;
    const { name } = getState().nick;
    const { playing } = getState().games;

    socket.emit("makeMove", { id: playing, nick: name, pos });
};

export const abandonGame = id => (dispatch, getState) => {
    const { socket } = getState().connection;

    socket.emit("cancelGame", { id });
    dispatch(clearGame());
};

export const gameAbandoned = id => (dispatch, getState) => {
    const { playing } = getState().games;

    if (playing === id) {
        dispatch(
            addStatusMessage({
                message: "Spelet du spelade övergavs av motståndaren.",
                style: "warning"
            })
        );
    }
};

export const gameUpdated = game => ({ type: GAME_UPDATED, payload: game });

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PENDING_GAMES:
            return { ...state, pendingGames: action.payload };

        case SET_MY_PENDING_GAME: {
            return { ...state, myPendingGame: action.payload };
        }

        case CLEAR_MY_PENDING_GAME:
            return { ...state, myPendingGame: null };

        case CLEAR_GAME:
            return { ...state, game: null, playing: null };

        case GAME_STARTED: {
            const incomingGame = action.payload;

            return {
                ...state,
                myPendingGame: null,
                playing: incomingGame.id,
                game: incomingGame.game
            };
        }

        case GAME_UPDATED: {
            const { playing, watching } = state;
            const { id, game } = action.payload;

            if (playing === id) {
                return { ...state, game: game };
            } else if (watching === id) {
                return { ...state, watchGame: game };
            }
            return state;
        }

        case SET_PLAYING:
            return { ...state, playing: action.payload };

        // case GAME_MESSAGE:
        //     return { ...state, gameMessage: action.payload };

        // case CLEAR_GAME_MASSAGE:
        //     return { ...state, gameMessage: "" };

        default:
            return state;
    }
};
