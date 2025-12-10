import React from "react";
import SearchBar from "../Components/searchbar.js";

export default function Search() {
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <SearchBar />
      </div>
    </main>
  );
}

const styles = {
  main: {
    paddingTop: "130px", // slightly more margin from navbar
    minHeight: "100vh",
    backgroundColor: "#fff", // unified background with other pages
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "1000px",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};
