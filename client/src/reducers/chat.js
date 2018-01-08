import { addStatusMessage } from "./messages";

const initialState = { messages: [], statusMessage: "" };

export const ADD_CHAT_MESSAGE = "ADD_CHAT_MESSAGE";
export const CLEAR_ALL_MESSAGES = "CLEAR_ALL_MESSAGES";
export const CHAT_STATUS_MESSAGE = "CHAT_STATUS_MESSAGE";

export const addChatMessage = message => ({ type: ADD_CHAT_MESSAGE, payload: message });
export const chatStatusMessage = status => ({ type: CHAT_STATUS_MESSAGE, payload: status });
export const clearAllMessages = () => ({ type: CLEAR_ALL_MESSAGES });

export const sendMessage = message => (dispatch, getState) => {
    const { socket } = getState().connection;
    const { name } = getState().nick;

    socket.emit("chatMessage", { message, nick: name });
    dispatch(chatStatusMessage("Sänder meddelande..."));
};

export const requestHistory = () => (dispatch, getState) => {
    const { socket } = getState().connection;

    dispatch(clearAllMessages());

    socket.emit("requestHistory");
    // dispatch(addStatusMessage("Hämtar chat historik..."));
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_CHAT_MESSAGE:
            return { ...state, messages: [...state.messages, action.payload], statusMessage: "" };

        case CLEAR_ALL_MESSAGES:
            return { ...state, messages: [] };

        case CHAT_STATUS_MESSAGE:
            return { ...state, statusMessage: action.payload };

        default:
            return state;
    }
};
