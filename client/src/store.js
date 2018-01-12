import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import nicknameReducer from "./reducers/nickname";
import connectionReducer from "./reducers/connection";
import messageReducer from "./reducers/messages";
import chatReducer from "./reducers/chat";
import gamesReducer from "./reducers/games";
import watchGameReducer from "./reducers/watchGame";
import historyReducer from "./reducers/history";

const reducer = combineReducers({
    nick: nicknameReducer,
    chat: chatReducer,
    games: gamesReducer,
    watchGame: watchGameReducer,
    history: historyReducer,
    connection: connectionReducer,
    message: messageReducer
});

export default createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk))
);
