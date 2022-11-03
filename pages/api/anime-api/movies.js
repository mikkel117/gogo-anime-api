import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
const anime_movies_path = "/anime-movies.html";

export default async (req, res) => {
  let list = [];
  let aphList = [];
  const tempEpisodesList = [];
  const tempPagesList = [];
  try {
    let movie;
    if (req.query.aph != null) {
      movie = await axios.get(`
      ${BASE_URL + anime_movies_path}?aph=${req.query.aph
        .trim()
        .toUpperCase()}&page=${req.query.page}
      `);
    } else {
      movie = await axios.get(`
      ${BASE_URL + anime_movies_path}&page=${req.query.page}
      `);
    }

    const $ = cheerio.load(movie.data);

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
    $("div.list_search > ul > li").each((i, el) => {
      aphList.push({
        aph: $(el).find("a").text(),
        value: $(el)
          .find("a")
          .attr("href")
          .replace("/anime-movies.html?aph=", "")
          .replace("/anime-movies.html", "")
          .trim(),
      });
    });
    list = [
      {
        episodes: tempEpisodesList,
        pages: tempPagesList,
        aphList: aphList,
      },
    ];
    return res.status(200).json({
      episodes: tempEpisodesList,
      pages: tempPagesList,
      aphList: aphList,
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
    });
  }
};
