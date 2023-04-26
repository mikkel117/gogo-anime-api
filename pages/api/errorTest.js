const cheerio = require("cheerio");
import axios from "axios";

export default async (req, res) => {
  try {
    const { data } = await axios.get("https://xkcd.c");
    const $ = cheerio.load(data);
    const title = $("#ctitle").text();
    const lastScraped = new Date().toISOString();
    return res.status(200).json({
      title: title,
      lastScraped: lastScraped,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
