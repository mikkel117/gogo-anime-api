const cheerio = require("cheerio");
import axios from "axios";

export default async (req, res) => {
  return res.status(404).json({
    error: "error",
  });
};
