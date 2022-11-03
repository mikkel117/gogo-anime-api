import { Genres } from "../../../data/AnimeThings";

import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
let list = [];
let statusCode;

export default async (req, res) => {
  try {
    const genres = await axios.get(`${BASE_URL}`);
    const $ = cheerio.load(genres.data);

    $("div.recent > nav > ul > li").each((i, elem) => {
      list.push({
        genres: $(elem).find("a").text(),
        value: $(elem).find("a").attr("href").split("/")[2],
      });
    });
    statusCode = 200;
    return res.status(200).json({
      list,
    });
  } catch (e) {
    return res.status(404).json({
      error: e.message,
    });
  }
};
