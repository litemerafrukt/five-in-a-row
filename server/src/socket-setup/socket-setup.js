const setupUserSocketHandling = require("./user");
const setupChatSocketHandling = require("./chat");
const setupGameSocketHandling = require("./game");
const setupHistorySocketHandling = require("./history");

const socketSetup = (io, users, games, runningMessageBuffer, history) => {
    setupUserSocketHandling(io, users, games);
    setupChatSocketHandling(io, runningMessageBuffer);
    setupGameSocketHandling(io, games);
    setupHistorySocketHandling(io, history);
};

module.exports = socketSetup;
