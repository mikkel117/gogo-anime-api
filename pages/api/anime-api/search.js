import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
const search_path = "/search.html";

export default async (req, res) => {
  let list = [];
  try {
    const searchPage = await axios.get(
      `${BASE_URL + search_path}?keyword=${req.query.keyw}&page=${
        req.query.page
      }`
    );
    const $ = cheerio.load(searchPage.data);
    $("div.last_episodes > ul > li").each((i, el) => {
      list.push({
        animeId: $(el).find("p.name > a").attr("href").split("/")[2],
        animeTitle: $(el).find("p.name > a").attr("title"),
        animeUrl: BASE_URL + "/" + $(el).find("p.name > a").attr("href"),
        animeImg: $(el).find("div > a > img").attr("src"),
        status: $(el).find("p.released").text().trim(),
      });
    });
    return res.status(200).json({
      list,
      page: req.query.page,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
