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

export default function Contact() {
  return (
    <div style={styles.pageWrapper}>
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
              {index < steps.length - 1 && <div style={styles.verticalLine} />}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const PRIMARY_COLOR = "#007bff";
const TEXT_COLOR = "#333";

const styles = {
  pageWrapper: {
    fontFamily: "Arial, sans-serif",
    color: TEXT_COLOR,
    padding: "150px 20px 40px 20px",
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
  headerTextWrapper: {
    flex: "1 1 400px",
  },
  headerTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  logo: {
    width: "40px",
  },
  highlight: {
    color: PRIMARY_COLOR,
  },
  headerDescription: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  knowMoreBtn: {
    border: `1px solid ${PRIMARY_COLOR}`,
    background: "transparent",
    color: PRIMARY_COLOR,
    padding: "10px 25px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  headerImageWrapper: {
    flex: "1 1 400px",
    display: "flex",
    justifyContent: "center",
  },
  headerImage: {
    maxWidth: "100%",
    height: "auto",
  },
  divider: {
    border: "none",
    height: "1px",
    backgroundColor: "#ccc",
    margin: "40px 0",
  },
  howItWorksSection: {
    textAlign: "center",
    marginBottom: "60px",
  },
  sectionTitle: {
    fontSize: "2rem",
    marginBottom: "50px",
  },
  stepsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  stepCard: {
    flex: "1 1 250px",
    textAlign: "center",
    position: "relative",
    padding: "20px",
  },
  stepImage: {
    width: "100%",
    height: "auto",
    marginBottom: "20px",
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
    fontWeight: "bold",
    fontSize: "1.5rem",
    margin: "0 auto 10px auto",
  },
  stepTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  stepDescription: {
    color: "#666",
  },
  verticalLine: {
    position: "absolute",
    bottom: "-40px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "3px",
    height: "40px",
    backgroundColor: PRIMARY_COLOR,
  },
  contactInfoSection: {
    textAlign: "center",
  },
  contactInfoWrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "40px",
    fontSize: "1.1rem",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  icon: {
    color: PRIMARY_COLOR,
  },
};
