import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from '../backend/CartContext';
import { 
  FaArrowLeft, FaTag, FaStore, FaMapMarkerAlt, FaIndustry, FaListAlt, 
  FaCheckCircle, FaTimesCircle, FaExclamationCircle 
} from "react-icons/fa";

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

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ALERT STATE
  const [alert, setAlert] = useState({ show: false, message: "" });

  const triggerAlert = (msg) => {
    setAlert({ show: true, message: msg });
    setTimeout(() => {
      setAlert({ show: false, message: "" });
    }, 3000);
  };

  useEffect(() => {
    if (!id) {
      setError("No product ID provided.");
      setIsLoading(false);
      return;
    }

    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load product details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const handleButtonClick = (action) => {
    if (!product) return;

    if (action === "cart") {
      addToCart(product);
      triggerAlert(`${product.product_name} has been added to your cart.`);
      return;
    }

    if (action === "reserve") {
      triggerAlert(`Reservation requested for ${product.product_name}.`);
      return;
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "20px 40px", maxWidth: "1200px", margin: "auto", marginTop: "120px" }}>
        <p style={{ fontSize: "20px", color: "#00B4D8" }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: "20px 40px", maxWidth: "1200px", margin: "auto", marginTop: "120px" }}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          <FaArrowLeft /> Back
        </button>
        <p style={{ fontSize: "20px", color: "#E63946" }}>{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 40px", maxWidth: "1200px", margin: "auto", marginTop: "120px" }}>

      {/* ✅ TOP-CENTER ALERT */}
      {alert.show && (
        <div style={alertStyle}>
          {alert.message}
        </div>
      )}

      <button onClick={() => navigate(-1)} style={backButtonStyle}>
        <FaArrowLeft /> Back
      </button>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
          <img
            src={categoryIcons[product.category]}
            alt={product.category}
            style={{ width: "100%", maxWidth: "350px", borderRadius: "12px" }}
          />
        </div>

        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "2px", position: "relative" }}>
          
          <span style={{
            position: "absolute",
            top: "0",
            right: "0",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: getAvailabilityColor(product.availability),
            color: "#fff",
            padding: "5px 12px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600"
          }}>
            {getAvailabilityIcon(product.availability)} {product.availability}
          </span>

          <h1 style={{ fontSize: "28px", color: "#202020", marginBottom: "10px" }}>
            {product.product_name}
          </h1>

          <p style={{ fontSize: "28px", fontWeight: "700", color: "#00B4D8", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaTag /> {product.price}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <p style={infoStyle}><FaStore /> {product.pharmacy_name}</p>
            <p style={infoStyle}><FaMapMarkerAlt /> {product.pharmacy_location}</p>
            <p style={infoStyle}><FaIndustry /> {product.manufacturer}</p>
            <p style={infoStyle}><FaListAlt /> {product.category}</p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" }}>
            <button style={buttonStyle("#00B4D8")} onClick={() => handleButtonClick("cart")}>Add to Cart</button>
            <button style={buttonStyle("#FFB300")} onClick={() => handleButtonClick("reserve")}>Reserve</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "70px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        <Section title="Overview" content={product.overview} />
        <Section title="Uses & Benefits" content={product.uses_benefits} />
        <Section title="How it Works" content={product.how_it_works} />
        <Section title="Side Effects" content={product.side_effects} />
      </div>

    </div>
  );
}

/* COMPONENTS & STYLES */

function Section({ title, content }) {
  if (!content) return null;
  return (
    <div style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
      <h2 style={{ fontSize: "20px", color: "#00B4D8", marginBottom: "8px" }}>{title}</h2>
      <p style={{ fontSize: "15px", color: "#333", lineHeight: "1.4" }}>{content}</p>
    </div>
  );
}

const alertStyle = {
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
};

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
  };
}

const infoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "18px",
  color: "#00B4D8",
};

const backButtonStyle = {
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
};

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
