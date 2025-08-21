const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

const logEvents = require("./logEvents");
const EventEmitter = require("events");
class Emitter extends EventEmitter {};

const eventName = "log";
const eventMessage = "Log event emitted!";

// initialize object
const myEmitter = new Emitter();
// add listener for the log event
myEmitter.on(eventName, (msg, fileName) => logEvents(msg, fileName));

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const rawData = await fsPromises.readFile(filePath, !contentType.includes("image") ? "utf8" : "");
        const data = contentType === "application/json" ? JSON.parse(rawData) : rawData;

        response.writeHead(filePath.includes("404.html") ? 404 : 200, { "Content-Type": contentType });
        response.end(contentType === "application/json" ? JSON.stringify(data) : data);
    } catch (error) {
        console.log(error);
        myEmitter.emit(eventName, `${error.name}: ${error.message}`, "errLog.txt");
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    myEmitter.emit(eventName, `${req.url}\t${req.method}`, "reqLog.txt");

    // get the file path extension.
    const extension = path.extname(req.url);
    // determine the content type based on the extension.
    let contentType;
    switch (extension) {
        case ".css":
            contentType = "text/css";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".txt":
            contentType = "text/plain";
            break;
        default:
            contentType = "text/html";
    }

    let _filePath = contentType === "text/html" && req.url === "/"
        ? path.join(__dirname, "views", "index.html")
        : contentType === "text/html" && req.url.slice(-1) === "/"
            ? path.join(__dirname, "views", req.url, "index.html")
            : contentType === "text/html"
                ? path.join(__dirname, "views", req.url)
                : path.join(__dirname, req.url);

    // // create the file path based on the content type and url.
    // let _filePath;
    // if (contentType === "text/html" && req.url === "/") {
    //     _filePath = path.join(__dirname, "views", "index.html");
    // } else if (contentType === "text/html" && req.url.slice(-1) === "/") {
    //     _filePath = path.join(__dirname, "views", req.url, "index.html");
    // } else if (contentType === "text/html") {
    //     _filePath = path.join(__dirname, "views", req.url);
    // } else {
    //     _filePath = path.join(__dirname, req.url);
    //     // console.log("else:", _filePath);
    // }

    // makes .html extension not required in the browser.
    // add .html extension to file.
    if (!extension && req.url.slice(-1) !== "/") {
        _filePath += ".html";
    }

    const fileExists = fs.existsSync(_filePath);

    if (fileExists) {
        // serve the file
        // console.log(path.parse(_filePath));
        serveFile(_filePath, contentType, res);
    } else {
        // console.log(path.parse(_filePath));
        switch (path.parse(_filePath).base) {
            case "old-page.html":
                // redirect to new page.
                res.writeHead(301, { "Location": "/new-page.html" });
                res.end();
                break;
            case "www-page.html":
                // redirect to default/home page.
                res.writeHead(301, { "Location": "/" });
                res.end();
                break;
            default:
                // serve a 404 response
                serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
        }
    }
})

// test the event emitter
// setTimeout(() => {
//     // Emit event
//     myEmitter.emit(eventName, eventMessage);
// }, 2000);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));