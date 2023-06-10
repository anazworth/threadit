import { NextFunction, Request, Response } from "express";
import log from "./logger";
import jwt, { Secret } from "jsonwebtoken";

const alg = "HS256";
// const secret = new TextEncoder().encode(process.env.JWT_SECRET);
const secret: Secret = process.env.JWT_SECRET as Secret;

export default async function verifyUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.cookies["jwtCookie"];
    if (!token) {
        return res.status(401).send("No token provided");
    }

    try {
        const payload = jwt.verify(token, secret, { algorithms: [alg] });
        res.locals.user = payload.sub;
        next();
    } catch (err) {
        log.error(err);
        return res.status(401).send("Invalid token");
    }
}

module.exports = verifyUser;
