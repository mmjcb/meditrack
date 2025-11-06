import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/nav-bar'
import Home from './Pages/home'
import Contact from './Pages/contact'
import Search from './Pages/search'
import Profile from './Pages/profile'
import Cart from './Pages/cart'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  )
}

export default App
