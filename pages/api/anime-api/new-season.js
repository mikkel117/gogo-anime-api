import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
const new_season_path = "/new-season.html";

export default async (req, res) => {
  let list = [];
  try {
    const popularPage = await axios.get(`
           ${BASE_URL + new_season_path}?page=${req.query.page}
           `);
    const $ = cheerio.load(popularPage.data);
    const tempEpisodesList = [];
    const tempPagesList = [];
    $("div.last_episodes > ul > li").each((i, el) => {
      tempEpisodesList.push({
        animeId: $(el).find("p.name > a").attr("href").split("/")[2],
        animeTitle: $(el).find("p.name > a").attr("title"),
        animeImg: $(el).find("div > a > img").attr("src"),
        releasedDate: $(el)
          .find("p.released")
          .text()
          .replace("Released: ", "")
          .trim(),
        animeUrl: BASE_URL + "/" + $(el).find("p.name > a").attr("href"),
      });
    });
    $("div.pagination > ul > li").each((i, el) => {
      tempPagesList.push({
        page: $(el).find("a").text(),
      });
    });
    list = [
      {
        episodes: tempEpisodesList,
        pages: tempPagesList,
      },
    ];
    return res.status(200).json({
      list,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
