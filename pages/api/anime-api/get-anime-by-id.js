import axios from "axios";
import cheerio from "cheerio";

export default async (req, res) => {
  try {
    const animePage = await axios.get(
      `https://gogoanime.gg/category/${req.query.id}`
    );

    const $ = cheerio.load(animePage.data);

    const animeTitle = $("div.anime_info_body_bg > h1").text();
    const animeImg = $("div.anime_info_body_bg > img").attr("src");
    const animeId = req.query.id;

    return res.status(200).json({
      animeId: animeId.toString(),
      animeTitle: animeTitle.toString(),
      animeImg: animeImg.toString(),
    });
  } catch (err) {
    return res.status(404).json({
      error: err.message,
    });
  }
};
