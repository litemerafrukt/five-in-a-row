const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../../client/build")));

// Catch all, send react app via index.html if no previous match
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "../../client/build/index.html"));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("Not Found");

    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.sendFile(path.join(__dirname + "/client/build/index.html"));
    res.json({ err: err });
});

module.exports = app;
