import React, { useState, useEffect } from "react";
import { useAuth } from '../backend/AuthContext.js';
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from '../backend/CartContext.js';
import { 
  FaArrowLeft, FaTag, FaStore, FaMapMarkerAlt, FaIndustry, FaListAlt, 
  FaCheckCircle, FaTimesCircle, FaExclamationCircle 
} from "react-icons/fa";
import { ref, push, set } from "firebase/database";
import { db } from "../backend/firebase.js";

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

export default function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "" });

  const triggerAlert = (msg) => {
    setAlert({ show: true, message: msg });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  useEffect(() => {
    if (!id) {
      setError("No product ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleButtonClick = async (action) => {
    if (!product) return;
    if (action === "cart") {
      addToCart(product);
      triggerAlert(`${product.product_name} has been added to your cart.`);
     } else if (action === "reserve") {
    try {
      const reservationsRef = ref(db, "Reservation");
      const newReservationRef = push(reservationsRef);
      const reservationData = {
        reservation_id: newReservationRef.key,
        medicine_id: product.id,
        user_id: user.uid,
        reservation_date: new Date().toISOString(),
        status: "Reserved"
      };

      await set(newReservationRef, reservationData);

      triggerAlert(`Reservation created for ${product.product_name}.`);
    } catch (err) {
      console.error("Reservation error:", err);
      triggerAlert("Login first before making a reservation.");
    }
  }
};

  if (isLoading) return <LoadingView message="Loading product details..." />;
  if (error || !product) return <ErrorView message={error || "Product not found."} navigate={navigate} />;

  return (
    <div style={styles.container}>
      {/* ALERT */}
      {alert.show && <div style={styles.alert}>{alert.message}</div>}

      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back
      </button>

      <div style={styles.flexWrapper}>
        {/* IMAGE */}
        <div style={styles.imageWrapper}>
          <img
            src={categoryIcons[product.category]}
            alt={product.category}
            style={styles.productImage}
          />
        </div>

        {/* DETAILS */}
        <div style={styles.detailsWrapper}>
          <span style={{...styles.availability, backgroundColor: getAvailabilityColor(product.availability)}}>
            {getAvailabilityIcon(product.availability)} {product.availability}
          </span>

          <h1 style={styles.productTitle}>{product.product_name}</h1>

          <p style={styles.price}><FaTag /> {product.price}</p>

          <div style={styles.info}>
            <p><FaStore /> {product.pharmacy_name}</p>
            <p><FaMapMarkerAlt /> {product.pharmacy_location}</p>
            <p><FaIndustry /> {product.manufacturer}</p>
            <p><FaListAlt /> {product.category}</p>
          </div>

          <div style={styles.actionButtons}>
            <button style={buttonStyle("#00B4D8")} onClick={() => handleButtonClick("cart")}>Add to Cart</button>
            <button style={buttonStyle("#FFB300")} onClick={() => handleButtonClick("reserve")}>Reserve</button>
          </div>
        </div>
      </div>

      {/* INFO SECTIONS */}
      <div style={styles.sectionsWrapper}>
        <Section title="Overview" content={product.overview} />
        <Section title="Uses & Benefits" content={product.uses_benefits} />
        <Section title="How it Works" content={product.how_it_works} />
        <Section title="Side Effects" content={product.side_effects} />
      </div>
    </div>
  );
}

/* -------------------- SUB-COMPONENTS -------------------- */

function Section({ title, content }) {
  if (!content) return null;
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionContent}>{content}</p>
    </div>
  );
}

function LoadingView({ message }) {
  return (
    <div style={{ padding: "20px", marginTop: "140px", textAlign: "center" }}>
      <p style={{ fontSize: "20px", color: "#00B4D8" }}>{message}</p>
    </div>
  );
}

function ErrorView({ message, navigate }) {
  return (
    <div style={{ padding: "20px", marginTop: "140px", textAlign: "center" }}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back
      </button>
      <p style={{ fontSize: "20px", color: "#E63946" }}>{message}</p>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const styles = {
  container: {
    padding: "20px 40px",
    maxWidth: "1200px",
    margin: "auto",
    marginTop: "140px",
    backgroundColor: "#fff"
  },
  flexWrapper: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    alignItems: "stretch"
  },
  imageWrapper: {
    flex: "1 1 300px",
    display: "flex",
    justifyContent: "center",
    minWidth: "280px"
  },
  productImage: {
    width: "100%",
    maxWidth: "350px",
    borderRadius: "12px"
  },
  detailsWrapper: {
    flex: "1 1 400px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    position: "relative",
    minWidth: "300px"
  },
  availability: {
    position: "absolute",
    top: "0",
    right: "0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "600"
  },
  productTitle: { fontSize: "28px", color: "#202020", marginBottom: "10px" },
  price: { fontSize: "28px", fontWeight: "700", color: "#00B4D8", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" },
  info: { display: "flex", flexDirection: "column", gap: "2px", color: "#00B4D8", fontSize: "18px", marginTop: "10px" },
  actionButtons: { display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" },
  sectionsWrapper: { marginTop: "50px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  section: { padding: "15px", borderRadius: "8px", border: "1px solid #ddd" },
  sectionTitle: { fontSize: "20px", color: "#00B4D8", marginBottom: "8px" },
  sectionContent: { fontSize: "15px", color: "#333", lineHeight: "1.4" },
  backButton: {
    marginBottom: "20px",
    padding: "8px 15px",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#00B4D8",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "14px"
  },
  alert: {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#00B4D8",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    zIndex: 9999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    animation: "fadeInOut 3s ease"
  }
};

/* -------------------- BUTTON & AVAILABILITY HELPERS -------------------- */
function buttonStyle(bgColor) {
  return {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: bgColor,
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    flex: "1 1 100px",
    transition: "0.3s",
    outline: "none"
  };
}

function getAvailabilityIcon(status) {
  const iconStyle = { color: "#fff", fontSize: "14px" };
  switch (status) {
    case "In Stock": return <FaCheckCircle style={iconStyle} />;
    case "Limited": return <FaExclamationCircle style={iconStyle} />;
    case "Out of Stock": return <FaTimesCircle style={iconStyle} />;
    default: return null;
  }
}

function getAvailabilityColor(status) {
  switch (status) {
    case "In Stock": return "#00d804ff";
    case "Limited": return "#FFB300";
    case "Out of Stock": return "#E63946";
    default: return "#777";
  }
}
