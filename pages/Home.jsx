/* import styles from '../styles/Home.module.css' */
import cheerio from "cheerio";
import axios from "axios";

export default function Home(props) {
  return (
    <div>
      <main className={styles.main}>
        <div>Latest Comic: {props.title}</div>
        <div>Last scraped: {props.lastScraped}</div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const { data } = await axios.get("https://xkcd.com/");
  const $ = cheerio.load(data);
  const title = $("#ctitle").text();
  const lastScraped = new Date().toISOString();
  return {
    props: { title, lastScraped },
    revalidate: 10, // rerun after 10 seconds
  };
}
