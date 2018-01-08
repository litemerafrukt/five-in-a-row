const initialState = {
    message: "",
    style: "info"
};

const ADD_MESSAGE = "ADD_MESSAGE";
const CLEAR_MESSAGE = "CLEAR_MESSAGE";

export const addStatusMessage = message => ({ type: ADD_MESSAGE, payload: message });
export const clearStatusMessage = () => ({ type: CLEAR_MESSAGE });

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGE: {
            const newState =
                typeof action.payload === "string"
                    ? { ...initialState, message: action.payload }
                    : { ...initialState, ...action.payload };

            return newState;
        }

        case CLEAR_MESSAGE:
            return initialState;

        default:
            return state;
    }
};
