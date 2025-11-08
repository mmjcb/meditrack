import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsData from "../data/meditrack_full_2000.json";
import { 
  FaArrowLeft, FaTag, FaStore, FaMapMarkerAlt, FaIndustry, FaListAlt, 
  FaCheckCircle, FaTimesCircle, FaExclamationCircle 
} from "react-icons/fa";

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
  const product = productsData.find((p) => p.id === parseInt(id));

  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ padding: "20px 40px", maxWidth: "1200px", margin: "auto", fontFamily: "Arial, sans-serif", marginTop: "120px" }}>
      
    <button
    onClick={() => navigate(-1)}
    style={{
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
    }}
    >
    <FaArrowLeft /> Back
    </button>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "stretch" }}>
        
        <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img
            src={categoryIcons[product.category]}
            alt={product.category}
            style={{ width: "100%", maxWidth: "350px", borderRadius: "12px", objectFit: "contain" }}
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

          <h1 style={{ fontSize: "28px", color: "#202020", marginBottom: "10px" }}>{product.product_name}</h1>

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
            <button style={buttonStyle("#00B4D8")}>Buy Now</button>
            <button style={buttonStyle("#00d804ff")}>Add to Cart</button>
            <button style={buttonStyle("#FFB300")}>Reserve</button>
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

function Section({ title, content }) {
  if (!content) return null;
  return (
    <div style={{ padding: "15px", borderRadius: "8px", border: "1px solid #ddd" }}>
      <h2 style={{ fontSize: "20px", color: "#00B4D8", marginBottom: "8px" }}>{title}</h2>
      <p style={{ fontSize: "15px", color: "#333", lineHeight: "1.4" }}>{content}</p>
    </div>
  );
}

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

function getAvailabilityIcon(status) {
  const iconStyle = { color: "#fff", fontSize: "14px"};
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
