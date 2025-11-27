import React, { createContext, useState, useContext } from 'react';
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]); 

  const addToCart = (product) => {
    const cleanedPrice = parseFloat(product.price.replace(/[^\d.]/g, "") || 0);

    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.product_name, 
        price: cleanedPrice, 
        pharmacy: product.pharmacy_name,
        quantity: 1,
      }]);
    }
  };

  const incrementQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQty = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };
  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        incrementQty, 
        decrementQty, 
        removeItem,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};