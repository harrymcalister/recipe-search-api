const axios = require("axios");
const rateLimit = require("express-rate-limit");

const BASE_URL = "https://tasty.p.rapidapi.com";
const ENDPOINT = "/recipes/list";

const headers = {
  "X-RapidAPI-Host": "tasty.p.rapidapi.com",
  "X-RapidAPI-Key": "2d0947bf42mshc1fea3913492b83p17ab14jsn79c9a43ee84e"
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

module.exports = async (req, res) => {
  const queryParams = req.query;

  const url = new URL(BASE_URL + ENDPOINT);
  const fromParam = queryParams.from ? queryParams.from : "0";
  const sizeParam = queryParams.size ? queryParams.size : "10";

  url.searchParams.append("from", fromParam);
  url.searchParams.append("size", sizeParam);
  url.searchParams.append("q", queryParams.search);

  try {
    const axiosResponse = await axios.get(url.toString(), { headers });
    res.status(200).send(axiosResponse.data);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send({ error: "An error occurred." });
  }
};

module.exports = limiter(module.exports);