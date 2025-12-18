import { NavLink } from "react-router-dom";
import logo from "../assets/meditrack-logo-long.png"; 
import { 
  FaHome, 
  FaSearch, 
  FaInfoCircle, 
  FaShoppingCart, 
  FaUser 
} from "react-icons/fa";

const FONT_FAMILY = "Poppins, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export default function Navbar() {
  return (
    <nav style={{ ...styles.navbar, fontFamily: FONT_FAMILY }}>
      <div style={styles.logoContainer}>
        <NavLink to="/">
          <img src={logo} alt="Logo" style={styles.logo} />
        </NavLink>
      </div>

      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <NavLink to="/" style={({ isActive }) => ({ ...styles.link, color: isActive ? '#0077B6' : '#00B4D8', fontFamily: FONT_FAMILY })}>
            <FaHome style={styles.icon} /> Home
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/search" style={({ isActive }) => ({ ...styles.link, color: isActive ? '#0077B6' : '#00B4D8', fontFamily: FONT_FAMILY })}>
            <FaSearch style={styles.icon} /> Search
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/contact" style={({ isActive }) => ({ ...styles.link, color: isActive ? '#0077B6' : '#00B4D8', fontFamily: FONT_FAMILY })}>
            <FaInfoCircle style={styles.icon} /> About
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/cart" style={({ isActive }) => ({ ...styles.link, color: isActive ? '#0077B6' : '#00B4D8', fontFamily: FONT_FAMILY })}>
            <FaShoppingCart style={styles.icon} /> Cart
          </NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/profile" style={({ isActive }) => ({ ...styles.link, color: isActive ? '#0077B6' : '#00B4D8', fontFamily: FONT_FAMILY })}>
            <FaUser style={styles.icon} /> Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding: '16px 40px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '15px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)', 
    backdropFilter: 'blur(15px) saturate(160%)', 
    WebkitBackdropFilter: 'blur(15px) saturate(160%)', 
    border: '1px solid rgba(255, 255, 255, 0.4)', 
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  logoContainer: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: '38px', 
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    gap: '28px', 
    margin: 0,
    padding: 0,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    fontWeight: '500', 
    fontSize: '1.05rem', 
    display: 'flex',
    alignItems: 'center',
    gap: '8px', 
    transition: 'color 0.2s ease',
  },
  icon: {
    fontSize: '1.2rem',
  }
};
