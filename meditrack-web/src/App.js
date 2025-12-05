import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/nav-bar";
import Footer from "./Components/footer";
import Home from "./Pages/home";
import Contact from "./Pages/contact";
import Search from "./Pages/search";
import Profile from "./Pages/profile";
import Cart from "./Pages/cart";
import ProductView from "./Pages/viewProduct";

import { CartProvider } from "./backend/CartContext"; 
import Login from "./Pages/login";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductView />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;