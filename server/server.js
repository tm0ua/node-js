require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cors Origin Resource Sharing
app.use(cors(corsOptions));

/**
 * MIDDLEWARE
 */
// built-in middleware to handle urlencoded data in other words,
// form data: "content-type: application/x-www-form-urlencoded".
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());
// middleware for cookies
app.use(cookieParser());

/**
 * STATIC FILES
 */
// serve static files (e.g. css, images, etc.)
app.use("/", express.static(path.join(__dirname, "/public")));
// apply static files to the sub directory
app.use("/subdir", express.static(path.join(__dirname, "/public")));

/**
 * ROUTES
 */
// route to root directory
app.use("/", require("./routes/root"));
// route to register
app.use("/register", require("./routes/register"));
// route to login
app.use("/auth", require("./routes/auth"));
// route to sub directory
app.use("/subdir", require("./routes/subdir"));
// route to refresh token
app.use("/refresh", require("./routes/refresh"));
// route to logout
app.use("/logout", require("./routes/logout"));

// verify JWT for all routes below
app.use(verifyJWT);
// api route example
app.use("/employees", require("./routes/api/employees"));

/**
 * ROUTE HANDLERS
 */
// Example of route handlers.
app.get(/\/hello(.html)?/, (req, res, next) => {
    console.log("attempted to load hello.html");
    next();
}, (req, res) => {
    res.send("hello world!");
})
// Example of chaining route handlers.
const one = (req, res, next) => {
    console.log("one");
    next();
}
const two = (req, res, next) => {
    console.log("two");
    next();
}
const three = (req, res, next) => {
    console.log("three");
    res.send("finished!")
}
app.get(/\/chain(.html)?/, [one, two, three])
// End

app.all(/\/*/, (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
})

app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
