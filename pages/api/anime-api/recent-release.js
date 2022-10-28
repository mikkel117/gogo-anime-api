import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
const ajax_url = "https://ajax.gogo-load.com/";
const recent_release_url = `${ajax_url}ajax/page-recent-release.html`;

export default async (req, res) => {
  let list = [];
  try {
    const mainPage = await axios.get(`
        ${recent_release_url}?page=${req.query.page}&type=${req.query.type}
        `);
    const $ = cheerio.load(mainPage.data);
    const tempEpisodesList = [];
    const tempPagesList = [];
    $("div.last_episodes.loaddub > ul > li").each((i, el) => {
      tempEpisodesList.push({
        animeId: $(el)
          .find("p.name > a")
          .attr("href")
          .split("/")[1]
          .split("-episode-")[0],
        episodeId: $(el).find("p.name > a").attr("href").split("/")[1],
        animeTitle: $(el).find("p.name > a").attr("title"),
        episodeNum: $(el)
          .find("p.episode")
          .text()
          .replace("Episode ", "")
          .trim(),
        subOrDub: $(el)
          .find("div > a > div")
          .attr("class")
          .replace("type ic-", ""),
        animeImg: $(el).find("div > a > img").attr("src"),
        episodeUrl: BASE_URL + "/" + $(el).find("p.name > a").attr("href"),
      });
    });
    $("div.pagination > ul > li").each((i, el) => {
      tempPagesList.push({
        page: $(el).find("a").text(),
      });
    });
    list.push({
      episodes: tempEpisodesList,
      pages: tempPagesList,
    });
    return res.status(200).json({
      list,
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message,
    });
  }
};
