import { Request, Response, NextFunction } from "express";
import { Vote } from "../types/vote";
import log from "./logger";

export default async function verifyVote(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const vote: Vote = {
        post_id: req.body.post_id,
        vote: req.body.vote,
        username: res.locals.user,
    };

    if (!vote.post_id || !vote.vote) {
        log.error("Bad Request");
        return res.status(400).send("Bad Request - missing fields");
    }

    if (vote.post_id < 0) {
        log.error("Bad Request - post_id must be positive");
        return res.status(400).send("Bad Request - post_id must be positive");
    }

    if (vote.vote !== 1 && vote.vote !== -1) {
        log.error("Bad Request - vote must be 1 or -1");
        res.status(400).send("Bad Request");
        return;
    }

    res.locals.vote = vote;

    next();
}

module.exports = verifyVote;
