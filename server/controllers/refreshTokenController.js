// NOTE: The commented code is not needed anymore since we have
// implemented MongoDB and no longer writing to the users.json file.
// const usersDB = {
//     users: require("../model/users.json"),
//     setUsers: function (data) { this.users = data }
// }
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // unauthorized
    const refreshToken = cookies.jwt;

    // const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (error, decoded) => {
            if (error || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                // TODO: move object into variable since it's being used in multiple files
                { "UserInfo":
                    {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "30s" } // TODO: Set to 5-15 mins for production
            );
            res.json({ accessToken });
        }
    )
}

module.exports = { handleRefreshToken }