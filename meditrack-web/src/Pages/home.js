import React, { useEffect, useState } from "react";
import productsData from "../data/meditrack_full_2000.json";

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

const pharmacies = [
  { name: "Mercury Drug", image: "https://static.wixstatic.com/media/d3a435_c2c53366eba94bd7bc941fa602765ed0~mv2.webp" },
  { name: "Watsons Philippines", image: "https://i.pinimg.com/564x/b6/33/06/b63306212a347b08eb84408cd92655c5.jpg" },
  { name: "Southstar Drug", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT740UQreYJYVgpEwBHV55MHbgHBqEzExZpzQ&s" },
  { name: "The Generics Pharmacy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsmm3Nf6klIwH8UmmMYdkZUCOgPUNJ0OxQ6w&s" },
  { name: "Rose Pharmacy", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ_33agw0k2QGLIqFCuv2xh0fpNVVDk1cFOg&s" },
];

export default function Home() {
  const [bestDeals, setBestDeals] = useState([]);

  useEffect(() => {
    // Filter products with a valid name
    const validProducts = productsData.filter(item => item.product_name);

    // Shuffle and pick 10
    const shuffled = [...validProducts].sort(() => 0.5 - Math.random());
    const randomDeals = shuffled.slice(0, 10).map(item => ({
      ...item,
      category: item.category || "Other",
      randomPrice: "₱" + (Math.random() * 100 + 20).toFixed(2),
    }));

    setBestDeals(randomDeals);
  }, []);

  const categories = Object.keys(categoryIcons).slice(0, 8);

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.container}>
        <div style={styles.overlay}>
          <h1 style={styles.mainText}>
            Find the medicines you need, <br /> when you need them.
          </h1>
          <p style={styles.subText}>
            Search, locate, and connect with pharmacies near you.
          </p>
          <button style={styles.ctaButton}>Start Searching</button>
        </div>
      </div>

      {/* Pharmacies */}
      <Section title="Pharmacies Near You">
        <div style={styles.scrollContainer}>
          {pharmacies.map((pharmacy, index) => (
            <div key={index} style={styles.card}>
              <img src={pharmacy.image} alt={pharmacy.name} style={styles.image} />
              <p style={styles.cardTitle}>{pharmacy.name}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Best Deals */}
      <Section title="Best Deals">
        <div style={styles.scrollContainer}>
          {bestDeals.map((item, index) => (
            <div key={index} style={styles.dealCard}>
              <img
                src={categoryIcons[item.category] || "https://cdn-icons-png.flaticon.com/512/565/565547.png"}
                alt={item.category}
                style={styles.dealImage}
              />
              <p style={styles.cardTitle}>{item.product_name}</p>
              <p style={{ color: "#00B4D8", fontWeight: "600" }}>{item.randomPrice}</p>
              <p style={{ fontSize: "14px", color: "#555" }}>{item.category}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section title="Categories">
        <div style={styles.scrollContainer}>
          {categories.map((category, index) => (
            <div key={index} style={styles.categoryCard}>
              <img src={categoryIcons[category]} alt={category} style={styles.categoryImage} />
              <p style={styles.cardTitle}>{category}</p>
            </div>
          ))}
        </div>
      </Section>
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

const styles = {
  container: {
    backgroundImage: "url('https://t4.ftcdn.net/jpg/03/08/02/89/360_F_308028924_YwjqVGzauey7GfmckScMtIkSPJAVNkll.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "92vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
    overflow: "hidden",
    position: "relative",
  },
  overlay: { padding: "40px", borderRadius: "20px", textAlign: "center", color: "#00B4D8", maxWidth: "800px" },
  mainText: { fontSize: "3rem", fontWeight: "bold", marginBottom: "20px", color: "#202020" },
  subText: { fontSize: "1.5rem", marginBottom: "30px", color: "#202020" },
  ctaButton: { backgroundColor: "#00B4D8", color: "#fff", padding: "15px 30px", fontSize: "1rem", fontWeight: "bold", border: "none", borderRadius: "10px", cursor: "pointer" },

  section: { padding: "50px 80px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  sectionTitle: { fontSize: "28px", fontWeight: "700", color: "#202020" },
  viewAllButton: { border: "none", background: "none", color: "#00B4D8", fontWeight: "600", cursor: "pointer" },

  scrollContainer: { display: "flex", gap: "20px", overflowX: "auto", scrollbarWidth: "none" },
  card: { minWidth: "220px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", padding: "15px", textAlign: "center", flexShrink: 0 },
  image: { width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" },
  cardTitle: { fontWeight: "600", color: "#202020", marginTop: "10px" },

  dealCard: { minWidth: "180px", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", padding: "15px", textAlign: "center", flexShrink: 0 },
  dealImage: { width: "90px", height: "90px", objectFit: "contain", marginBottom: "10px" },

  categoryCard: { minWidth: "200px", backgroundColor: "#fff", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", padding: "30px", textAlign: "center", flexShrink: 0 },
  categoryImage: { width: "100px", height: "100px", objectFit: "contain", marginBottom: "15px" },
};
