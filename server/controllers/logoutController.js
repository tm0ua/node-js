// NOTE: The commented code is not needed anymore since we have
// implemented MongoDB and no longer writing to the users.json file.
// const usersDB = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require("fs").promises;
// const path = require("path");
const User = require("../model/User");

const handleLogout = async (req, res) => {
    // TODO: on client (i.e. frontend), also delete the accessToken
    // can't be done on backend, set to zero or blank

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // successful but no content to send back
    const refreshToken = cookies.jwt;

    // check if refresh token already exist in db
    // const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true } /*TODO: move object to a central variable*/);
        return res.sendStatus(204); // successful but no content
    }

    // delete refreshToken in db
    // const otherUsers = usersDB.users.filter((person) => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = { ...foundUser, refreshToken: "" };
    // usersDB.setUsers([...otherUsers, currentUser]);
    // // write to file now
    // await fsPromises.writeFile(
    //     path.join(__dirname, "..", "model", "users.json"),
    //     JSON.stringify(usersDB.users)
    // )
    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true } /*TODO: move object to a central variable*/);
    res.sendStatus(204);
}

module.exports = { handleLogout }