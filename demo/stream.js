/**
 * Streams a more efficient way to read and write large amounts of data.
 */
const fs = require("fs");

const rs = fs.createReadStream("./text/lorem.txt", { encoding: "utf8" });

const ws = fs.createWriteStream("./text/new-lorem.txt");

// rs.on("data", (dataChunk) => {
//     ws.write(dataChunk);
// });

// pipe is more efficient method to write large amounts
// of data to a file instead of ".on".
rs.pipe(ws)