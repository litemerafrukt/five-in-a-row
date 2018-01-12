/*
 * Test history functions
 */
/* global expect test jest */

jest.mock("mongodb");

const mockInnerHistoryDo = () => "called";

const dbMock = {
    dbDo: dsn => {},
    collectionDo: dbDoMock => mockCollectionName => mockInnerHistoryDo
};

const setupHistory = require("./games");

test("setup history collection", () => {
    const history = setupHistory(dbMock, "mocked", "collection");

    expect(history).toHaveProperty("all");
    expect(history).toHaveProperty("insert");
    expect(history).toHaveProperty("findOneById");
});

test("call all three collection functions", () => {
    const history = setupHistory(dbMock, "mocked", "collection");

    expect(history.all()).toEqual("called");
    expect(history.findOneById()).toEqual("called");
    expect(history.insert()).toEqual("called");
});
