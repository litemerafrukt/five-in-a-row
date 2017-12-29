const initialState = {
    name: "",
    currentInput: ""
};

const SET_NICKNAME = "SET_NICKNAME";
const INPUT_NICKNAME = "INPUT_NICKNAME";

export const inputNickname = value => ({ type: INPUT_NICKNAME, payload: value });
export const setNickname = () => ({ type: SET_NICKNAME });

export const nicknameReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_NICKNAME:
            return { ...state, name: state.currentInput, currentInput: "" };
        case INPUT_NICKNAME:
            return { ...state, currentInput: action.payload };
        default:
            return state;
    }
};
