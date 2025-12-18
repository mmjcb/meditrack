import React from "react";
import MediTrackLogo from "../assets/meditrack-logo.png";
import MockupImage from "../assets/about-img1.png";
import SearchImage from "../assets/about-2.png";
import LocateImage from "../assets/about-3.png";
import ConnectImage from "../assets/about-4.png";

const steps = [
  {
    number: 1,
    title: "Search",
    description: "Enter the name of a medicine you need.",
    image: SearchImage,
  },
  {
    number: 2,
    title: "Locate",
    description: "See pharmacies nearby that have it in stock.",
    image: LocateImage,
  },
  {
    number: 3,
    title: "Connect",
    description: "Contact or visit the pharmacy directly.",
    image: ConnectImage,
  },
];

export default function About() {
  return (
    <div style={styles.pageWrapper}>
      {/* Ensure Poppins is loaded and applied globally for this component */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          .about-page-container * {
            font-family: 'Poppins', sans-serif !important;
          }
        `}
      </style>

      <div className="about-page-container">
        {/* Header Section */}
        <section style={styles.headerSection}>
          <div style={styles.headerTextWrapper}>
            <h2 style={styles.headerTitle}>
              Get to know <img src={MediTrackLogo} alt="MediTrack+ Logo" style={styles.logo} /> MediTrack+
            </h2>
            <p style={styles.headerDescription}>
              <strong style={styles.highlight}>MediTrack+</strong> is a web-based application that helps users locate essential medicines quickly and easily. MediTrack+ bridges the gap between patients and pharmacies through a real-time, location-based medicine search system.
            </p>
            <button style={styles.knowMoreBtn}>Know More</button>
          </div>
          <div style={styles.headerImageWrapper}>
            <img src={MockupImage} alt="MediTrack+ App Mockup" style={styles.headerImage} />
          </div>
        </section>

        <hr style={styles.divider} />

        {/* How It Works Section */}
        <section style={styles.howItWorksSection}>
          <h2 style={styles.sectionTitle}>How it Works</h2>
          <div style={styles.stepsWrapper}>
            {steps.map((step, index) => (
              <div key={step.number} style={styles.stepCard}>
                <img src={step.image} alt={step.title} style={styles.stepImage} />
                <div style={styles.stepNumber}>{step.number}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDescription}>{step.description}</p>
                {index < steps.length - 1 && <div style={styles.horizontalLine} />}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const PRIMARY_COLOR = "#29ABE2"; // Matches your Cart theme
const TEXT_COLOR = "#333";
const FONT_FAMILY = "'Poppins', sans-serif";

const styles = {
  pageWrapper: {
    fontFamily: FONT_FAMILY,
    color: TEXT_COLOR,
    padding: "120px 20px 40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  headerSection: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "40px",
    marginBottom: "60px",
  },
  headerTextWrapper: { flex: "1 1 400px" },
  headerTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  logo: { width: "40px" },
  highlight: { color: PRIMARY_COLOR },
  headerDescription: { 
    fontSize: "1.1rem", 
    lineHeight: "1.6", 
    marginBottom: "20px",
    fontWeight: "400" 
  },
  knowMoreBtn: {
    border: `2px solid ${PRIMARY_COLOR}`,
    background: "transparent",
    color: PRIMARY_COLOR,
    padding: "12px 30px",
    borderRadius: "50px", // Rounded to match your Cart theme
    cursor: "pointer",
    fontWeight: "600",
    fontFamily: FONT_FAMILY,
    transition: "0.3s",
  },
  headerImageWrapper: { flex: "1 1 400px", display: "flex", justifyContent: "center" },
  headerImage: { maxWidth: "100%", height: "auto" },
  divider: { border: "none", height: "1px", backgroundColor: "#eee", margin: "40px 0" },
  howItWorksSection: { textAlign: "center", marginBottom: "60px" },
  sectionTitle: { 
    fontSize: "2.2rem", 
    fontWeight: "700", 
    marginBottom: "50px" 
  },

  stepsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    gap: "80px",
    maxWidth: "1000px",
    margin: "0 auto",
    position: "relative",
  },

  stepImage: { 
    width: "250px",
    height: "250px",
    objectFit: "contain",
    marginBottom: "20px"
  },

  stepCard: {
    flex: "1 1 0",
    textAlign: "center",
    position: "relative",
    padding: "20px 15px 50px 15px",
    maxWidth: "300px",
  },

  horizontalLine: {
    display: "none",
  },

  stepNumber: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "700",
    fontSize: "1.2rem",
    margin: "0 auto 15px auto",
    position: "relative",
    zIndex: 1,
  },

  stepTitle: { 
    fontSize: "1.3rem", 
    fontWeight: "600", 
    marginBottom: "10px",
    color: "#111" 
  },
  stepDescription: { 
    fontSize: "0.95rem", 
    color: "#666", 
    lineHeight: "1.5",
    fontWeight: "400" 
  },
};