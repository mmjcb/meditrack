import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <ul style={styles.navList}>
        <li style={styles.navItem}>
          <NavLink to="/" style={styles.link}>Home</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/search" style={styles.link}>Search</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/contact" style={styles.link}>Contacts</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/cart" style={styles.link}>Cart</NavLink>
        </li>
        <li style={styles.navItem}>
          <NavLink to="/profile" style={styles.link}>Profile</NavLink>
        </li>
      </ul>
    </nav>
  )
}

const styles = {
  navbar: {
    backgroundColor: '#282c34',
    padding: '10px 20px',
  },
  navList: {
    display: 'flex',
    listStyle: 'none',
    justifyContent: 'space-around',
    margin: 0,
    padding: 0,
  },
  navItem: {
    cursor: 'pointer',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}
