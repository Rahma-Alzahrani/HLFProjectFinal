import * as redis from "redis";

const redisClient = redis.createClient(
    parseInt(process.env.REDIS_PORT || "6379"), // Assuming the port is a number
    process.env.REDIS_HOST
);

redisClient.on("connect", function() {
    console.log("Redis client connected");
});

redisClient.on("error", function (err) {
    console.log("Something went wrong " + err);
});

export default redisClient;
