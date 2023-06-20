import log from "./utils/logger";
import mysql from "mysql2";
import { Vote } from "./types/vote";
// const mysql = require('mysql2');

const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

export function initDB() {
    try {
        connection.query(
            "CREATE TABLE IF NOT EXISTS votes (id INT AUTO_INCREMENT PRIMARY KEY, post_id INT, username VARCHAR(255), vote INT)"
        );
        log.info("Database initialized");
    } catch (err) {
        log.error("Database failed to initialize");
        log.error(err);
        process.exit(1);
    }
}

export function saveVote(vote: Vote) {
    return new Promise((resolve, reject) => {
        // Check if the user has already voted on this post
        // If they have, update the vote
        // If they haven't, insert a new vote
        // This whole language is promises and brackets

        connection.query(
            "SELECT * FROM votes WHERE post_id = ? AND username = ?",
            [vote.post_id, vote.username],
            (err, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.length > 0) {
                        if (result[0].vote === vote.vote) {
                            // If the user is trying to vote the same way they did before, nullify their vote
                            vote.vote = 0;
                        }
                        connection.query(
                            "UPDATE votes SET vote = ? WHERE post_id = ? AND username = ?",
                            [vote.vote, vote.post_id, vote.username],
                            (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    } else {
                        connection.query(
                            "INSERT INTO votes (post_id, username, vote) VALUES (?, ?, ?)",
                            [vote.post_id, vote.username, vote.vote],
                            (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    }
                }
            }
        );
    });
}

export function getVotesByPostID(post_id: string): Promise<{}> {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT SUM(vote) AS total FROM votes WHERE post_id = ?",
            [post_id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as {});
                }
            }
        );
    });
}

export function closeDB() {
    connection.end();
}

exports.initDB = initDB;
exports.saveVote = saveVote;
exports.getVotesByPostID = getVotesByPostID;
exports.closeDB = closeDB;
