
const allowedOrigins = require("./allowedOrigins");

// Handle Cross Origin Resource Sharing.
const corsOptions = {
    origin: (origin, callback) => {
        // "!origin" logic use for dev env only - remove for production.
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;