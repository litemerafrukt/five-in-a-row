/**
 * Start up this thing
 */
const http = require("http");
const app = require("./src/app");
const { createChat } = require("./src/chat/chat");

/**
 * Get port from environment.
 */

const port = process.env.DBWEBB_PORT || process.env.PORT || process.env.LOCAL_DEV_PORT || "3000";

app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Create chat
 */
createChat(server);

/**
 * Start listening
 */
server.listen(port, () => console.log(`Dojo available on port ${port}.`));
