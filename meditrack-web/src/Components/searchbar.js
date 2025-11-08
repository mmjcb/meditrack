import React, { useState, useEffect } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [location] = useState("Your Location");
  const [sort, setSort] = useState("A-Z");
  const [width, setWidth] = useState("0px");

  useEffect(() => {
    const navbar = document.querySelector("nav");
    if (navbar) setWidth(`${navbar.offsetWidth}px`);

    const handleResize = () => {
      if (navbar) setWidth(`${navbar.offsetWidth}px`);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for "${query}" near ${location}, sorted by ${sort}`);
  };

  return (
    <div style={{ ...styles.wrapper, width }}>
      <div style={styles.pillContainer}>
        <form style={styles.form} onSubmit={handleSearch}>
          <div style={styles.inputWrapper}>
            {/* Search icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={styles.icon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search medicines..."
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Search</button>
        </form>
      </div>

      <div style={styles.infoRow}>
        <div style={styles.leftText}>Search results near: {location}</div>
        <div>
          <label>
            Sort by:{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={styles.select}
            >
              <option>A-Z</option>
              <option>Price Low-High</option>
              <option>Price High-Low</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "20px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
  pillContainer: {
    width: "98%",
    backgroundColor: "rgba(0,180,216,0.85)",
    borderRadius: "50px",
    display: "flex",
    justifyContent: "flex-end",
    padding: "10px 15px",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  },
  form: {
    display: "flex",
    alignItems: "center",
    width: "65%", // more input space
  },
  inputWrapper: {
    position: "relative",
    flex: 1,
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "15px",
    transform: "translateY(-50%)",
    width: "20px",
    height: "20px",
    color: "#888",
  },
  input: {
    width: "93%",
    padding: "15px 25px 15px 45px",
    border: "none",
    borderRadius: "50px 0 0 50px",
    outline: "none",
    fontSize: "1.2rem",
    color: "#202020",
    backgroundColor: "white",
  },
  button: {
    padding: "15px 30px",
    border: "none",
    borderRadius: "0 50px 50px 0",
    fontWeight: "bold",
    cursor: "pointer",
    backgroundColor: "#202020",
    color: "#00B4D8",
    fontSize: "1rem",
  },
  infoRow: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    fontSize: "1rem",
    color: "#202020",
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  leftText: {
    fontWeight: "500",
  },
  select: {
    padding: "5px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    cursor: "pointer",
    marginRight: "20px",
  },
};
