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
        <button
          onClick={() => {
            fetchData();
          }}>
          click me
        </button>
      </div>
    </>
  );
}
