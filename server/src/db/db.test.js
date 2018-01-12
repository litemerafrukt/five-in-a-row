/*
 * Test db 
 */
/* global expect test jest */

jest.mock("mongodb");

const db = require("./db");

test("dbDo runs", done => {
    const fun = () => "i was called";

    db
        .dbDo("mocked")(fun)
        .then(funReturnVal => expect(funReturnVal).toEqual("i was called"))
        .then(done());
});

test("collectionDo runs", done => {
    const collectionName = "fakeCollection";
    const fun = val => Promise.resolve(collectionName);

    db
        .collectionDo(db.dbDo("mocked"))(collectionName)(fun)
        .then(funReturnVal => expect(funReturnVal).toEqual(collectionName))
        .then(done());
});
