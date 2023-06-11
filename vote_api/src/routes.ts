import { Express, Request, Response } from "express";
import { Vote } from "./types/vote";
import express from "express";
import cookieParser from "cookie-parser";
import { saveVote, getVotesByPostID } from "./votesDB";
import log from "./utils/logger";
import * as votesCache from "./votesCache";

const verifyUser = require("./utils/verifyUser");
import verifyVote from "./utils/verifyVote";

function routes(app: Express) {
    app.use(express.json());

    app.get("/api/v1/redis", (req, res) => {
        const vote: Vote = {
            post_id: 1,
            username: "test",
            vote: 4,
        };

        votesCache.saveVote(vote.post_id.toString(), vote.vote);

        votesCache.getVotesByPostID(vote.post_id.toString()).then((result) => {
            res.status(200).send(result);
        });
    });

    app.route("/api/v1/votes");

    app.get("/api/v1/votes/:id", async (req: Request, res: Response) => {
        const id = req.params.id;

        const cachedTotal = await votesCache.getVotesByPostID(id)

        if (cachedTotal) {
            console.log("cachehit")
            res.status(200).send(cachedTotal);
            return
        }

        getVotesByPostID(id)
            .catch((err) => {
                console.log(err);
                res.status(500).send("Internal Server Error");
            })
            .then((result: any) => {
                res.status(200).send(result);
                const total = result[0]["total"];
                if (total === undefined || total === null) {
                    return;
                }
                votesCache.saveVote(id, total)
            });

        // if (!cachedTotal && res.locals.total !== undefined) {
        //     console.log("cache miss")
        //     console.log(res.locals.total, "res.locals.total")
        //     const total = Number(res.locals.total)
        //     console.log(total)
        //     votesCache.saveVote(id, total)
        // }
    });

    app.use(cookieParser());
    app.use(verifyUser);
    app.use(verifyVote);

    app.post("/api/v1/votes", async (req, res) => {
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
            //
        const totalVotes: any = await getVotesByPostID(vote.post_id.toString())
        
        votesCache.saveVote(vote.post_id.toString(), totalVotes[0]["total"])
        });
        

}

export default routes;
