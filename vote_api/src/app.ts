import express from "express";
import { initDB, closeDB } from "./votesDB";
import log from "./utils/logger";
import routes from "./routes";

const app = express();
const port = 8083;

app.listen(port, async () => {
    log.info(`Server running on port ${port}`);
    initDB();
    routes(app);
});

process.on("SIGINT", () => {
    closeDB();
    console.log("Closed DB connection");
    console.log("Gracefully Exiting...");
    process.exit();
});
