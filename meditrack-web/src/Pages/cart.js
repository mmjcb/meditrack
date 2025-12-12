import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash, FaTimes, FaTruck } from "react-icons/fa";
import { useCart } from '../backend/CartContext.js';
import { useAuth } from '../backend/AuthContext.js';
import { useNavigate } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { db } from '../backend/firebase.js';

const PRIMARY_COLOR = "#29ABE2"; 
const TEXT_COLOR = "#333";

export default function Cart() {
    const { cartItems, incrementQty, decrementQty, removeItem, cartID } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [selectedItems, setSelectedItems] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [pharmacyName, setPharmacyName] = useState("");

    useEffect(() => {
        const initialSelection = {};
        cartItems.forEach(item => { initialSelection[item.id] = true });
        setSelectedItems(initialSelection);
    }, [cartItems]);

    const toggleSelection = (itemId) => {
        setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);
    const selectedTotalPrice = selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);

   const handleCheckout = async () => {
    if (!user) {
        localStorage.setItem("guestCartRedirect", window.location.pathname);
        if (window.confirm("You need to log in before checkout. Go to login?")) {
            navigate("/login");
        }
        return;
    }

    if (selectedCartItems.length === 0) {
        alert("Select at least one item to checkout.");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/products/pharmacy_name?id=${selectedCartItems[0].id}`);
        if (!response.ok) throw new Error("Failed to fetch pharmacy info");
        const data = await response.json();
        setPharmacyName(data.name || "the pharmacy");
    } catch (err) {
        console.error(err);
        setPharmacyName("the pharmacy");
    }

    if (!cartID) {
        console.error("Cart ID is missing!");
        alert("Cannot process transaction: cart not found.");
        return;
    }

    try {
        const transactionRef = push(ref(db, "Transaction_History")); 
        const transactionId = transactionRef.key;
        const transactionDate = Date.now(); 

        await set(transactionRef, {
            transaction_id: transactionId,
            cart_id: cartID,  
            transaction_date: transactionDate
        });

  
    } catch (err) {
        alert("Failed to save transaction. Try again later.");
        return;
    }

    setShowModal(true);
};



    const closeModal = () => setShowModal(false);

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.cartHeaderWrapper}>
                <h1 style={styles.pageTitle}>My Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <p style={styles.emptyMessage}>Your cart is empty.</p>
            ) : (
                <div style={styles.mainContentGrid}>
                    <div style={styles.itemListContainer}>
                        {cartItems.map(item => (
                            <div key={item.id} style={styles.listItemCard}>
                                <input 
                                    type="checkbox" 
                                    checked={!!selectedItems[item.id]} 
                                    onChange={() => toggleSelection(item.id)} 
                                    style={styles.checkboxInput} 
                                />
                                <div style={styles.itemImagePlaceholder}></div>
                                <div style={styles.itemDetails}>
                                    <h3 style={styles.itemName}>{item.name}</h3>
                                    <p style={styles.itemPrice}>₱{item.price.toFixed(2)}</p>
                                </div>
                                <div style={styles.itemControls}>
                                    <button onClick={() => decrementQty(item.id)} style={styles.qtyBtn}><FaMinus /></button>
                                    <span style={styles.qtyText}>{item.quantity}</span>
                                    <button onClick={() => incrementQty(item.id)} style={styles.qtyBtn}><FaPlus /></button>
                                </div>
                                <button onClick={() => removeItem(item.id)} style={styles.removeBtn}><FaTrash /></button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.summaryContainer}>
                        <div style={styles.summaryCard}>
                            <h2 style={styles.summaryTitle}>Order Summary</h2>
                            <div style={styles.summaryDivider}></div>
                            {selectedCartItems.map(item => (
                                <div key={item.id} style={styles.tableRow}>
                                    <span style={styles.tableCol1}>{item.name}</span>
                                    <span style={styles.tableCol2}>{item.quantity}x</span>
                                    <span style={styles.tableCol3}>₱{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div style={styles.totalAndCheckout}>
                                <p style={styles.totalText}>Total: ₱{selectedTotalPrice.toFixed(2)}</p>
                                <button 
                                    style={styles.checkoutBtn} 
                                    disabled={selectedCartItems.length === 0} 
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button onClick={closeModal} style={styles.modalCloseBtn}><FaTimes /></button>
                        <FaTruck style={{ fontSize: "2rem", color: PRIMARY_COLOR, marginBottom: "15px" }} />
                        <h2>Order Ready for Pickup</h2>
                        <p>Your products are ready for pickup from <strong>{pharmacyName}</strong>.</p>
                        <p>Please prepare <strong>₱{selectedTotalPrice.toFixed(2)}</strong>.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
  pageWrapper: { 
    fontFamily: "'Poppins', sans-serif", 
    color: TEXT_COLOR, 
    padding: "60px 20px 20px 20px", // top, right, bottom, left
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box" 
  },
  cartHeaderWrapper: { 
    zIndex: 1000, 
    backgroundColor: PRIMARY_COLOR, 
    width: "100%",             
    display: "flex", 
    alignItems: "center", 
    justifyContent: "flex-start", 
    borderRadius: "50px", 
    padding: "0 30px",        
    height: "60px", 
    marginBottom: "50px", 
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "80px",
  },
  pageTitle: { fontSize: "1.8rem", fontWeight: "700", color: "#fff", margin: 0 },
  emptyMessage: { textAlign: "center", fontSize: "1.2rem", color: "#666", marginTop: "50px" },
  mainContentGrid: { 
    display: "grid", 
    gridTemplateColumns: "2.2fr 1fr", // slightly wider product list, balanced UI
    gap: "50px", // gap between product list and order summary
    width: "100%", 
    alignItems: "start" 
  },
  itemListContainer: { display: "flex", flexDirection: "column", gap: "20px", width: "100%" },
  listItemCard: { 
    width: "100%", 
    backgroundColor: "#fff", 
    padding: "14px 16px", 
    borderRadius: "12px", 
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)", 
    display: "grid", 
    gridTemplateColumns: "35px 70px 1fr auto auto", 
    gap: "12px", 
    alignItems: "center", 
    border: "1px solid #eee" 
  },
  checkboxInput: { transform: "scale(1.2)", cursor: "pointer" },
  itemImagePlaceholder: { width: "70px", height: "70px", borderRadius: "8px", backgroundColor: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center" },
  itemDetails: { minWidth: "140px" },
  itemName: { fontSize: "1.1rem", fontWeight: "600", marginBottom: "4px" },
  itemPrice: { fontWeight: "700", fontSize: "1rem", color: TEXT_COLOR },
  itemControls: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" },
  qtyBtn: { backgroundColor: "#fff", color: TEXT_COLOR, border: "1px solid #ddd", padding: "6px 10px", cursor: "pointer", borderRadius: "6px", fontSize: "0.9rem" },
  qtyText: { padding: "0 10px", fontWeight: "600", fontSize: "1rem" },
  removeBtn: { backgroundColor: "transparent", color: "#d9534f", border: "none", cursor: "pointer", fontSize: "1.1rem" },
  summaryContainer: { width: "100%" },
  summaryCard: { width: "100%", backgroundColor: "#fff", padding: "26px", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 3px 10px rgba(0,0,0,0.05)" },
  summaryTitle: { fontSize: "1.3rem", fontWeight: "700", marginBottom: "12px" },
  summaryDivider: { height: "1px", backgroundColor: "#eee", marginBottom: "18px" },
  tableRow: { display: "grid", gridTemplateColumns: "1fr 50px 80px", marginBottom: "8px" },
  tableCol1: { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
  tableCol2: { textAlign: "center" },
  tableCol3: { textAlign: "right", fontWeight: "700" },
  totalAndCheckout: { marginTop: "25px", paddingTop: "15px", borderTop: "1px solid #eee", textAlign: "right" },
  totalText: { fontSize: "1.25rem", fontWeight: "700", marginBottom: "15px" },
  checkoutBtn: { backgroundColor: PRIMARY_COLOR, color: "#fff", border: "none", borderRadius: "10px", padding: "14px 20px", cursor: "pointer", width: "100%", fontWeight: "600", fontSize: "1rem", transition: "0.3s" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 },
  modalContent: { backgroundColor: "#fff", borderRadius: "12px", padding: "28px 30px", width: "400px", maxHeight: "80vh", overflowY: "auto", textAlign: "center", position: "relative" },
  modalCloseBtn: { position: "absolute", top: "10px", right: "10px", background: "transparent", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#999" },
};
