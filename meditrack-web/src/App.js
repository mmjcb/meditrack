import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/nav-bar.js';
import Footer from './Components/footer.js';
import Home from './Pages/home.js';
import Contact from './Pages/contact.js';
import Search from './Pages/search.js';
import Profile from './Pages/profile.js';
import Cart from './Pages/cart.js';
import ProductView from './Pages/viewProduct.js';
import Login from './Pages/login.js';
import Register from './Pages/register.js';
import { AuthProvider } from './backend/AuthContext.js';
import { CartProvider } from './backend/CartContext.js';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> {/* <-- Add this route */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductView />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
