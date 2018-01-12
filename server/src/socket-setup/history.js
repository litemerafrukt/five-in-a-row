const setupHistorySocketHandling = (io, history) => {
    io.on("connection", socket => {
        socket.on("requestGameHistory", (_, fn) => {
            history
                .all()
                .then(all => fn({ res: "ok", payload: all }))
                .catch(err => fn({ res: "error", payload: err }));
        });

        socket.on("requestHistoricGame", ({ id }, fn) => {
            history
                .findOneById(id)
                .then(game => fn({ res: "ok", payload: game }))
                .catch(err => fn({ res: "error", payload: err }));
        });
    });
};

module.exports = setupHistorySocketHandling;
