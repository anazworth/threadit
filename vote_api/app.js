const express = require("express");
const cookieParser = require("cookie-parser");
const verifyUser = require("./verifyUser");
const { initDB, saveVote, getVotesByPostID, closeDB } = require("./votesDB");

const app = express();
const port = 8083

initDB();

app.use(express.json());

app.route("/api/v1/votes")

app.get("/api/v1/votes/:id", (req, res) => {
    id = req.params.id;

    // Check the cache for the post_id and return it

    const votes = getVotesByPostID(id).catch(err => {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }).then(result => {
        res.status(200).send(result);
    });

    // Add the post_id to the cache if it doesn't exist
}
);

app.use(cookieParser());
app.use(verifyUser);

app.post("/api/v1/votes", (req, res) => {
    const vote = {
        "post_id": req.body.post_id,
        "vote": req.body.vote,
        "username": res.locals.user
    };

    if (vote.vote !== 1 && vote.vote !== -1) {
        res.status(400).send("Bad Request");
        return;
    }

    saveVote(vote).catch(err => {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }).then(result => {
        res.status(201).send(vote);
    });

    // Check the cache for the post_id and update it
}
);

app.listen(port, () => {
    console.log("Server running on port ", port);
});

process.on("SIGINT", () => {
    closeDB();
    console.log("Closed DB connection");
    console.log("Gracefully Exiting...");
    process.exit();
});