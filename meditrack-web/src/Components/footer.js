import React from "react";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* First column */}
        <div style={styles.section}>
          <h4 style={styles.title}>About Meditrack+</h4>
          <p style={styles.text}>
            Meditrack+ helps you search for medicines easily and get real-time
            availability near your location.
          </p>
        </div>

        {/* Second column */}
        <div style={styles.section}>
          <h4 style={styles.title}>Quick Links</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>Home</li>
            <li style={styles.listItem}>Search</li>
            <li style={styles.listItem}>About</li>
            <li style={styles.listItem}>FAQ</li>
          </ul>
        </div>

        {/* Third column */}
        <div style={styles.section}>
          <h4 style={styles.title}>Contact</h4>
          <p style={styles.text}>Email: support@meditrackplus.com</p>
          <p style={styles.text}>Phone: +1 234 567 890</p>
        </div>
      </div>

      <div style={styles.bottom}>
        &copy; {new Date().getFullYear()} Meditrack+. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#00B4D8", // Meditrack+ blue
    color: "#fff", // text changed to white
    padding: "40px 20px 20px 20px",
    fontFamily: "Arial, sans-serif",
    marginTop: "40px",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1000px",
    margin: "0 auto",
    gap: "20px",
  },
  section: {
    flex: "1 1 250px",
    minWidth: "200px",
  },
  title: {
    fontSize: "1.1rem",
    marginBottom: "10px",
    fontWeight: "bold",
    borderBottom: "2px solid #fff", // border also white
    display: "inline-block",
    paddingBottom: "3px",
    color: "#fff", // title white
  },
  text: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "#fff", // text white
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: "8px",
    cursor: "pointer",
    transition: "0.2s",
    color: "#fff", // list item white
  },
  bottom: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "0.85rem",
    color: "#fff", // bottom text white
  },
};
