import { Genres } from "../../../data/AnimeThings";

export default async (req, res) => {
  try {
    return res.status(200).json({
      Genres,
    });
  } catch (e) {
    return res.json({
      error: "Error",
    });
  }
};
