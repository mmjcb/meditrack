import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const FONT_FAMILY = "Poppins, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export default function Footer() {
  return (
    <footer style={{ ...styles.footer, fontFamily: FONT_FAMILY }}>
      <div style={styles.container}>
        {/* About Section */}
        <div style={styles.section}>
          <h4 style={styles.title}>About Meditrack+</h4>
          <p style={styles.text}>
            Meditrack+ helps you search for medicines easily and get real-time
            availability near your location.
          </p>
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h4 style={styles.title}>Quick Links</h4>
          <ul style={styles.list}>
            <li style={styles.listItem}>Home</li>
            <li style={styles.listItem}>Search</li>
            <li style={styles.listItem}>About</li>
            <li style={styles.listItem}>FAQ</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div style={styles.section}>
          <h4 style={styles.title}>Contact</h4>
          <p style={styles.text}>Email: support@meditrackplus.com</p>
          <p style={styles.text}>Phone: +1 234 567 890</p>
          <div style={styles.socialIcons}>
            <FaFacebookF style={styles.icon} />
            <FaTwitter style={styles.icon} />
            <FaInstagram style={styles.icon} />
            <FaLinkedinIn style={styles.icon} />
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div style={styles.bottom}>
        &copy; {new Date().getFullYear()} Meditrack+. All rights reserved.
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#00B4D8",
    color: "#fff",
    padding: "50px 20px 20px 20px",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: "1100px",
    margin: "0 auto",
    gap: "30px",
  },
  section: {
    flex: "1 1 250px",
    minWidth: "220px",
  },
  title: {
    fontSize: "1.2rem",
    marginBottom: "15px",
    fontWeight: "700",
    borderBottom: "3px solid #ffffffff",
    display: "inline-block",
    paddingBottom: "5px",
    color: "#fff",
  },
  text: {
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#f0f0f0",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "#f0f0f0",
  },
  socialIcons: {
    marginTop: "15px",
    display: "flex",
    gap: "15px",
  },
  icon: {
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "0.3s",
    color: "#fff",
  },
  bottom: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "0.9rem",
    color: "#ffffffff",
    borderTop: "1px solid #ffffffff",
    paddingTop: "20px",
  },
};
