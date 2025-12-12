import React, { createContext, useState, useContext, useEffect } from "react";
import { db } from "./firebase.js";
import { ref, set, push, get, update, remove } from "firebase/database";
import { useAuth } from "./AuthContext.js";


export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartID, setCartID] = useState(null);

const addToCart = async (product) => {
  const cleanedPrice = parseFloat(product.price.replace(/[^\d.]/g, "") || 0);
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    setCartItems(cartItems.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  } else {
    setCartItems([...cartItems, {
      id: product.id,
      name: product.product_name,
      price: cleanedPrice,
      pharmacy: product.pharmacy_name,
      quantity: 1,
    }]);
  }

  if (!user || !cartID) return;

  try {
    const medicineRef = ref(db, `Medicine/${product.id}`);
    await set(medicineRef, {
      medicine_id: product.id,
      product_name: product.product_name,
      price: cleanedPrice,
      pharmacy_name: product.pharmacy_name,
      pharmacy_logo: product.pharmacy_logo || "",
      pharmacy_location: product.pharmacy_location || "",
      manufacturer: product.manufacturer || "",
      availability: product.availability || "",
      category: product.category_name || "",
      category_icon: product.category_icon || "",
      product_image: product.product_image || "",
      overview: product.overview || "",
      usage_and_benefits: product.usage || "",
      how_it_works: product.how_it_works || "",
      side_effects: product.side_effects || ""
    });

    const cartItemRef = ref(db, `Cart_Item/${cartID}_${product.id}`);
    const quantity = existingItem ? existingItem.quantity + 1 : 1;
    await set(cartItemRef, {
      cart_item_id: `${cartID}_${product.id}`,
      cart_id: cartID,
      medicine_id: product.id,
      quantity,
      cost_unit: cleanedPrice,
      total_price: cleanedPrice * quantity
    });

    const cartRef = ref(db, `Cart/${cartID}`);
    update(cartRef, { last_updated: Date.now() });

  } catch (err) {
    console.error("Failed to sync product with DB:", err);
  }
};

  const incrementQty = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQty = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const removeItem = (id) => {
  setCartItems(prev => prev.filter(item => item.id !== id));

  if (user && cartID) {
    const cartItemRef = ref(db, `Cart_Item/${cartID}_${id}`);
    remove(cartItemRef)
      .then(() => {
        console.log(`Cart_Item ${cartID}_${id} deleted from DB`);

        const cartRef = ref(db, `Cart/${cartID}`);
        update(cartRef, { last_updated: Date.now() });
      })
      .catch(err => console.error("Failed to delete Cart_Item:", err));
  }
};

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const mergeGuestCart = (guestCart) => {
    guestCart.forEach(guestItem => {
      const existingItem = cartItems.find(item => item.id === guestItem.id);
      if (existingItem) {
        setCartItems(prev =>
          prev.map(item =>
            item.id === guestItem.id
              ? { ...item, quantity: item.quantity + guestItem.quantity }
              : item
          )
        );
      } else {
        setCartItems(prev => [...prev, guestItem]);
      }
    });
  };

  useEffect(() => {
    if (!user) return;

    const getOrCreateCart = async () => {
      const cartRef = ref(db, "Cart");
      const snapshot = await get(cartRef);
      let userCartID = null;

      if (snapshot.exists()) {
        const carts = snapshot.val();
        for (const id in carts) {
          if (carts[id].user_id === user.uid && carts[id].status === "active") {
            userCartID = id;
            break;
          }
        }
      }

      if (!userCartID) {
        const newCartRef = push(cartRef);
        const timestamp = Date.now();
        await set(newCartRef, {
          user_id: user.uid,
          time_added: timestamp,
          last_updated: timestamp,
          status: "active"
        });
        userCartID = newCartRef.key;
      }

      setCartID(userCartID);
    };

    getOrCreateCart();
  }, [user]);

  useEffect(() => {
    if (!user || !cartID) return;

    const timestamp = Date.now();

    const cartRef = ref(db, `Cart/${cartID}`);
    update(cartRef, { last_updated: timestamp });

    cartItems.forEach(async item => {
      const cartItemRef = ref(db, `Cart_Item/${cartID}_${item.id}`);
      await set(cartItemRef, {
        cart_id: cartID,
        medicine_id: item.id,
        quantity: item.quantity,
        cost_unit: item.price,
        total_price: item.price * item.quantity
      });
    });
  }, [cartItems, user, cartID]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      incrementQty,
      decrementQty,
      removeItem,
      totalPrice,
      mergeGuestCart,
      cartID
    }}>
      {children}
    </CartContext.Provider>
  );
};
