import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { nicknameReducer } from "./reducers/nickname";

const reducer = combineReducers({ nick: nicknameReducer });

export default createStore(reducer, composeWithDevTools());
