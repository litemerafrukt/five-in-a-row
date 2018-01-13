import io from "socket.io-client";
import * as SE from "./socketEventHandlers/socketEventHandlers";
import { setNickname } from "./nickname";

import { addStatusMessage } from "./messages";

const initialState = {
    socket: null,
    users: [],
};

const SET_SOCKET = "SET_SOCKET";
const ADD_PEER = "ADD_PEER";
const REMOVE_PEER = "REMOVE_PEER";
const SET_PEERS = "SET_PEERS";
const CLEAR_PEERS = "CLEAR_PEERS";

export const setSocket = socket => ({ type: SET_SOCKET, payload: socket });
export const addPeer = nick => ({ type: ADD_PEER, payload: nick });
export const removePeer = nick => ({ type: REMOVE_PEER, payload: nick });
export const setPeers = peers => ({ type: SET_PEERS, payload: peers });

export const connectSocket = nickname => (dispatch, getState) => {
    let { socket } = getState().connection;

    if (socket === null) {
        socket = io();
    }

    SE.connectionEvents(socket);

    socket.on("requestNick", (_, func) => func(nickname));
    socket.on("nickAccepted", () => {
        SE.chatEvents(socket);
        SE.peerEvents(socket);
        SE.gameEvents(socket);
        dispatch(setSocket(socket));
        dispatch(setNickname(nickname));
    });
    // socket.on("nickRejected", () => console.log("nick rejected"));
};

export const closeSocket = () => (dispatch, getState) => {
    const { socket } = getState().connection;

    socket.close();
    dispatch(setSocket(null));
};

export const requestPeers = () => (dispatch, getState) => {
    const { socket } = getState().connection;

    dispatch(addStatusMessage("Hämtar uppkopplade användare..."));

    socket.emit("requestPeers", {}, peerList => dispatch(setPeers(peerList)));
};

export const clearPeers = () => ({ type: CLEAR_PEERS });

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_SOCKET:
            return { ...state, socket: action.payload };

        case SET_PEERS:
            return { ...state, users: action.payload };

        case ADD_PEER:
            return { ...state, users: [...state.users, action.payload] };

        case REMOVE_PEER:
            return {
                ...state,
                users: state.users.filter(nick => nick !== action.payload),
            };

        case CLEAR_PEERS:
            return { ...state, users: [] };

        default:
            return state;
    }
};
