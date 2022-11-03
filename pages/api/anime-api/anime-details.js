import axios from "axios";
import cheerio from "cheerio";

const BASE_URL = "https://gogoanime.film/";
const ajax_url = "https://ajax.gogo-load.com/";
const list_episodes_url = `${ajax_url}ajax/load-list-episode`;

export default async (req, res) => {
  try {
    let genres = [];
    let epList = [];
    let otherName = [];

    const animePageTest = await axios.get(
      `https://gogoanime.gg/category/${req.query.id}`
    );

    const $ = cheerio.load(animePageTest.data);

    const animeTitle = $("div.anime_info_body_bg > h1").text();
    const animeImage = $("div.anime_info_body_bg > img").attr("src");
    const type = $("div.anime_info_body_bg > p:nth-child(4) > a").text();
    const desc = $("div.anime_info_body_bg > p:nth-child(5)")
      .text()
      .replace("Plot Summary: ", "");
    const releasedDate = $("div.anime_info_body_bg > p:nth-child(7)")
      .text()
      .replace("Released: ", "");
    const status = $("div.anime_info_body_bg > p:nth-child(8) > a").text();
    const splitOtherNames = $("div.anime_info_body_bg > p:nth-child(9)")
      .text()
      .replace("Other name: ", "")
      .replace(/;/g, ",")
      .split(",");

    splitOtherNames.forEach((element) => {
      otherName.push(element.trim());
    });

    $("div.anime_info_body_bg > p:nth-child(6) > a").each((i, elem) => {
      genres.push($(elem).attr("title").trim());
    });

    const ep_start = $("#episode_page > li").first().find("a").attr("ep_start");
    const ep_end = $("#episode_page > li").last().find("a").attr("ep_end");
    const movie_id = $("#movie_id").attr("value");
    const alias = $("#alias_anime").attr("value");

    const html = await axios.get(
      `${list_episodes_url}?ep_start=${ep_start}&ep_end=${ep_end}&id=${movie_id}&default_ep=${0}&alias=${alias}`
    );
    const $$ = cheerio.load(html.data);

    $$("#episode_related > li").each((i, el) => {
      epList.push({
        episodeId: $(el).find("a").attr("href").split("/")[1],
        episodeNum: $(el).find(`div.name`).text().replace("EP ", ""),
        episodeUrl: BASE_URL + $(el).find(`a`).attr("href").trim(),
      });
    });

    return res.status(200).json({
      animeTitle: animeTitle.toString(),
      type: type.toString(),
      releasedDate: releasedDate.toString(),
      status: status.toString(),
      genres: genres,
      otherNames: otherName,
      synopsis: desc.toString(),
      animeImg: animeImage.toString(),
      totalEpisodes: ep_end,
      episodesList: epList,
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
    });
  }
};
