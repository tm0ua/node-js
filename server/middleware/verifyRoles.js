const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        console.log("role required for route: ", rolesArray); // roles being passed in - roles allowed by the route - set in employees.js
        console.log("user role: ", req.roles); // roles coming from JWT - roles based on the user - set in users.json
        // check if roles being passed in is in the roles array
        const result = req.roles.map((role) => rolesArray.includes(role)).find((val) => val === true);
        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles