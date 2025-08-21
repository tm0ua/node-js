const express = require("express");
const router = express.Router();
const path = require("path");

// must begin with a "/" and must end with a "/" or index.html.
router.get(/^\/$|\/index(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "index.html"));
});

router.get(/\/test(.html)?/, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "subdir", "test.html"));
});

module.exports = router;