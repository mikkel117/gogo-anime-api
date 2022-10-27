const cheerio = require("cheerio");
import axios from "axios";

export default async (req, res) => {
  try {
    const { data } = await axios.get("https://xkcd.com/");
    const $ = cheerio.load(data);
    const title = $("#ctitle").text();
    const lastScraped = new Date().toISOString();
    return res.json({
      title: title,
      lastScraped: lastScraped,
    });
  } catch (e) {
    res.statusCode = 404;
    return res.json({
      error: "error",
    });
  }
  revalidate: 10;
};
