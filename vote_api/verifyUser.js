const jose = require('jose');
const jwt = require('jsonwebtoken');

const alg = 'HS256';
const secret = new TextEncoder().encode(process.env.JWT_SECRET);


const verifyUser = async (req, res, next) => {
    const token = req.cookies['jwtCookie'];
    if (!token) {
        return res.status(401).send("No token provided");
    }
    try {
        const { payload } = await jose.jwtVerify(token, secret, alg);

        if (payload.exp < Date.now() / 1000) {
            return res.status(401).send("Token expired");
        }

        // Add the user to the response locals
        res.locals.user = payload.sub;

        next();
    } catch (err) {
        return res.status(401).send("Invalid token");
    }


}

module.exports = verifyUser;