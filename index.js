const { sampleSearch } = require("./controllers/index.js");
const express = require("express");

const redis = require("redis");
const redisClient = redis.createClient(6379);

const app = express();

// Sample Search Api
app.get("/:searchKey", async (req, res) => {
  try {
    const searchQuery = req.params.searchKey;
    if (!searchQuery) {
      return res.status(500)?.json({ error: "please provide search query" });
    }

    let results = null;

    const key = "search:" + searchQuery.toLowerCase();
    const value = await redisClient.get(key);
    // if data is there in redis, it is taken from redis or else the the search api is called and set datas to redis
    if (value) {
      results = JSON.parse(value);
      console.log("Cache hit for", key);
    } else {
      console.log("Cache miss for", key);
      results = await sampleSearch(searchQuery);
      // Setting datas to redis
      redisClient.setEx(key, 300, JSON.stringify(results));
    }

    res.status(200).json({ data: results });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

// Redis connection
(async () => {
  redisClient.on("error", (err) => {
    console.log("Redis Client Error", err);
  });
  redisClient.on("ready", () => console.log("Redis is ready"));

  await redisClient.connect();

  await redisClient.ping();
})();

app.listen(3500, () => {
  console.log("server running on port 3500");
});
