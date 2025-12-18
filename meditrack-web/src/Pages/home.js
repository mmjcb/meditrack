import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "./contact.js";

const PRIMARY_COLOR = "#00B4D8"; 
const TEXT_COLOR = "#202020"; 
const LIGHT_TEXT_COLOR = "#777777"; 
const BACKGROUND_COLOR = "#f9f9f9"; 
const CARD_BG_COLOR = "#ffffff"; 

const categoryIcons = {
  "Pain Relief": "https://cdn-icons-png.flaticon.com/512/387/387630.png",
  "Cough & Cold": "https://cdn-icons-png.flaticon.com/256/2877/2877806.png",
  "Vitamins & Supplements": "https://cdn-icons-png.flaticon.com/512/3274/3274085.png",
  "Antibiotics": "https://cdn-icons-png.flaticon.com/512/11469/11469427.png",
  "Digestive Health": "https://cdn-icons-png.flaticon.com/256/10154/10154425.png",
  "Skin Care": "https://cdn-icons-png.flaticon.com/512/3789/3789972.png",
  "Diabetes": "https://cdn-icons-png.flaticon.com/512/7350/7350822.png",
  "Heart & Blood": "https://cdn-icons-png.flaticon.com/512/3595/3595788.png",
  "Allergy & Immunity": "https://cdn-icons-png.flaticon.com/512/2865/2865526.png",
  "Eye & Ear": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdJhiZeAR1ioj5jQEfe4zbutX9dEu6kteEVqMGTkDye9ih_Gz8iWas_9dthCT9nqXWOC4&usqp=CAU",
};

