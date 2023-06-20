import { createClient } from "redis";
import { Vote } from "./types/vote";
import log from "./utils/logger";

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const redisUsername = process.env.REDIS_USERNAME;
const redisPassword = process.env.REDIS_PASSWORD;

const redis = createClient({
    url:
        "redis://" +
        redisUsername +
        ":" +
        redisPassword +
        "@" +
        redisHost +
        ":" +
        redisPort,
});

export async function initCache() {
    await redis.connect();
}

// const redis = new Redis({
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     username: process.env.REDIS_USERNAME,
//     password: process.env.REDIS_PASSWORD,
// });

export async function saveVote(post_id: string, total: number) {
    await redis.set(post_id, total);
    console.log("cached vote", post_id, total);
}

export async function getVotesByPostID(post_id: string) {
    const cachedTotal = await redis.get(post_id);
    console.log("cached total from getVotesByPost", cachedTotal);
    return cachedTotal;
}
