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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleButtonClick = async (action) => {
    if (!product) return;
    if (product.availability === "Out of Stock") {
      triggerAlert("This item is out of stock.");
      return;
    }
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (action === "cart") {
      addToCart(product);
      triggerAlert(`${product.product_name} added to cart.`);
    } 
    else if (action === "reserve") {
      try {
        const reservationsRef = ref(db, "Reservation");
        const newReservationRef = push(reservationsRef);
        await set(newReservationRef, {
          reservation_id: newReservationRef.key,
          medicine_id: product.id,
          user_id: user.uid,
          reservation_date: new Date().toISOString(),
          status: "Reserved"
        });
        triggerAlert(`Reservation created for ${product.product_name}.`);
      } catch (err) {
        triggerAlert("Something went wrong while reserving.");
      }
    }
  };

  if (isLoading) return <LoadingView message="Loading details..." />;
  if (error || !product) return <ErrorView message={error || "Product not found."} navigate={navigate} />;

  return (
    <div style={styles.container}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          * { font-family: 'Poppins', sans-serif !important; }
        `}
      </style>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={() => navigate("/login")} 
      />

      {alert.show && <div style={styles.alert}>{alert.message}</div>}

      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft /> Back
      </button>

      <div style={styles.mainContent}>
        <div style={styles.flexWrapper}>
          <div style={styles.imageWrapper}>
            {/* Image background set to WHITE */}
            <div style={styles.imgBg}>
                <img
                    src={categoryIcons[product.category] || categoryIcons["Antibiotics"]}
                    alt={product.category}
                    style={styles.productImage}
                />
            </div>
          </div>

          <div style={styles.detailsWrapper}>
            <div style={styles.headerRow}>
                <span style={{ ...styles.availability, backgroundColor: getAvailabilityColor(product.availability) }}>
                    {getAvailabilityIcon(product.availability)} {product.availability}
                </span>
                <span style={styles.categoryLabel}><FaListAlt /> {product.category}</span>
            </div>

            <h1 style={styles.productTitle}>{product.product_name}</h1>
            <p style={styles.price}>{product.price}</p>

            <div style={styles.infoList}>
              <div style={styles.infoRow}><FaStore style={styles.icon}/> <span><strong>Pharmacy:</strong> {product.pharmacy_name}</span></div>
              <div style={styles.infoRow}><FaMapMarkerAlt style={styles.icon}/> <span><strong>Location:</strong> {product.pharmacy_location}</span></div>
              <div style={styles.infoRow}><FaIndustry style={styles.icon}/> <span><strong>Manufacturer:</strong> {product.manufacturer}</span></div>
            </div>

            <div style={styles.actionButtons}>
              <button style={buttonStyle("#00B4D8")} onClick={() => handleButtonClick("cart")}>
                Add to Cart
              </button>
              <button style={buttonStyle("#FFB300")} onClick={() => handleButtonClick("reserve")}>
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.sectionsWrapper}>
        <Section title="Overview" content={product.overview} />
        <Section title="Uses & Benefits" content={product.uses_benefits} />
        <Section title="How it Works" content={product.how_it_works} />
        <Section title="Side Effects" content={product.side_effects} />
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

const styles = {
  container: { padding: "40px 20px", maxWidth: "1100px", margin: "auto", marginTop: "100px" },
  mainContent: { backgroundColor: "#fff", borderRadius: "25px", padding: "30px" },
  flexWrapper: { display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "center" },
  imageWrapper: { flex: "1 1 350px", display: "flex", justifyContent: "center" },
  // Image container background set to solid WHITE
  imgBg: { 
    backgroundColor: "#ffffff", 
    borderRadius: "20px", 
    padding: "30px", 
    width: "100%", 
    textAlign: "center"
  },
  productImage: { width: "100%", maxWidth: "300px", objectFit: "contain" },
  detailsWrapper: { flex: "1 1 400px", display: "flex", flexDirection: "column" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  availability: { display: "flex", alignItems: "center", gap: "8px", color: "#fff", padding: "6px 15px", borderRadius: "50px", fontSize: "13px", fontWeight: "600" },
  categoryLabel: { color: "#888", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" },
  productTitle: { fontSize: "32px", fontWeight: "700", color: "#222", marginBottom: "10px" },
  price: { fontSize: "34px", fontWeight: "700", color: "#00B4D8", marginBottom: "20px" },
  infoList: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px" },
  infoRow: { display: "flex", alignItems: "center", gap: "10px", color: "#555", fontSize: "15px" },
  icon: { color: "#00B4D8" },
  actionButtons: { display: "flex", gap: "15px" },
  sectionsWrapper: { marginTop: "50px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" },
  section: { padding: "20px", borderRadius: "15px", backgroundColor: "#fff", border: "1px solid #efefef", transition: "0.3s" },
  sectionTitle: { fontSize: "18px", fontWeight: "600", color: "#00B4D8", marginBottom: "10px" },
  sectionContent: { fontSize: "14px", color: "#666", lineHeight: "1.6" },
  backButton: { marginBottom: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", color: "#00B4D8", background: "none", border: "none" },
  alert: { position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#00B4D8", color: "#fff", padding: "12px 25px", borderRadius: "50px", fontSize: "15px", fontWeight: "600", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.2)" }
};

/* --- Helpers & Sub-components --- */

function Section({ title, content }) {
  if (!content) return null;
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionContent}>{content}</p>
    </div>
  );
}

function LoginModal({ isOpen, onClose, onLogin }) {
  if (!isOpen) return null;
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <FaExclamationCircle size={50} color="#FFB300" style={{marginBottom: "15px"}} />
        <h2 style={{fontWeight: "700", marginBottom: "10px"}}>Sign In Required</h2>
        <p style={{color: "#666", marginBottom: "25px"}}>Please log in to add items to your cart or make a reservation.</p>
        <div style={{display: "flex", gap: "10px"}}>
          <button style={modalStyles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={modalStyles.loginBtn} onClick={onLogin}>Login Now</button>
        </div>
      </div>
    </div>
  );
}

const modalStyles = {
    overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, backdropFilter: "blur(5px)" },
    content: { backgroundColor: "#fff", padding: "40px", borderRadius: "30px", maxWidth: "400px", textAlign: "center" },
    cancelBtn: { flex: 1, padding: "12px", borderRadius: "50px", border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: "600" },
    loginBtn: { flex: 1, padding: "12px", borderRadius: "50px", border: "none", background: "#00B4D8", color: "#fff", cursor: "pointer", fontWeight: "600" }
};

function buttonStyle(bgColor) {
  return { flex: 1, padding: "15px", borderRadius: "50px", border: "none", backgroundColor: bgColor, color: "#fff", fontWeight: "600", cursor: "pointer", fontSize: "16px" };
}

function getAvailabilityIcon(status) {
  switch (status) {
    case "In Stock": return <FaCheckCircle />;
    case "Limited": return <FaExclamationCircle />;
    case "Out of Stock": return <FaTimesCircle />;
    default: return null;
  }
}

function getAvailabilityColor(status) {
  switch (status) {
    case "In Stock": return "#00c853";
    case "Limited": return "#FFB300";
    case "Out of Stock": return "#E63946";
    default: return "#777";
  }
}

function LoadingView({ message }) {
  return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#00B4D8", fontWeight: "600" }}>{message}</div>;
}

function ErrorView({ message, navigate }) {
  return <div style={{ textAlign: "center", marginTop: "150px" }}><p style={{ color: "#E63946" }}>{message}</p><button onClick={() => navigate(-1)} style={buttonStyle("#00B4D8")}>Go Back</button></div>;
}