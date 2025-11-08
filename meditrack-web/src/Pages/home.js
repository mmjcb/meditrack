import React from "react";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.mainText}>
          Find the medicines you need, <br></br> when you need them.
        </h1>
        <p style={styles.subText}>
          Search, locate, and connect with pharmacies near you.
        </p>
        <button style={styles.ctaButton}>Start Searching</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundImage:
      "url('https://t4.ftcdn.net/jpg/03/08/02/89/360_F_308028924_YwjqVGzauey7GfmckScMtIkSPJAVNkll.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "92vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
    overflow: "hidden",
    position: "relative",
  },
  overlay: {
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    color: "#00B4D8",
    maxWidth: "800px",
  },
  mainText: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#202020",
  },
  subText: {
    fontSize: "1.5rem",
    marginBottom: "30px",
    color: "#202020",
  },
  ctaButton: {
    backgroundColor: "#00B4D8",
    color: "#202020",
    padding: "15px 30px",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
};

