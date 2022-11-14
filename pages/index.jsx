import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useEffect } from "react";

export default function Home() {
  /* useEffect(() => {
    fetch();
  }, []); */
  const fetchData = () => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <>
      <div className={styles.container}>
        <h1> welcome to my version of the gogoanime API</h1>
        <h2>the end points are</h2>
        <ul>
          <li>anime details: api/anime-api/anime-details?id="anime id"</li>
          <li>
            genres: api/anime-api/genres?genre="anime genre"&page="page number"
          </li>
          <li>get anime by id: api/anime-api/get-anime-by-id?id="anime id"</li>
          <li>get all genres: api/anime-api/get-genres</li>
          <li>movies: api/anime-api/movies</li>
          <li></li>
        </ul>
      </div>
    </>
  );
}
