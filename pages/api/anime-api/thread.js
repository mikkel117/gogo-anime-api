import axios from "axios";
import cheerio from "cheerio";
const disqus_iframe = (episodeId) =>
  `https://disqus.com/embed/comments/?base=default&f=gogoanimetv&t_u=https%3A%2F%2Fgogoanime.vc%2F${episodeId}&s_o=default#version=cfefa856cbcd7efb87102e7242c9a829`;
const disqus_api = (threadId, page) =>
  `https://disqus.com/api/3.0/threads/listPostsThreaded?limit=100&thread=${threadId}&forum=gogoanimetv&order=popular&cursor=${page}:0:0&api_key=E8Uh5l5fHZ6gD8U3KycjAIAk46f68Zw7C6eW8WSjZvCLXebZ7p0r1yrYDrLilk2F`;

export default async (req, res) => {
  try {
    let threadId = null;

    const thread_page = await axios.get(
      disqus_iframe(decodeURIComponent(req.query.episodeId))
    );
    const $ = cheerio.load(thread_page.data, { xmlMode: true });

    const thread = JSON.parse($("#disqus-threadData")[0].children[0].data);

    if (thread.code === 0 && thread.cursor.total > 0) {
      threadId = thread.response.thread.id;
    }

    const thread_api_res = (
      await axios.get(disqus_api(threadId, req.query.page))
    ).data;

    return res.status(200).json({
      threadId: threadId,
      currentPage: req.query.page,
      hasNextPage: thread_api_res.cursor.hasNext,
      comments: thread_api_res.response,
    });
  } catch (err) {
    /* if (err.response.status === 400) {
      return res.status(400).JSON({
        error: "Invalid page. Try again.",
      });
    }
    return res.status(500).json({
      error: err.message,
    }); */
    return res.status(404).json({
      error: err.message,
    });
  }
};
