import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";

export default async (req, res) => {
  let list = [];
  try {
    let genre = req.query.genre.trim().replace(/ /g, "-").toLowerCase();

    if (genre.indexOf(genre) > -1) {
      const genrePage = await axios.get(
        `${BASE_URL}genre/${genre}?page=${req.query.page}`
      );
      const $ = cheerio.load(genrePage.data);
      const tempEpisodesList = [];
      const tempPagesList = [];

      $("div.last_episodes > ul > li").each((i, elem) => {
        tempEpisodesList.push({
          animeId: $(elem).find("p.name > a").attr("href").split("/")[2],
          animeTitle: $(elem).find("p.name > a").attr("title"),
          animeImg: $(elem).find("div > a > img").attr("src"),
          releasedDate: $(elem)
            .find("p.released")
            .text()
            .replace("Released: ", "")
            .trim(),
          animeUrl: BASE_URL + "/" + $(elem).find("p.name > a").attr("href"),
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
        episodes: tempEpisodesList,
        pages: tempPagesList,
      });
    }
    return res.status(404).json({
      error: "Genre Not Found",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