export default function Home() {
  const navigate = useNavigate(); 
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:5000/api/products");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const validProducts = data.filter(item => item.product_name);
        const shuffled = [...validProducts].sort(() => 0.5 - Math.random());
        const randomDeals = shuffled.slice(0, 10).map(item => ({
          ...item,
          category: item.category || "Other",
          randomPrice: (Math.random() * 100 + 20).toFixed(2),
        }));
        setBestDeals(randomDeals);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/nearby-pharmacies?lat=${latitude}&lng=${longitude}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setNearbyPharmacies(data.slice(0, 10)); 
      } catch (err) {
        console.error("Error fetching nearby pharmacies:", err);
      }
    }, err => console.error(err));
  }, []);

  const categories = Object.keys(categoryIcons);

  return (
    <div style={styles.mainWrapper}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          * { font-family: 'Poppins', sans-serif !important; }
          .scroll-container::-webkit-scrollbar { display: none; }
        `}
      </style>

      <div style={styles.heroContainer}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.mainText}>
            Find the medicines you need,<br />when you need them
          </h1>
          <p style={styles.subText}>
            Search, locate, and connect with trusted pharmacies near you instantly.
          </p>
          <button style={styles.ctaButton} onClick={() => navigate("/search")}>
            Start Searching
          </button>
        </div>
      </div>

      <Section title="Pharmacies Near You">
        <div style={styles.scrollContainer} className="scroll-container">
          {nearbyPharmacies.length === 0 ? (
            <p style={{ color: LIGHT_TEXT_COLOR }}>
              {loading ? "Locating pharmacies..." : "No nearby pharmacies found."}
            </p>
          ) : (
            nearbyPharmacies.map(p => <PharmacyCard key={p.id || p.name} pharmacy={p} />)
          )}
        </div>
      </Section>

      <Section title="Best Deals">
        <div style={styles.scrollContainer} className="scroll-container">
          {loading ? (
            <p style={{ color: LIGHT_TEXT_COLOR }}>Loading deals...</p>
          ) : (
            bestDeals.map(d => (
              <DealCard key={d.id || d.product_name} deal={d} icon={categoryIcons[d.category] || categoryIcons["Other"]} />
            ))
          )}
        </div>
      </Section>

      <Section title="Shop by Category">
        <div style={styles.scrollContainer} className="scroll-container">
          {categories.map(c => <CategoryCard key={c} title={c} image={categoryIcons[c]} />)}
        </div>
      </Section>

      <Contact />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        <button style={styles.viewAllButton}>View All</button>
      </div>
      {children}
    </div>
  );
}

function PharmacyCard({ pharmacy }) {
  return (
    <div style={styles.pharmacyCard}>
      <img
        src={pharmacy.image || "https://cdn-icons-png.flaticon.com/512/1596/1596389.png"}
        alt={pharmacy.name}
        style={styles.pharmacyImage}
      />
      <div style={styles.cardContent}>
        <p style={styles.cardTitle}>{pharmacy.name}</p>
        <p style={styles.cardSubtitle}>Open 24/7</p>
      </div>
    </div>
  );
}

function DealCard({ deal, icon }) {
  return (
    <div style={styles.dealCard}>
      <img src={icon} alt={deal.category} style={styles.dealImage} />
      <div style={styles.cardContentCenter}>
        <p style={styles.cardTitleWrap}>{deal.product_name}</p>
        <p style={styles.dealCategory}>{deal.category}</p>
        <p style={styles.dealPrice}>₱{deal.randomPrice}</p>
      </div>
    </div>
  );
}

function CategoryCard({ title, image }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        ...styles.categoryCard,
        transform: hover ? "translateY(-8px)" : "translateY(0)",
        boxShadow: hover ? "0 12px 30px rgba(0,0,0,0.12)" : "0 6px 15px rgba(0,0,0,0.06)",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={image} alt={title} style={styles.categoryImage} />
      <p style={styles.categoryTitle}>{title}</p>
    </div>
  );
}

const styles = {
  mainWrapper: {
    backgroundColor: BACKGROUND_COLOR,
    minHeight: "100vh",
  },
  heroContainer: {
    backgroundImage: `url('https://t4.ftcdn.net/jpg/03/08/02/89/360_F_308028924_YwjqVGzauey7GfmckScMtIkSPJAVNkll.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "85vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: "60px",
    borderBottomRightRadius: "60px",
    overflow: "hidden",
    position: "relative",
  },
  heroOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(4px)",
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
  },
  mainText: {
    fontSize: "3.5rem",
    fontWeight: "800",
    color: TEXT_COLOR,
    marginBottom: "20px",
    lineHeight: "1.1",
  },
  subText: {
    fontSize: "1.2rem",
    color: LIGHT_TEXT_COLOR,
    marginBottom: "40px",
    maxWidth: "700px",
    fontWeight: "400",
  },
  ctaButton: {
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    padding: "16px 45px",
    fontSize: "1.1rem",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: `0 8px 20px rgba(0, 180, 216, 0.3)`,
    transition: "0.3s ease",
  },
  section: {
    padding: "40px 5% 10px 5%",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: TEXT_COLOR,
    borderLeft: `6px solid ${PRIMARY_COLOR}`,
    paddingLeft: "15px",
  },
  viewAllButton: {
    border: "none",
    background: "none",
    color: PRIMARY_COLOR,
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
  },
  scrollContainer: {
    display: "flex",
    gap: "20px",
    overflowX: "auto",
    padding: "10px 5px 25px 5px",
  },

  pharmacyCard: {
    width: "280px",
    minWidth: "280px",
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "18px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    flexShrink: 0,
    overflow: "hidden",
    border: "1px solid #eee",
  },
  pharmacyImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
  },
  cardContent: {
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
  },
  cardTitle: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: TEXT_COLOR,
    margin: 0,
  },
  cardSubtitle: {
    fontSize: "0.85rem",
    color: PRIMARY_COLOR,
    fontWeight: "600",
  },

  /* COMPACT DEAL CARD */
  dealCard: {
    width: "180px",
    minWidth: "180px",
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "18px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
    padding: "15px", /* Tightened padding */
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", /* Centered vertically */
    flexShrink: 0,
    border: "1px solid #f0f0f0",
  },
  dealImage: {
    width: "55px", 
    height: "55px",
    objectFit: "contain",
    marginBottom: "10px", /* Reduced space below image */
  },
  cardContentCenter: {
    textAlign: "center",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "2px", /* Minimal gap between text items */
  },
  cardTitleWrap: {
    fontWeight: "700",
    color: TEXT_COLOR,
    fontSize: "0.88rem",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    lineHeight: "1.2",
  },
  dealCategory: {
    fontSize: "0.72rem",
    color: LIGHT_TEXT_COLOR,
    fontWeight: "500",
    margin: 0,
  },
  dealPrice: {
    color: PRIMARY_COLOR,
    fontWeight: "800",
    fontSize: "1.1rem",
    marginTop: "4px",
  },

  categoryCard: {
    width: "160px",
    minWidth: "160px",
    height: "190px",
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "22px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    flexShrink: 0,
    border: "1px solid #eee",
    cursor: "pointer",
    transition: "0.3s ease",
  },
  categoryImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
    marginBottom: "15px",
  },
  categoryTitle: {
    fontWeight: "700",
    color: TEXT_COLOR,
    fontSize: "0.95rem",
    margin: 0,
  },
};