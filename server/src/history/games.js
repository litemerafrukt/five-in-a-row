const setupHistory = (db, dsn, collectionName) => {
    const historyDo = db.collectionDo(db.dbDo(dsn))(collectionName);

    const all = () => historyDo(c => c.find().toArray());
    const findOneById = id =>
        historyDo(c => c.findOne({ _id: db.ObjectID(id) }));
    const insert = game => historyDo(c => c.insert(game));

    return { all, findOneById, insert };
};

module.exports = setupHistory;
