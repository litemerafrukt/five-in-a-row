/**
 * Start up this thing
 */
const http = require("http");
const IO = require("socket.io");

const app = require("./src/app");
const socketSetup = require("./src/socket-setup/socket-setup");

const Games = require("./src/games/games");
const Users = require("./src/users/users");
const RunningBuffer = require("./src/running-buffer/running-buffer");

const games = new Games();
const users = new Users();
const runningChatBuffer = new RunningBuffer(15);

/**
 * Get port from environment.
 */

const port =
    process.env.DBWEBB_PORT ||
    process.env.PORT ||
    process.env.LOCAL_DEV_PORT ||
    "3000";

app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Create IO
 */
const io = new IO(server);

/**
 * Create chat
 */
socketSetup(io, users, games, runningChatBuffer);

/**
 * Start listening
 */
server.listen(port, () =>
    console.log(`Five-in-a-row server available on port ${port}.`)
);
