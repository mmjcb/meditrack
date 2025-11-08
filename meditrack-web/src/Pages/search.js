import React from "react";
import SearchBar from "../Components/searchbar";

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
    paddingTop: "120px",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
