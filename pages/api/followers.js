const cheerio = require("cheerio");
const Cors = require("cors");

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST"],
});
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  if (req.method === "POST") {
    const username = req.body.TWuser;

    try {
      const response = await fetch(`https://mobile.twitter.com/${username}`);
      const htmlString = await response.text();
      const $ = cheerio.load(htmlString);
      const searchContext = `a[href='/${username}/followers']`;
      const followerCountString = $(searchContext)
        .text()
        .match(/[0-9]/gi)
        .join("");

      res.statusCode = 200;
      return res.json({
        user: username,
        followerCount: Number(followerCountString),
      });
    } catch (e) {
      res.statusCode = 404;
      return res.json({
        user: username,
        error: `${username} not found. Tip: Double check the spelling.`,
        followerCount: -1,
      });
    }
  }
};
