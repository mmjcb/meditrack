import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "./contact.js";

const PRIMARY_COLOR = "#00B4D8"; 
const ACCENT_COLOR = "#ADE8F4"; 
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
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/nearby-pharmacies?lat=${latitude}&lng=${longitude}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setNearbyPharmacies(data.slice(0, 6)); 
      } catch (err) {
        console.error("Error fetching nearby pharmacies:", err);
      }
    }, err => console.error("Geolocation error:", err));
  }, []);

  const categories = Object.keys(categoryIcons);

  return (
    <div style={styles.mainWrapper}>
      <div style={styles.heroContainer}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.mainText}>
            Find the medicines you need,<br />when you need them
          </h1>
          <p style={styles.subText}>
            Search, locate, and connect with trusted pharmacies near you instantly.
          </p>
           <button
              style={styles.ctaButton}
              onClick={() => navigate("/search")}
            >
              Start Searching
            </button>
        </div>
      </div>

      <Section title="Pharmacies Near You">
        <div style={styles.scrollContainer}>
          {nearbyPharmacies.length === 0 ? (
            <p style={{ color: LIGHT_TEXT_COLOR }}>
              {loading ? "Locating pharmacies using your current position..." : "No nearby pharmacies found or location is disabled."}
            </p>
          ) : (
            nearbyPharmacies.map(p => (
              <PharmacyCard key={p.id || p.name} pharmacy={p} />
            ))
          )}
        </div>
      </Section>

      <Section title="Best Deals">
        <div style={styles.scrollContainer}>
          {loading ? <p style={{ color: LIGHT_TEXT_COLOR }}>Loading today's best deals...</p> : bestDeals.map(d => (
            <DealCard key={d.id || d.product_name} deal={d} icon={categoryIcons[d.category] || categoryIcons["Other"]} />
          ))}
        </div>
      </Section>

      <Section title="Shop by Category">
        <div style={styles.scrollContainer}>
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
      <div style={{ padding: "10px" }}>
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
      <p style={styles.cardTitle}>{deal.product_name}</p>
      <p style={styles.dealCategory}>{deal.category}</p>
      <p style={styles.dealPrice}>₱{deal.randomPrice}</p>
    </div>
  );
}

function CategoryCard({ title, image }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        ...styles.categoryCard,
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hover ? "0 10px 25px rgba(0,0,0,0.15)" : "0 6px 15px rgba(0,0,0,0.08)",
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
    fontFamily: "Poppins, sans-serif", 
    minHeight: "100vh",
  },
  
  heroContainer: {
    backgroundImage: `url('https://t4.ftcdn.net/jpg/03/08/02/89/360_F_308028924_YwjqVGzauey7GfmckScMtIkSPJAVNkll.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: "50px", 
    borderBottomRightRadius: "50px",
    overflow: "hidden",
    position: "relative",
  },
  heroOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.5)", 
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "40px",
  },
  mainText: {
    fontSize: "3rem",
    fontWeight: "800",
    color: TEXT_COLOR,
    marginBottom: "15px",
    lineHeight: "1.1",
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    paddingTop: "80px",
  },
  subText: {
    fontSize: "1.3rem",
    color: LIGHT_TEXT_COLOR,
    marginBottom: "50px",
    maxWidth: "800px",
  },
  ctaButton: {
    backgroundColor: PRIMARY_COLOR,
    color: "#fff",
    padding: "18px 40px",
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "30px", 
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s, transform 0.1s",
    boxShadow: `0 4px 15px rgba(0, 180, 216, 0.4)`,
    ":hover": { backgroundColor: "#00a3c4" }
  },
  
  section: {
    padding: "60px 80px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: TEXT_COLOR,
    borderLeft: `5px solid ${PRIMARY_COLOR}`, 
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
    gap: "30px", 
    overflowX: "auto",
    paddingBottom: "20px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  cardTitle: {
    fontWeight: "700",
    color: TEXT_COLOR,
    marginTop: "10px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardSubtitle: {
    fontSize: "0.9rem",
    color: LIGHT_TEXT_COLOR,
    marginTop: "2px",
  },

  pharmacyCard: {
    minWidth: "250px", 
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    flexShrink: 0,
    border: `1px solid ${ACCENT_COLOR}`,
    overflow: "hidden",
    transition: "transform 0.2s",
    cursor: "pointer",
    ":hover": { transform: "translateY(-3px)" }
  },
  pharmacyImage: {
    width: "100%",
    height: "150px", 
    objectFit: "cover",
    borderBottom: `1px solid ${BACKGROUND_COLOR}`,
  },
  
  dealCard: {
    minWidth: "200px",
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "15px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
    padding: "20px 15px",
    textAlign: "center",
    flexShrink: 0,
    border: `1px solid ${ACCENT_COLOR}`,
    transition: "transform 0.2s",
    cursor: "pointer",
    ":hover": { transform: "translateY(-3px)" }
  },
  dealImage: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
    marginBottom: "10px",
    backgroundColor: ACCENT_COLOR,
    borderRadius: "50%",
    padding: "10px",
  },
  dealPrice: {
    color: PRIMARY_COLOR,
    fontWeight: "800",
    fontSize: "1.3rem",
    margin: "10px 0 0",
  },
  dealCategory: {
    fontSize: "14px",
    color: LIGHT_TEXT_COLOR,
    fontWeight: "500",
  },
  
  categoryCard: {
    minWidth: "160px", 
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "20px", 
    padding: "30px 15px",
    textAlign: "center",
    flexShrink: 0,
    border: `1px solid ${ACCENT_COLOR}`,
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
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
    fontSize: "1rem",
  },
};