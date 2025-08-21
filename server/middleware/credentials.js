const allowedOrigins = require("../config/allowedOrigins");

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    // if url that is sending request is in the allowed origins list
    // set the header on the response to "Access-Control-Allow-Credentials: true"
    if (allowedOrigins.includes(origin)) {
        res.headers("Access-Control-Allow-Credentials", true);
    }
    next();
}

module.exports = credentials