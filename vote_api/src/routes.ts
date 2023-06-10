import { Express, Request, Response } from "express";
import { Vote } from "./types/vote";
import express from "express";
import cookieParser from "cookie-parser";
import { saveVote, getVotesByPostID } from "./votesDB";
import log from "./utils/logger";

const verifyUser = require("./utils/verifyUser");
import verifyVote from "./utils/verifyVote";

function routes(app: Express) {
    app.use(express.json());

    app.route("/api/v1/votes");

    app.get("/api/v1/votes/:id", (req: Request, res: Response) => {
        const id = req.params.id;

        // Check the cache for the post_id and return it

        const votes = getVotesByPostID(id)
            .catch((err) => {
                console.log(err);
                res.status(500).send("Internal Server Error");
            })
            .then((result) => {
                res.status(200).send(result);
            });

        // Add the post_id to the cache if it doesn't exist
    });

    app.use(cookieParser());
    app.use(verifyUser);
    app.use(verifyVote);

    app.post("/api/v1/votes", (req, res) => {
        const vote: Vote = res.locals.vote;

        saveVote(vote)
            .catch((err) => {
                log.error(err);
                res.status(500).send("Internal Server Error");
            })
            .then((result) => {
                res.status(201).send(vote);
            });

        // Check the cache for the post_id and update it
    });
}

export default routes;
