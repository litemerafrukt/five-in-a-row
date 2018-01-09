const setupUserSocketHandling = require("./user");
const setupChatSocketHandling = require("./chat");
const setupGameSocketHandling = require("./game");



const socketSetup = (io, users, games, runningMessageBuffer) => {
    setupUserSocketHandling(io, users, games);
    setupChatSocketHandling(io, runningMessageBuffer);
    setupGameSocketHandling(io, games);
};

module.exports = socketSetup;
