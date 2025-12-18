import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash, FaTimes, FaTruck } from "react-icons/fa";
import { useCart } from '../backend/CartContext.js';
import { useAuth } from '../backend/AuthContext.js';
import { useNavigate } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { db } from '../backend/firebase.js';

const PRIMARY_COLOR = "#29ABE2"; 
const TEXT_COLOR = "#333";
const FONT_FAMILY = "'Poppins', sans-serif";

export default function Cart() {
    const { cartItems, incrementQty, decrementQty, removeItem, cartID } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [selectedItems, setSelectedItems] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [pharmacyName, setPharmacyName] = useState("");
    const [modalTotal, setModalTotal] = useState(0);
    
    // Dynamic width to match SearchBar logic exactly
    const [containerWidth, setContainerWidth] = useState("90%");

    useEffect(() => {
        const updateWidth = () => {
            const navbar = document.querySelector("nav");
            if (navbar) {
                // This value must match exactly the subtraction in SearchBar.js
                // Adjust 120 up or down if the alignment feels off by a few pixels
                const targetWidth = navbar.offsetWidth - 120;
                setContainerWidth(`${targetWidth}px`);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

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
            const data = await response.json();
            setPharmacyName(data.name || "the pharmacy");
        } catch (err) {
            setPharmacyName("the pharmacy");
        }

        if (!cartID) {
            alert("Cannot process transaction: cart not found.");
            return;
        }

        try {
            const transactionRef = push(ref(db, "Transaction_History"));
            const transactionId = transactionRef.key;
            await set(transactionRef, {
                transaction_id: transactionId,
                cart_id: cartID,
                transaction_date: Date.now(),
                total_amount: selectedTotalPrice,
                items: selectedCartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    subtotal: item.price * item.quantity
                }))
            });

            setModalTotal(selectedTotalPrice);
            selectedCartItems.forEach(item => removeItem(item.id));
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2500);
        } catch (err) {
            alert("Failed to save transaction.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        navigate("/profile?tab=CheckoutHistory");
    };

    return (
        <div style={{ ...styles.pageWrapper, width: containerWidth }}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                * { font-family: ${FONT_FAMILY} !important; }
                input[type="checkbox"] { accent-color: ${PRIMARY_COLOR}; }
                `}
            </style>

            <div style={styles.cartHeaderWrapper}>
                <h1 style={styles.pageTitle}>My Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <div style={styles.emptyContainer}>
                    <p style={styles.emptyMessage}>Your cart is empty.</p>
                    <button style={styles.shopNowBtn} onClick={() => navigate("/search")}>
                        Go Shopping
                    </button>
                </div>
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
                            <div style={styles.summaryItemsScroll}>
                                {selectedCartItems.map(item => (
                                    <div key={item.id} style={styles.tableRow}>
                                        <span style={styles.tableCol1}>{item.name}</span>
                                        <span style={styles.tableCol2}>{item.quantity}x</span>
                                        <span style={styles.tableCol3}>₱{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={styles.totalAndCheckout}>
                                <div style={styles.totalRow}>
                                    <span>Total</span>
                                    <span>₱{selectedTotalPrice.toFixed(2)}</span>
                                </div>
                                <button 
                                    style={{
                                        ...styles.checkoutBtn,
                                        opacity: selectedCartItems.length === 0 ? 0.6 : 1,
                                    }} 
                                    disabled={selectedCartItems.length === 0} 
                                    onClick={handleCheckout}
                                >
                                    Checkout Now
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
                        <FaTruck style={{ fontSize: "2.5rem", color: PRIMARY_COLOR, marginBottom: "10px" }} />
                        <h2 style={{ fontWeight: 700 }}>Order Ready!</h2>
                        <div style={styles.modalPriceTag}>Total: ₱{modalTotal.toFixed(2)}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    pageWrapper: { 
        paddingTop: "120px",      
        paddingBottom: "60px",
        margin: "0 auto",  
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        minHeight: "100vh"
    },
    cartHeaderWrapper: { 
        backgroundColor: PRIMARY_COLOR, 
        width: "100%",           
        display: "flex", 
        alignItems: "center", 
        borderRadius: "60px",    
        padding: "0 40px", 
        height: "65px",          
        marginBottom: "35px", 
        boxSizing: "border-box"
    },
    pageTitle: { fontSize: "16px", fontWeight: "600", color: "#fff", margin: 0 }, 
    emptyContainer: { textAlign: "center", padding: "100px 0" },
    emptyMessage: { fontSize: "1.2rem", color: "#888", marginBottom: "20px" },
    shopNowBtn: { 
        backgroundColor: PRIMARY_COLOR, color: "#fff", border: "none", 
        padding: "14px 40px", borderRadius: "50px", cursor: "pointer", fontWeight: "600", fontSize: "1rem" 
    },
    mainContentGrid: { 
        display: "grid", 
        gridTemplateColumns: "1fr 380px", // Slightly narrowed summary to match sidebar feel
        gap: "30px", 
        alignItems: "start",
        width: "100%"
    },
    itemListContainer: { display: "flex", flexDirection: "column", gap: "20px" },
    listItemCard: { 
        backgroundColor: "#fff", 
        padding: "20px", 
        borderRadius: "25px", // Slightly more squared to look modern
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)", 
        display: "grid", 
        gridTemplateColumns: "30px 100px 1fr auto auto", 
        gap: "25px", 
        alignItems: "center", 
        border: "1px solid #E5E7EB" 
    },
    checkboxInput: { width: "22px", height: "22px", cursor: "pointer" },
    itemImagePlaceholder: { width: "100px", height: "100px", borderRadius: "20px", backgroundColor: "#f8f9fa" },
    itemName: { fontSize: "1.05rem", fontWeight: "600", color: TEXT_COLOR, margin: 0 },
    itemPrice: { fontWeight: "700", color: PRIMARY_COLOR, fontSize: "1.1rem" },
    itemControls: { 
        display: "flex", alignItems: "center", gap: "15px", 
        backgroundColor: "#f8f9fa", padding: "8px 18px", 
        borderRadius: "50px" 
    },
    qtyBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center" },
    qtyText: { fontWeight: "600", minWidth: "20px", textAlign: "center" },
    removeBtn: { background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "1.2rem" },
    summaryContainer: { position: "sticky", top: "140px" }, 
    summaryCard: { 
        backgroundColor: "#fff", 
        padding: "30px", 
        borderRadius: "25px", 
        border: "1px solid #E5E7EB", 
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)" 
    },
    summaryTitle: { fontSize: "1.2rem", fontWeight: "700", marginBottom: "20px", color: "#111827" },
    summaryDivider: { height: "1px", backgroundColor: "#F3F4F6", marginBottom: "20px" },
    summaryItemsScroll: { maxHeight: "250px", overflowY: "auto", marginBottom: "20px" },
    tableRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.95rem" },
    tableCol1: { flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "10px" },
    tableCol3: { fontWeight: "600" },
    totalAndCheckout: { borderTop: "2px dashed #F3F4F6", paddingTop: "20px" },
    totalRow: { fontSize: "1.3rem", fontWeight: "700", marginBottom: "20px", display: "flex", justifyContent: "space-between" },
    checkoutBtn: { 
        backgroundColor: PRIMARY_COLOR, color: "#fff", border: "none", 
        borderRadius: "12px", padding: "16px", width: "100%", fontWeight: "600", fontSize: "1.1rem", cursor: "pointer",
        transition: "0.2s"
    },
    modalOverlay: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(4px)" },
    modalContent: { backgroundColor: "#fff", borderRadius: "40px", padding: "50px 40px", width: "420px", textAlign: "center", position: "relative" },
    modalCloseBtn: { position: "absolute", top: "25px", right: "25px", background: "transparent", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#ccc" },
    modalPriceTag: { marginTop: "25px", backgroundColor: "#f0faff", padding: "15px", borderRadius: "50px", color: PRIMARY_COLOR, fontWeight: "700", fontSize: "1.3rem", border: `1px dashed ${PRIMARY_COLOR}` }
};