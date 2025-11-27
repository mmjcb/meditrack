import React, { useEffect, useState } from "react";
import Contact from "./contact";

const PRIMARY_COLOR = "#00B4D8";
const TEXT_COLOR = "#202020";

const categoryIcons = {
  "Pain Relief": "https://cdn-icons-png.flaticon.com/512/387/387630.png",
  "Cough & Cold": "https://cdn-icons-png.flaticon.com/256/2877/2877806.png",
  "Vitamins & Supplements": "https://cdn-icons-png.flaticon.com/512/3274/3274085.png",
  "Antibiotics": "https://cdn-icons-png.flaticon.com/512/11469/11469427.png",
  "Digestive Health": "https://cdn-icons-png.flaticon.com/256/10154/10154425.png",
  "Skin Care": "https://cdn-icons-png.flaticon.com/512/3789/3789972.png",
  "Diabetes": "https://cdn-icons-png.flaticon.com/512/7350/7350822.png",
  "Heart & Blood": "https://cdn-icons-png.flaticon.com/512/3595/3595788.png",
};

const pharmacies = [
  { name: "Mercury Drug", image: "https://static.wixstatic.com/media/d3a435_c2c53366eba94bd7bc941fa602765ed0~mv2.webp" },
  { name: "Watsons Philippines", image: "https://i.pinimg.com/564x/b6/33/06/b63306212a347b08eb84408cd92655c5.jpg" },
  { name: "Southstar Drug", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT740UQreYJYVgpEwBHV55MHbgHBqEzExZpzQ&s" },
  { name: "The Generics Pharmacy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsmm3Nf6klIwH8UmmMYdkZUCOgPUNJ0OxQ6w&s" },
  { name: "Rose Pharmacy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_33agw0k2QGLIqFCuv2xh0fpNVVDk1cFOg&s" },
];

export default function Home() {
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = "http://127.0.0.1:5000/api/products";

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const validProducts = data.filter(item => item.product_name);

        const shuffled = [...validProducts].sort(() => 0.5 - Math.random());
        const randomDeals = shuffled.slice(0, 10).map(item => ({
          ...item,
          category: item.category || "Other",
          randomPrice: "₱" + (Math.random() * 100 + 20).toFixed(2),
        }));

        setBestDeals(randomDeals);
      } catch (err) {
        console.error("Error fetching products:", err);
        alert("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  },
 []);

  const categories = Object.keys(categoryIcons);

  return (
    <div style={styles.mainWrapper}>
      <div style={styles.heroContainer}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.mainText}>Find the medicines you need,<br/>when you need them</h1>
          <p style={styles.subText}>Search, locate, and connect with pharmacies near you.</p>
          <button style={styles.ctaButton}>Start Searching</button>
        </div>
      </div>

      <Section title="Pharmacies Near You">
        <div style={styles.scrollContainer}>
          {pharmacies.map((p, i) => (
            <div key={i} style={styles.pharmacyCard}>
              <img src={p.image} alt={p.name} style={styles.pharmacyImage}/>
              <p style={styles.cardTitle}>{p.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Best Deals">
        <div style={styles.scrollContainer}>
          {loading ? <p>Loading...</p> :
            bestDeals.map((d, i) => (
              <div key={i} style={styles.dealCard}>
                <img src={categoryIcons[d.category] || categoryIcons["Pain Relief"]} alt={d.category} style={styles.dealImage}/>
                <p style={styles.cardTitle}>{d.product_name}</p>
                <p style={styles.dealPrice}>{d.randomPrice}</p>
                <p style={styles.dealCategory}>{d.category}</p>
              </div>
            ))
          }
        </div>
      </Section>

      <Section title="Shop by Category">
        <div style={styles.scrollContainer}>
          {categories.map((c, i) => (
            <CategoryCard key={i} title={c} image={categoryIcons[c]}/>
          ))}
        </div>
      </Section>

      <Contact/>
    </div>
  )
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
  )
}

function CategoryCard({ title, image }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        ...styles.categoryCard,
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hover ? "0 8px 20px rgba(0,0,0,0.12)" : "0 6px 15px rgba(0,0,0,0.08)",
      }}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
    >
      <img src={image} alt={title} style={styles.categoryImage}/>
      <p style={styles.categoryTitle}>{title}</p>
    </div>
  )
}

const styles = {
  mainWrapper: { backgroundColor: "#f9f9f9", fontFamily:"Arial, sans-serif" },
  heroContainer: {
    backgroundImage:"url('https://t4.ftcdn.net/jpg/03/08/02/89/360_F_308028924_YwjqVGzauey7GfmckScMtIkSPJAVNkll.jpg')",
    backgroundSize:"cover", backgroundPosition:"center",
    height:"90vh", display:"flex", justifyContent:"center", alignItems:"center",
    borderBottomLeftRadius:"30px", borderBottomRightRadius:"30px", overflow:"hidden",
  },
  heroOverlay:{
    position:"absolute", top:0,left:0,right:0,bottom:0,
    backgroundColor:"rgba(224, 224, 224, 0.35)",
    display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
    textAlign:"center", padding:"40px",
  },
  mainText:{ fontSize:"3rem", fontWeight:"800", color:TEXT_COLOR, marginBottom:"15px", lineHeight:"1.2" },
  subText:{ fontSize:"1.2rem", color:TEXT_COLOR, marginBottom:"40px" },
  ctaButton:{ backgroundColor:PRIMARY_COLOR, color:"#fff", padding:"18px 40px", fontSize:"1.1rem", border:"none", borderRadius:"12px", cursor:"pointer" },
  section:{ padding:"60px 80px", maxWidth:"1400px", margin:"0 auto" },
  sectionHeader:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"30px" },
  sectionTitle:{ fontSize:"30px", fontWeight:"700", color:TEXT_COLOR },
  viewAllButton:{ border:"none", background:"none", color:PRIMARY_COLOR, fontWeight:"600", cursor:"pointer" },
  scrollContainer:{ display:"flex", gap:"25px", overflowX:"auto", paddingBottom:"15px", scrollbarWidth:"none", msOverflowStyle:"none" },
  cardTitle:{ fontWeight:"600", color:TEXT_COLOR, marginTop:"10px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
  pharmacyCard:{ minWidth:"220px", backgroundColor:"#fff", borderRadius:"15px", boxShadow:"0 6px 15px rgba(0,0,0,0.08)", padding:"15px", textAlign:"center", flexShrink:0, border:"1px solid #eee" },
  pharmacyImage:{ width:"100%", height:"130px", objectFit:"cover", borderRadius:"10px" },
  dealCard:{ minWidth:"180px", backgroundColor:"#fff", borderRadius:"15px", boxShadow:"0 6px 15px rgba(0,0,0,0.08)", padding:"18px 15px", textAlign:"center", flexShrink:0, border:"1px solid #eee" },
  dealImage:{ width:"80px", height:"80px", objectFit:"contain", marginBottom:"15px" },
  dealPrice:{ color:PRIMARY_COLOR, fontWeight:"700", fontSize:"1.1rem", margin:"5px 0" },
  dealCategory:{ fontSize:"13px", color:"#777" },
  categoryCard:{ minWidth:"180px", backgroundColor:"#fff", borderRadius:"15px", padding:"30px 15px", textAlign:"center", flexShrink:0, border:"1px solid #eee", cursor:"pointer", transition:"transform 0.3s, box-shadow 0.3s" },
  categoryImage:{ width:"80px", height:"80px", objectFit:"contain", marginBottom:"15px" },
  categoryTitle:{ fontWeight:"600", color:TEXT_COLOR, fontSize:"1.1rem" },
};
