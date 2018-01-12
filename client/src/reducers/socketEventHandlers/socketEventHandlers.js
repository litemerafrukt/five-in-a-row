import store from "../../store";
import { addChatMessage } from "../chat";
import { addStatusMessage } from "../messages";
import { addPeer, removePeer, setPeers } from "../connection";
import {
    setPendingGames,
    gameCreated,
    gameAbandoned,
    gameUpdated
} from "../games";
import { setOngoingGames } from "../watchGame";
import { requestHistoricGames } from "../history";

export const connectionEvents = socket => {
    socket.on("connect", () => {
        console.log("server connected");
    });

    socket.on("disconnect", reason => {
        console.log("server disconnected");
        console.log(reason);
        switch (reason) {
            case "transport error":
                // Probably server crash, don't try to recover state, just reload.
                window.location.reload(true);
                break;

            case "io server disconnect":
                // Probably nick taken
                store.dispatch(
                    addStatusMessage({
                        message:
                            "Servern kopplade ner dig. Försök med ett annat nick.",
                        style: "danger"
                    })
                );
                break;

            default:
                store.dispatch(
                    addStatusMessage({
                        message: "Uppkopplingen till servern försvann!",
                        style: "danger"
                    })
                );
        }
        store.dispatch(setPeers([]));
    });
};

export const chatEvents = socket => {
    socket.on("chatMessage", message => {
        store.dispatch(addChatMessage(message));
    });
};

export const peerEvents = socket => {
    socket.on("newFriend", nick => {
        store.dispatch(addStatusMessage(`${nick} anslöt`));
        store.dispatch(addPeer(nick));
    });

    socket.on("lostFriend", nick => {
        store.dispatch(addStatusMessage(`${nick} föll bort`));
        store.dispatch(removePeer(nick));
    });
};

export const gameEvents = socket => {
    socket.on("pendingGames", pendingGames =>
        store.dispatch(setPendingGames(pendingGames))
    );

    socket.on("ongoingGames", ongoingGames =>
        store.dispatch(setOngoingGames(ongoingGames))
    );

    socket.on("gameCreated", game => {
        store.dispatch(gameCreated(game));
    });

    socket.on("gameAbandoned", ({ id }) => store.dispatch(gameAbandoned(id)));

    socket.on("gameUpdated", ({ game }) => store.dispatch(gameUpdated(game)));

    socket.on("gameError", ({ id, error }) =>
        console.log(`gameError: ${id}: `, error)
    );

    socket.on("gameEnded", game => store.dispatch(requestHistoricGames()));
};
