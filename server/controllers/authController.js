// NOTE: The commented code is not needed anymore since we have
// implemented MongoDB and no longer writing to the users.json file.
// const usersDB = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises = require("fs").promises;
// const path = require("path");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ "message": "Username and password are required." });

    // const foundUser = usersDB.users.find((person) => person.username === user);
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); // unauthorized not found
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWTs
        const accessToken = jwt.sign(
            // TODO: move object into variable since it's being used in multiple files
            { "UserInfo":
                {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30s" } // ideally 5-15 mins in production
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" } // ideally 1 day in production
        );
        // saving refreshToken with current user
        // const otherUsers = usersDB.users.filter((person) => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, "..", "model", "users.json"),
        //     JSON.stringify(usersDB.users)
        // )
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // send refresh token as httpOnly cookie which is not accessible by javascript
        // do NOT store in local storage or cookie
        // NOTE: when testing refresh token with Thunder Client delete "secure: true" property otherwise it will fail
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", maxAge: 24 * 60 * 60 * 1000 }); // TODO: move 1 day value to a constant
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }