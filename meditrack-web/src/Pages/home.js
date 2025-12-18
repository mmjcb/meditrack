import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Contact from "./contact.js";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PRIMARY_COLOR = "#00B4D8"; 
const TEXT_COLOR = "#202020"; 
const LIGHT_TEXT_COLOR = "#777777"; 
const BACKGROUND_COLOR = "#f9f9f9"; 
const CARD_BG_COLOR = "#ffffff"; 

function ChangeView({ center }) {
  const map = useMap();
  if (center) map.setView(center, 14);
  return null;
}

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

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", 
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export default function Home() {
  const navigate = useNavigate(); 
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyPharmacies, setNearbyPharmacies] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);

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
          discount: Math.floor(Math.random() * 20) + 5
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
      setMapCenter([latitude, longitude]);
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/nearby-pharmacies?lat=${latitude}&lng=${longitude}&limit=50`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setNearbyPharmacies(data); 
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
          .leaflet-container { border-radius: 24px; z-index: 1; }
          .deal-card-hover:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important; }
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
              {loading ? "No nearby pharmacies found." : "Locating pharmacies..."}
            </p>
          ) : (
            nearbyPharmacies.map((p, idx) => <PharmacyCard key={p.id || idx} pharmacy={p} />)
          )}
        </div>

        {nearbyPharmacies.length > 0 && (
          <div style={styles.mapWrapper}>
            <MapContainer
              center={mapCenter || [0, 0]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <ChangeView center={mapCenter} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap'
              />
              {nearbyPharmacies.map((pharmacy, idx) => (
                <Marker 
                  key={pharmacy.id || idx} 
                  position={[pharmacy.lat, pharmacy.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong style={{ color: PRIMARY_COLOR }}>{pharmacy.name}</strong>
                      <p style={{ fontSize: '12px', margin: '5px 0' }}>{pharmacy.address}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
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
        src={pharmacy.image || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400"}
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
    <div style={styles.dealCard} className="deal-card-hover">
      <div style={styles.dealBadge}>-{deal.discount}%</div>
      <div style={styles.dealIconWrapper}>
        <img src={icon} alt={deal.category} style={styles.dealImage} />
      </div>
      <div style={styles.cardContentCenter}>
        <p style={styles.dealCategory}>{deal.category}</p>
        <p style={styles.cardTitleWrap}>{deal.product_name}</p>
        <div style={styles.priceRow}>
            <span style={styles.dealPrice}>₱{deal.randomPrice}</span>
            <span style={styles.oldPrice}>₱{(parseFloat(deal.randomPrice) * 1.2).toFixed(2)}</span>
        </div>
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
  mainWrapper: { backgroundColor: BACKGROUND_COLOR, minHeight: "100vh" },
  heroContainer: {
    backgroundImage: `url('https://t4.ftcdn.net/jpg/03/08/02/89/360_F_308028924_YwjqVGzauey7GfmckScMtIkSPJAVNkll.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
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
    display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "20px",
  },
  mainText: { fontSize: "3rem", fontWeight: "800", color: TEXT_COLOR, marginBottom: "20px", lineHeight: "1.1" },
  subText: { fontSize: "1.2rem", color: LIGHT_TEXT_COLOR, marginBottom: "40px", maxWidth: "700px", fontWeight: "400" },
  ctaButton: {
    backgroundColor: PRIMARY_COLOR, color: "#fff", padding: "16px 45px", fontSize: "1.1rem",
    border: "none", borderRadius: "50px", cursor: "pointer", fontWeight: "600",
    boxShadow: `0 8px 20px rgba(0, 180, 216, 0.3)`, transition: "0.3s ease",
  },
  section: { padding: "40px 5% 10px 5%", maxWidth: "1400px", margin: "0 auto" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  sectionTitle: { fontSize: "26px", fontWeight: "700", color: TEXT_COLOR, borderLeft: `6px solid ${PRIMARY_COLOR}`, paddingLeft: "15px" },
  viewAllButton: { border: "none", background: "none", color: PRIMARY_COLOR, fontWeight: "600", cursor: "pointer", fontSize: "1rem" },
  scrollContainer: { display: "flex", gap: "20px", overflowX: "auto", padding: "15px 5px 30px 5px" },
  mapWrapper: { height: "450px", width: "100%", borderRadius: "24px", overflow: "hidden", marginTop: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #eee" },
  pharmacyCard: { width: "280px", minWidth: "280px", backgroundColor: CARD_BG_COLOR, borderRadius: "18px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", flexShrink: 0, overflow: "hidden", border: "1px solid #eee" },
  pharmacyImage: { width: "100%", height: "150px", objectFit: "cover" },
  cardContent: { padding: "15px", display: "flex", flexDirection: "column", gap: "3px" },
  cardTitle: { fontSize: "1.05rem", fontWeight: "700", color: TEXT_COLOR, margin: 0 },
  cardSubtitle: { fontSize: "0.85rem", color: PRIMARY_COLOR, fontWeight: "600" },

  dealCard: {
    width: "200px",
    minWidth: "200px",
    backgroundColor: CARD_BG_COLOR,
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flexShrink: 0,
    border: "1px solid #f0f0f0",
    position: "relative",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer"
  },
  dealBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#FF4D4D",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "10px",
    zIndex: 2
  },
  dealIconWrapper: {
    width: "100%",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", /* UPDATED TO WHITE */
    borderRadius: "15px",
    marginBottom: "15px",
    border: "1px solid #f5f5f5" /* ADDED BORDER FOR DEFINITION */
  },
  dealImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
  },
  cardContentCenter: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    textAlign: "left"
  },
  cardTitleWrap: {
    fontWeight: "600",
    color: TEXT_COLOR,
    fontSize: "0.95rem",
    margin: "4px 0 10px 0",
    height: "2.4em",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    lineHeight: "1.2",
  },
  dealCategory: {
    fontSize: "0.7rem",
    color: PRIMARY_COLOR,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "8px"
  },
  dealPrice: {
    color: TEXT_COLOR,
    fontWeight: "800",
    fontSize: "1.2rem",
  },
  oldPrice: {
    color: LIGHT_TEXT_COLOR,
    textDecoration: "line-through",
    fontSize: "0.85rem",
    fontWeight: "400"
  },

  categoryCard: { width: "160px", minWidth: "160px", height: "190px", backgroundColor: CARD_BG_COLOR, borderRadius: "22px", padding: "15px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", flexShrink: 0, border: "1px solid #eee", cursor: "pointer", transition: "0.3s ease" },
  categoryImage: { width: "60px", height: "60px", objectFit: "contain", marginBottom: "15px" },
  categoryTitle: { fontWeight: "700", color: TEXT_COLOR, fontSize: "0.95rem", margin: 0 },
};