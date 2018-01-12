/**
 * test run index.js
 */
/* global expect test afterAll */
const http = require("http");
const server = require("./index.js");

afterAll(() => server.close());

test("should start and return server", () => {
    expect(server).toBeInstanceOf(http.Server);
});
