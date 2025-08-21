/**
 * How NodeJS differs from Vanilla JS
 * 1) Node runs on a server - not in a browser (backend not frontend)
 * 2) The console is the IDE terminal window
 * 3) Global object instead of the Window object
 * 4) Has Common Core modules
 * 5) CommonJS modules instead of ES6 modules (e.g. os = require("os"))
 * 6) Missing some JS APIs like fetch
 */


console.log("hello world");

const os = require("os");
const path = require("path");
// import math module
const math = require("./math")
// import match module by deconstruct
const { add, sub, mul, div } = require("./math");

console.log(os.type());
console.log(os.version());
console.log(os.homedir());

console.log("dirname:", __dirname);
console.log("filename:", __filename);

console.log("dirname:", path.dirname(__filename));
console.log("basename:", path.basename(__filename));
console.log("extname:", path.extname(__filename));

console.log("parse:", path.parse(__filename));

console.log("math.add:", math.add(2, 3));

console.log("add:",add(2, 3));
console.log("sub:",sub(2, 3));
console.log("mul:",mul(2, 3));
console.log("div:",div(2, 3));
