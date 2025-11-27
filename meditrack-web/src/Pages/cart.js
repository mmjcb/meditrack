import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { useCart } from '../backend/CartContext';

export default function Cart() {
    const { 
        cartItems, 
        incrementQty, 
        decrementQty, 
        removeItem, 
    } = useCart();

    const [selectedItems, setSelectedItems] = useState({});

    useEffect(() => {
        const initialSelection = cartItems.reduce((acc, item) => {
            acc[item.id] = selectedItems[item.id] !== false; 
            return acc;
        }, {});
        setSelectedItems(initialSelection);
    }, [cartItems]); 

    const toggleSelection = (itemId) => {
        setSelectedItems(prevSelected => ({
            ...prevSelected,
            [itemId]: !prevSelected[itemId],
        }));
    };
    
    const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);

    const selectedTotalPrice = selectedCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div style={styles.pageWrapper}>
            <h1 style={styles.pageTitle}>My Cart</h1> 
            
            {cartItems.length === 0 ? (
                <p style={styles.emptyMessage}>Your cart is empty.</p>
            ) : (
                <div style={styles.mainContentGrid}>
                    
                    <div style={styles.itemListContainer}>
                        {cartItems.map((item) => (
                            <div key={item.id} style={styles.listItemCard}>
                                
                                <div style={styles.checkboxPlaceholder}>
                                    <input 
                                        type="checkbox" 
                                        checked={!!selectedItems[item.id]} 
                                        onChange={() => toggleSelection(item.id)} 
                                        style={styles.checkboxInput} 
                                    />
                                </div>
                                
                                <div style={styles.itemImagePlaceholder}>
                                     
                                </div>

                                <div style={styles.itemDetails}>
                                    <h3 style={styles.itemName}>{item.name}</h3>
                                    <p style={styles.itemPrice}>₱{item.price.toFixed(2)}</p>
                                </div>

                                <div style={styles.itemControls}>
                                    <div style={styles.quantityControl}>
                                        <button onClick={() => decrementQty(item.id)} style={styles.qtyBtn}>
                                            <FaMinus />
                                        </button>
                                        <span style={styles.qtyText}>{item.quantity}</span>
                                        <button onClick={() => incrementQty(item.id)} style={styles.qtyBtn}>
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>

                                <button onClick={() => removeItem(item.id)} style={styles.removeBtn}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.summaryContainer}>
                        <div style={styles.summaryCard}>
                            <h2 style={styles.summaryTitle}>Order Summary</h2>
                            <div style={styles.summaryDivider}></div>

                            <div style={styles.summaryTable}>
                                <div style={styles.tableRowHeader}>
                                    <span style={styles.tableCol1}>Products</span>
                                    <span style={styles.tableCol2}>No.</span> 
                                    <span style={styles.tableCol3}>Price</span>
                                </div>
                                
                                {selectedCartItems.map((item) => (
                                    <div key={item.id + '-summary'} style={styles.tableRow}>
                                        <span style={styles.tableCol1}>{item.name}</span>
                                        <span style={styles.tableCol2}>{item.quantity}x</span>
                                        <span style={styles.tableCol3}>₱{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}

                            </div>
                            
                            <div style={styles.totalAndCheckout}>
                                <p style={styles.totalText}>Total: ₱{selectedTotalPrice.toFixed(2)}</p>
                                <button style={styles.checkoutBtn} disabled={selectedCartItems.length === 0}>
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const PRIMARY_COLOR = "#00B4D8";
const TEXT_COLOR = "#333";

const styles = {
    pageWrapper: {
        fontFamily: "Arial, sans-serif",
        color: TEXT_COLOR,
        padding: "80px 40px 40px 40px",
        maxWidth: "1200px",
        margin: "0 auto",
    },

    pageTitle: {
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "30px",
    },

    emptyMessage: {
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#666",
    },

    mainContentGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 350px", 
        gap: "70px",
        width: "100%",
        alignItems: "start",
    },

    itemListContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "100%",
    },

    listItemCard: {
        width: "100%",
        backgroundColor: "#fff",
        padding: "16px 18px",
        borderRadius: "12px",
        boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
        display: "grid",
        gridTemplateColumns: "35px 70px 1fr auto auto", // tighter but still structured
        gap: "12px",                                     // narrowed gaps
        alignItems: "center",
        border: "1px solid #eee",
    },

    checkboxPlaceholder: {
        display: "flex",
        justifyContent: "center",
    },

    checkboxInput: {
        transform: "scale(1.2)",
        cursor: "pointer",
    },

    itemImagePlaceholder: {
        width: "80px",
        height: "60px",
        borderRadius: "8px",
        backgroundColor: "#ffffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    itemDetails: {
        minWidth: "150px",
    },

    itemName: {
        fontSize: "1.1rem",
        fontWeight: "600",
        marginBottom: "4px",
    },

    itemPrice: {
        fontWeight: "700",
        fontSize: "1rem",
        color: TEXT_COLOR,
    },

    itemControls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    quantityControl: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ddd",
        borderRadius: "6px",
        overflow: "hidden",
    },

    qtyBtn: {
        backgroundColor: "#fff",
        color: TEXT_COLOR,
        border: "none",
        padding: "6px 10px",
        cursor: "pointer",
    },

    qtyText: {
        padding: "0 12px",
        fontWeight: "600",
    },

    removeBtn: {
        backgroundColor: "transparent",
        color: "#d9534f",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
    },

    summaryContainer: {
        width: "100%",
        marginLeft: "10px",  // slight spacing to breathe from left
    },

    summaryCard: {
        width: "100%",
        backgroundColor: "#fff",
        padding: "22px 24px",
        borderRadius: "12px",
        border: "1px solid #eee",
        boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    },

    summaryTitle: {
        fontSize: "1.3rem",
        fontWeight: "700",
        marginBottom: "12px",
    },

    summaryDivider: {
        height: "1px",
        backgroundColor: "#eee",
        marginBottom: "20px",
    },

    summaryTable: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontSize: "0.95rem",
    },

    tableRowHeader: {
        display: "grid",
        gridTemplateColumns: "1fr 50px 80px",
        fontWeight: "700",
    },

    tableRow: {
        display: "grid",
        gridTemplateColumns: "1fr 50px 80px",
    },

    tableCol1: { overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
    tableCol2: { textAlign: "center" },
    tableCol3: { textAlign: "right", fontWeight: "700" },

    totalAndCheckout: {
        marginTop: "25px",
        paddingTop: "15px",
        borderTop: "1px solid #eee",
        textAlign: "right",
    },

    totalText: {
        fontSize: "1.25rem",
        fontWeight: "700",
        marginBottom: "15px",
    },

    checkoutBtn: {
        backgroundColor: PRIMARY_COLOR,
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        padding: "14px 20px",
        cursor: "pointer",
        width: "100%",
        fontWeight: "600",
        fontSize: "1rem",
    },
};