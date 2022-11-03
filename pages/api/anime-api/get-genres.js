import { Genres } from "../../../data/AnimeThings";

import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";

export default async (req, res) => {
  let list = [];
  let genresArray = [];
  let value = [];
  try {
    const genres = await axios.get(`${BASE_URL}`);
    const $ = cheerio.load(genres.data);

    $(
      "div.main_body > div.main_body_black > div.recent > nav.menu_series > ul > li"
    ).each((i, elem) => {
      list.push({
        genres: $(elem).find("a").text(),
        value: $(elem).find("a").attr("href").split("/")[2],
      });
      genresArray.push({
        genre: $(elem).find("a").text(),
        value: $(elem).find("a").attr("href").split("/")[2],
      });
    });
    return res.status(200).json({
      genres: genresArray,
    });
  } catch (e) {
    return res.status(404).json({
      error: e.message,
    });
  }
};
