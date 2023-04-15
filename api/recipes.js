const axios = require("axios");
const Redis = require("ioredis");

const redis = new Redis(process.env.UPSTASH_REDIS_URL);
const BASE_URL = "https://tasty.p.rapidapi.com";
const ENDPOINT = "/recipes/list";

const headers = {
  "X-RapidAPI-Host": "tasty.p.rapidapi.com",
  "X-RapidAPI-Key": process.env.API_KEY,
};

const WINDOW_MS = 10 * 1000; // 10 seconds
const MAX_REQUESTS = 5;

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const key = `rate-limit:${ip}`;

    console.log('IP:', ip);

    const current = await redis.get(key);
    console.log('Current:', current);

    if (current === null || current < MAX_REQUESTS) {
      await redis.multi()
        .incr(key)
        .expire(key, WINDOW_MS / 1000)
        .exec();
      next();
    } else {
      res.status(429).send({ error: "Too many requests, please try again later." });
    }
  } catch (error) {
    console.log("RateLimiter error:", error);
    res.status(500).send({ error: `An error occurred in the rate limiter: ${error.message}` });
  }
};

module.exports = async (req, res) => {
  await rateLimiter(req, res, async () => {
    const queryParams = req.query;

    const url = new URL(BASE_URL + ENDPOINT);
    const fromParam = queryParams.from ? queryParams.from : "0";
    const sizeParam = queryParams.size ? queryParams.size : "10";

    url.searchParams.append("from", fromParam);
    url.searchParams.append("size", sizeParam);
    url.searchParams.append("q", queryParams.search);

    try {

      await redis.ping();
      console.log('Redis connection successful');

      const axiosResponse = await axios.get(url.toString(), { headers });
      res.status(200).send(axiosResponse.data);
    } catch (error) {
      console.log("Error:", error);
      res.status(500).send({ error: `An error occurred: ${error.message}` });
    }
  });
};