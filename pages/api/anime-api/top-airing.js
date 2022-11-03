import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
const ajax_url = "https://ajax.gogo-load.com/";
const popular_ongoing_url = `${ajax_url}ajax/page-recent-release-ongoing.html`;

export default async (req, res) => {
  let list = [];
  try {
    const tempEpisodesList = [];
    const tempPagesList = [];

    const popular_page = await axios.get(`
           ${popular_ongoing_url}?page=${req.query.page}
           `);
    const $ = cheerio.load(popular_page.data);

    $("div.added_series_body.popular > ul > li").each((i, el) => {
      let genres = [];
      $(el)
        .find("p.genres > a")
        .each((i, el) => {
          genres.push($(el).attr("title"));
        });
      tempEpisodesList.push({
        animeId: $(el).find("a:nth-child(1)").attr("href").split("/")[2],
        animeTitle: $(el).find("a:nth-child(1)").attr("title"),
        animeImg: $(el)
          .find("a:nth-child(1) > div")
          .attr("style")
          .match("(https?://.*.(?:png|jpg))")[0],
        latestEp: $(el).find("p:nth-child(4) > a").text().trim(),
        animeUrl: BASE_URL + "/" + $(el).find("a:nth-child(1)").attr("href"),
        genres: genres,
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
    return res.status(404).json({
      error: err.message,
    });
  }
};
