/*
 * Mock mongodb
 */

const MongoClient = {
    connect: dsn =>
        Promise.resolve({
            dsn,
            collection: collectionName => Promise.resolve(collectionName),
            close: () => "closed"
        })
};

const ObjectID = () => {};

module.exports = { MongoClient, ObjectID };
