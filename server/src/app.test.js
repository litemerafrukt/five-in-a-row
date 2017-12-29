/**
 * Preliminary tests
 */

/* global test */
const request = require("supertest");

const app = require("./app");

test("It should response to GET method on home with status 200", () => {
    return request(app)
        .get("/")
        .expect(200);
});

test("Should respond with 404 on /whatever", () => {
    return request(app)
        .get("/whatever")
        .expect(404);
});
