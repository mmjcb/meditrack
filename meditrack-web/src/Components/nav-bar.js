import { NavLink } from "react-router-dom";
import logo from "../assets/meditrack-logo-long.png"; 

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <NavLink to="/">
          <img src={logo} alt="Logo" style={styles.logo} />
        </NavLink>
      </div>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <NavLink to="/" style={styles.link}>Home</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/search" style={styles.link}>Search</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/contact" style={styles.link}>About</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/cart" style={styles.link}>Cart</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/profile" style={styles.link}>Profile</NavLink>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.64)', // very transparent
    padding: '20px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '20px',
    borderRadius: '15px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', // softer shadow for depth
    backdropFilter: 'blur(20px) saturate(180%)', // blur + slight saturation
    WebkitBackdropFilter: 'blur(20px) saturate(180%)', // for Safari
    border: '1px solid rgba(255, 255, 255, 0.3)', // soft glass edge
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logoContainer: {
    flexShrink: 0,
  },
  logo: {
    height: '45px',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    gap: '20px',
    margin: 0,
    padding: 0,
  },
  navItem: {
    cursor: 'pointer',
  },
  link: {
    color: '#00B4D8',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.3rem',
  },
};
