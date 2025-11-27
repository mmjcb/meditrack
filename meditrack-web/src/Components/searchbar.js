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
  "Pregnancy & Baby": "https://cdn-icons-png.flaticom/512/5306/5306303.png",
  "Oral Care": "https://cdn-icons-png.flaticon.com/512/5715/5715281.png",
  "Hair & Scalp": "https://cdn-icons-png.flaticon.com/512/3464/3464759.png",
  "Weight Management": "https://cdn-icons-png.flaticon.com/512/4899/4899612.png",
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  // State to hold search results (products currently displayed)
  const [results, setResults] = useState([]); 
  // State to hold the FULL list of products (optional, see notes below)
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const [width, setWidth] = useState("0px");
  const [sortOption, setSortOption] = useState("");
  const wrapperRef = useRef();
  const navigate = useNavigate();

  // 1. Fetch data on component mount (Only done once)
  useEffect(() => {
    // UI setup logic (remains unchanged)
    const navbar = document.querySelector("nav");
    if (navbar) setWidth(`${navbar.offsetWidth}px`);

    const handleResize = () => {
      if (navbar) setWidth(`${navbar.offsetWidth}px`);
    };
    window.addEventListener("resize", handleResize);
    
    // --- API Fetch Logic ---
    async function fetchAllProducts() {
      setIsLoading(true);
      try {
        // Fetches ALL 3000 records from your Flask API
        const response = await fetch(API_BASE_URL);
        const data = await response.json();
        setAllProducts(data); // Store the full dataset
        setResults(data.slice(0, 50)); // Display the first 50 results initially
      } catch (error) {
        console.error("Error fetching data from API:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllProducts();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Client-side Search (filtering the fetched list)
  useEffect(() => {
    if (!query.trim()) {
      // If query is empty, show the initial list (e.g., first 50)
      setResults(allProducts.slice(0, 50)); 
      return;
    }

    const timer = setTimeout(() => {
      // Filter the local copy of the data (allProducts) instead of fetching a new list
      const filtered = allProducts.filter((item) =>
        item.product_name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, allProducts]); // Added allProducts to dependency array

  // 3. Sorting (FIX: Removed 'results' from dependency array)
  useEffect(() => {
    if (sortOption && results.length > 0) {
      // Make a COPIED array to sort
      const sorted = [...results]; 
      
      // Note: The price parsing logic is robust and good!
      if (sortOption === "price") {
        sorted.sort(
          (a, b) =>
            (parseFloat(a.price.replace(/[^\d.]/g, "")) || 0) -
            (parseFloat(b.price.replace(/[^\d.]/g, "")) || 0)
        );
      } else if (sortOption === "pharmacy") {
        sorted.sort((a, b) => a.pharmacy_name.localeCompare(b.pharmacy_name));
      } else if (sortOption === "manufacturer") {
        sorted.sort((a, b) => a.manufacturer.localeCompare(b.manufacturer));
      }
      
      // Update the results state with the new sorted array
      setResults(sorted); 
    }
  // 👇 FIX: Removed 'results' from dependency array. Only depend on 'sortOption'.
  // This ensures the sorting runs ONCE when the button is clicked.
  }, [sortOption]); 

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
      <div ref={wrapperRef} style={{ ...styles.searchWrapper, width }}>
        <div style={styles.leftHalf}>
          {isLoading ? ( // Display loading indicator
            <span>Loading Data...</span>
          ) : query ? (
            <span>
              Search results for <strong>{query.toUpperCase()}</strong>
            </span>
          ) : (
            <span>Search medicines</span>
          )}
        </div>

        <div style={styles.rightHalf}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type here..."
            style={styles.input}
          />
          <FaSearch style={styles.searchIcon} />
        </div>
      </div>

      <div style={{ ...styles.mainContent, width }}>
        <div style={styles.sortContainer}>
          <h3 style={styles.sortTitle}>Sort By</h3>
          {["price", "pharmacy", "manufacturer"].map((option) => (
            <button
              key={option}
              style={{
                ...styles.sortButton,
                backgroundColor: sortOption === option ? "#29ABE2" : "#fff",
                color: sortOption === option ? "#fff" : "#29ABE2",
              }}
              onClick={() => setSortOption(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        <div style={styles.cardGrid}>
          {isLoading && <p>Fetching data from API, please wait...</p>}
          
          {!isLoading && results.length === 0 && query && <p>No results found for "{query}".</p>}
          
          {/* Display cards */}
          {!isLoading && results.map((item) => (
            <div
              key={item.id}
              style={styles.card}
              onClick={() => navigate(`/product/${item.id}`)}
            >
              <img
                src={categoryIcons[item.category]}
                alt={item.category}
                style={{
                  width: "60%",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <h3 style={styles.cardTitle}>{item.product_name}</h3>
              <p style={styles.cardText}>
                <FaTag style={{ marginRight: "8px", color: "#00B4D8" }} /> {item.price}
              </p>
              <p style={styles.cardText}>
                <FaStore style={{ marginRight: "8px", color: "#00B4D8" }} /> {item.pharmacy_name}
              </p>
              <p style={styles.cardText}>
                <FaMapMarkerAlt style={{ marginRight: "8px", color: "#00B4D8" }} /> {item.pharmacy_location}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Styles remain unchanged */}
      <style>
        {`
          div::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  // All styles remain unchanged
  searchWrapper: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#29ABE2",
    borderRadius: "50px",
    padding: 0,
    height: "60px",
    margin: "20px auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  leftHalf: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "20px",
    flex: 1,
    paddingLeft: "40px",
  },
  rightHalf: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "50px",
    padding: "0px 20px",
    width: "50%",
    flexShrink: 0,
    marginRight: "10px",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: "18px",
    color: "#29ABE2",
    padding: "10px",
    textTransform: "none",
  },
  searchIcon: {
    color: "#29ABE2",
    fontSize: "16px",
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "minmax(200px, 250px) 1fr",
    gap: "50px",
    width: "100%",
    maxWidth: "1400px",
    marginTop: "10px",
    height: "calc(100vh - 130px)",
  },
  sortContainer: {
    position: "sticky",
    top: 0,
    zIndex: 999,
    backgroundColor: "#f7f7f7",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    height: "73%",
    alignSelf: "start",
  },
  sortTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#29ABE2",
    marginBottom: "15px",
  },
  sortButton: {
    width: "100%",
    border: "2px solid #29ABE2",
    borderRadius: "30px",
    padding: "10px",
    fontSize: "15px",
    fontWeight: "500",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    overflowY: "auto",
    paddingRight: "10px",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderLeft: "6px solid #00B4D8",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    borderRadius: "10px",
    width: "90%",
    cursor: "pointer",
  },
  cardTitle: {
    fontSize: "24px",
    marginBottom: "5px",
    color: "#202020",
  },
  cardText: {
    fontSize: "1rem",
    marginBottom: "5px",
    color: "#333",
  },
};