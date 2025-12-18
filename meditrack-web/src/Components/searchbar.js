import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaTag, FaStore, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

const API_BASE_URL = 'http://127.0.0.1:5000/api/products';

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
  "Mental Health": "https://cdn-icons-png.flaticon.com/512/3998/3998035.png",
  "Pregnancy & Baby": "https://cdn-icons-png.flaticon.com/512/5306/5306303.png",
  "Oral Care": "https://cdn-icons-png.flaticon.com/512/5715/5715281.png",
  "Hair & Scalp": "https://cdn-icons-png.flaticon.com/512/3464/3464759.png",
  "Weight Management": "https://cdn-icons-png.flaticon.com/512/4899/4899612.png",
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]); 
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [containerWidth, setContainerWidth] = useState("90%");
  const [sortOption, setSortOption] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const updateWidth = () => {
      const navbar = document.querySelector("nav");
      if (navbar) {
        // Increased subtraction to 120px (60px per side) for more "space on the side"
        setContainerWidth(`${navbar.offsetWidth - 120}px`);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    
    async function fetchAllProducts() {
      setIsLoading(true);
      try {
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        setAllProducts(data);
        setResults(data.slice(0, 50));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllProducts();
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = allProducts.filter((item) =>
        item.product_name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(query.trim() ? filtered : allProducts.slice(0, 50));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, allProducts]);

  useEffect(() => {
    if (sortOption && results.length > 0) {
      const sorted = [...results]; 
      if (sortOption === "price") {
        sorted.sort((a, b) => (parseFloat(a.price.replace(/[^\d.]/g, "")) || 0) - (parseFloat(b.price.replace(/[^\d.]/g, "")) || 0));
      } else if (sortOption === "pharmacy") {
        sorted.sort((a, b) => a.pharmacy_name.localeCompare(b.pharmacy_name));
      } else if (sortOption === "manufacturer") {
        sorted.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
      }
      setResults(sorted); 
    }
  }, [sortOption]); 

  return (
    <div style={styles.pageContainer}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          
          * {
            font-family: 'Poppins', sans-serif !important;
          }
        `}
      </style>

      {/* 1. SEARCH BAR - Focused width and circular design */}
      <div style={{ ...styles.searchWrapper, width: containerWidth }}>
        <div style={styles.leftHalf}>
          {isLoading ? (
            <span style={{opacity: 0.8}}>Syncing inventory...</span>
          ) : query ? (
            <span>Search Results for <strong style={{color: '#fff'}}>{query}</strong></span>
          ) : (
            <span>Find your medicine</span>
          )}
        </div>
        <div style={styles.rightHalf}>
          <input 
            type="text" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Type medicine name..." 
            style={styles.input} 
          />
          <FaSearch style={styles.searchIcon} />
        </div>
      </div>

      <div style={{ ...styles.mainContent, width: containerWidth }}>
        {/* 2. SIDEBAR */}
        <div style={styles.sortContainer}>
          <h3 style={styles.sortTitle}>Sort By</h3>
          <div style={styles.buttonStack}>
            {["price", "pharmacy", "manufacturer"].map((option) => (
              <button
                key={option}
                style={{
                  ...styles.sortButton,
                  backgroundColor: sortOption === option ? "#29ABE2" : "transparent",
                  color: sortOption === option ? "#fff" : "#444",
                  borderColor: sortOption === option ? "#29ABE2" : "#ddd",
                }}
                onClick={() => setSortOption(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
            {sortOption && (
               <button onClick={() => setSortOption("")} style={styles.clearFilterBtn}>
                 Reset Filter
               </button>
            )}
          </div>
        </div>

        {/* 3. PRODUCT GRID */}
        <div className="no-scrollbar" style={styles.cardGrid}>
          {isLoading && <div style={styles.centerMsg}>Loading medicines...</div>}
          {!isLoading && results.length === 0 && query && (
            <div style={styles.centerMsg}>No results found for "{query}".</div>
          )}
          
          <div style={styles.gridInner}>
            {results.map((item) => (
              <div key={item.id} style={styles.card} onClick={() => navigate(`/product/${item.id}`)}>
                <div style={styles.imageContainer}>
                   <img src={categoryIcons[item.category] || categoryIcons["Antibiotics"]} alt={item.category} style={styles.cardImage} />
                   <div style={styles.priceBadge}>{item.price}</div>
                </div>

                <div style={styles.cardBody}>
                  <div style={styles.categoryLabel}>{item.category?.toUpperCase()}</div>
                  <h3 style={styles.cardTitle}>{item.product_name}</h3>
                  <div style={styles.divider} />
                  <div style={styles.infoWrapper}>
                    <div style={styles.infoRow}>
                      <FaStore style={styles.icon} /> 
                      <span style={styles.pharmacyName}>{item.pharmacy_name}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <FaMapMarkerAlt style={styles.icon} /> 
                      <span style={styles.locationText}>{item.pharmacy_location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    height: "100vh", 
    overflow: "hidden", 
    backgroundColor: "#FFFFFF",
    fontFamily: "'Poppins', sans-serif"
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#29ABE2",
    borderRadius: "60px", 
    height: "65px", 
    marginTop: "20px",
    marginBottom: "25px",
    boxShadow: "none", 
    flexShrink: 0,
    padding: "0 35px", 
  },
  leftHalf: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: "16px", 
    flex: 1 },
  rightHalf: { 
    display: "flex", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    borderRadius: "50px", 
    padding: "0px 20px", 
    width: "50%", 
    height: "45px",
  },
  input: { border: "none", outline: "none", flex: 1, fontSize: "14px", color: "#333", padding: "0 10px", background: "transparent" },
  searchIcon: { color: "#29ABE2", fontSize: "18px" },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "30px",
    flex: 1, 
    overflow: "hidden", 
    paddingBottom: "20px"
  },
  sortContainer: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid #E5E7EB",
    height: "fit-content",
    alignSelf: "start",
  },
  sortTitle: { fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "20px" },
  buttonStack: { display: "flex", flexDirection: "column", gap: "10px" },
  sortButton: { 
    width: "100%", 
    borderRadius: "10px", 
    padding: "12px", 
    fontSize: "13px", 
    fontWeight: "600", 
    cursor: "pointer",
    border: "1px solid",
    transition: "0.2s"
  },
  clearFilterBtn: { border: "none", color: "#6B7280", fontSize: "12px", marginTop: "10px", background: "none", cursor: "pointer" },
  cardGrid: {
    overflowY: "auto", 
    height: "100%",
    paddingRight: "10px",
  },
  gridInner: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #E5E7EB",
    overflow: "hidden",
    minHeight: "350px",
  },
  imageContainer: {
    height: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: "30px",
    position: "relative"
  },
  priceBadge: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
    backgroundColor: "#F0F9FF",
    color: "#0369A1",
    padding: "6px 14px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    border: "1px solid #BAE6FD"
  },
  cardImage: { width: "100%", height: "100%", objectFit: "contain" },
  cardBody: { padding: "20px", flex: 1, display: "flex", flexDirection: "column" },
  categoryLabel: { fontSize: "10px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "1px", marginBottom: "4px" },
  cardTitle: { 
    fontSize: "18px", 
    fontWeight: "600", 
    color: "#111827", 
    marginBottom: "15px", 
    lineHeight: "1.3"
  },
  divider: { height: "1px", backgroundColor: "#F3F4F6", marginBottom: "15px" },
  infoWrapper: { flex: 1 },
  infoRow: { 
    display: "flex", 
    alignItems: "flex-start", 
    gap: "10px", 
    fontSize: "13px", 
    color: "#4B5563", 
    marginBottom: "10px" 
  },
  pharmacyName: { fontWeight: "500", color: "#1F2937" },
  locationText: { color: "#6B7280", lineHeight: "1.4" },
  icon: { color: "#9CA3AF", fontSize: "14px", marginTop: "2px", flexShrink: 0 },
  centerMsg: { gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#6B7280", fontSize: "16px" }
};