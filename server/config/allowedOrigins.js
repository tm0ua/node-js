/**
 * To test CORS with google.
 * open chrome browser and go to console in dev tools.
 * run >> fetch("http://localhost:3500").
 * should generate CORS error.
 * add google to allowedOrigins array.
 * run >> fetch("http://localhost:3500") again.
 * no CORS error this time.
 */
const google = "https://www.google.com";

// http://127.0.0.1 is the same as localhost.
const react = "http://127.0.0.1:5500";
const angular = "http://localhost:4200";
const nodejs = "http://localhost:3500";
const myWebSite = "https://www.mywebsite.com";

const allowedOrigins = [react, angular, nodejs, myWebSite];

module.exports = allowedOrigins;