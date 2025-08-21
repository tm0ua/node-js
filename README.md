# node-js
Demo project building a node js server.

# JWT architect
JSON Web Token

Access Token = Short Time (e.g. 5-15 minutes)
Refresh Token = Long Time (e.g. hours or days)

Security and Hazards:
- XSS: Cross-Site Scripting
- CSRF: Cross-Site Request Forgery

Access Token:
- Sent as JSON
- Client stores in memory
- Do NOT store in local storage or cookie

Refresh Token:
- Sent as httpOnly cookie
- Not accessible via JavaScript
- Must have expiry date at some point

Access Token Process:
- Issued at Authorization
- Client uses for API Access until expires
- Verified with Middleware
- New token issued at Refresh request

Refresh Token Process:
- Issued at Authorization
- Client uses to request new Access Token
- Verified with endpoint and database
- Must be allowed to expire or logout

Generate Token:
- start node (in terminal type: node)
- copy and paste: require("crypto).randomBytes(64).toString("hex")
- repeat for each token (i.e. ACCESS and REFRESH)

Frontend Notes:
- if using fetch for RestFul web services include property "credentials: 'include'"
example:
const sendLogin = async () => {
    const user = document.getElementById("user").value;
    const user = document.getElementById("pwd").value;

    try {
        const response = await fetch("http://localhost:3500/auth", {
            method: "POST,
            headers: { "content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ user, pwd })
        });
        if (!response.ok) {
            if (response.status === 401) {
                return await sendRefreshToken();
            }
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.log(error.stack);
        displayErr();
    }
}
