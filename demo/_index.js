const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile(path.join(__dirname, "text", "starter.txt"), "utf8");
        console.log(data);
        // delete the starter.txt file after reading it.
        await fsPromises.unlink(path.join(__dirname, "text", "starter.txt"));
        // write to new file.
        await fsPromises.writeFile(path.join(__dirname, "text", "promiseWrite.txt"), data);
        // add to existing file.
        await fsPromises.appendFile(path.join(__dirname, "text", "promiseWrite.txt"), " Nice to meet you!");
        // rename file.
        await fsPromises.rename(path.join(__dirname, "text", "promiseWrite.txt"), path.join(__dirname, "text", "promiseComplete.txt"));
        // read from the new/renamed file.
        const newData = await fsPromises.readFile(path.join(__dirname, "text", "promiseComplete.txt"), "utf8");
        console.log(newData);
    } catch (error) {
        console.error(error)
    }
}

fileOps();

// fs.readFile(path.join(__dirname, "text", "starter.txt"), "utf8", (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })


/**
 * Manual method of handling asynchronous calls by nesting them.
 */
// // Create new file and write to it.
// fs.writeFile(path.join(__dirname, "text", "write.txt"), "Nice to meet you!", (err) => {
//     if (err) throw err;
//     console.log("Write is complete.");

//     fs.appendFile(path.join(__dirname, "text", "write.txt"), "\nYes it is!", (err) => {
//         if (err) throw err;
//         console.log("_Append is complete.");

//         fs.rename(path.join(__dirname, "text", "write.txt"), path.join(__dirname, "text", "_write.txt"), (err) => {
//             if (err) throw err;
//             console.log("_Rename is complete.");
//         })

//     })
// })

// // Update existing otherwise create new file if it doesn't exist.
// fs.appendFile(path.join(__dirname, "text", "append.txt"), "Nice to meet you!", (err) => {
//     if (err) throw err;
//     console.log("Append is complete.");
// })

// exit on uncaught errors
process.on("uncaughtException", err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})