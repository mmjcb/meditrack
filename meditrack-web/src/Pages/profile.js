import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../backend/AuthContext.js';
import { ref, get, remove, set } from "firebase/database";
import { db } from '../backend/firebase.js';
import { useCart } from '../backend/CartContext.js';
import apiDataset from '../data/api-dataset.json';

// --- SVG ICONS ---
const UserCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L452.9 452.9c8.5 8.5 8.5 22.1 0 30.6l-3.5 3.5c-8.5 8.5-22.1 8.5-30.6 0L336 348.7c-34.4 25.2-76.8 40-122.7 40-108.9 0-197.6-88.7-197.6-197.6S104.9 0 213.8 0s197.6 88.7 197.6 197.6zM413.8 208c0-110.5-89.9-197.6-197.6-197.6-110.5 0-197.6 89.9-197.6 197.6S102.3 405.6 210.8 405.6c110.5 0 197.6-89.9 197.6-197.6zM256 128c-44.2 0-80 35.8-80 80s35.8 80 80 80 80-35.8 80-80-35.8-80-80-80z"/>
    </svg>
);

const ChevronRightIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
        <path d="M224.3 273.9c-2.4 2.4-5.5 3.5-8.5 3.5s-6.1-1.2-8.5-3.5L128 178.7 51.7 273.9c-2.4 2.4-5.5 3.5-8.5 3.5s-6.1-1.2-8.5-3.5l-2.4-2.4c-4.7-4.7-4.7-12.3 0-17l89.6-107.5c2.4-2.4 5.5-3.5 8.5-3.5s6.1 1.2 8.5 3.5l89.6 107.5c4.7 4.7 4.7 12.3 0 17l-2.4 2.4z"/>
    </svg>
);

// Icon for Logout Modal (FaSignOutAlt equivalent)
const LogoutArrowIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64zm325.3 192l-40.7-40.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L423.4 272H192c-8.8 0-16 7.2-16 16s7.2 16 16 16H423.4l-29.3 29.3c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0l40.7-40.7c6.2-6.2 6.2-16.4 0-22.6z"/>
    </svg>
);

// CSS property definitions for scrollbar hiding (Firefox/IE/Edge only via inline styles)
const scrollbarHiddenProps = {
    msOverflowStyle: 'none', // IE and Edge
    scrollbarWidth: 'none', // Firefox
};

// --- STYLES DEFINITION (Simplified for brevity, assuming standard imports) ---
const styles = {
    primaryBlue: '#29ABE2',
    lightGray: '#f7f7f7',
    darkText: '#202020',
    white: '#fff',
    dangerRed: '#E74C3C',
    successGreen: '#2ECC71',

    mainContainer: {
        minHeight: 'calc(100vh - 160px)', 
        backgroundColor: '#fff',
        paddingTop: '150px',         
        paddingBottom: '30px',      
    },

    contentWrapper: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '1400px',
        margin: '0 auto',
        gap: '30px',
        flexWrap: 'wrap',
    },

    sidebar: {
        flex: '0 0 280px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        padding: '20px 0',
        height: 'fit-content',
    },

    userInfo: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 20px 20px 20px',
        borderBottom: `1px solid #f7f7f7`,
        marginBottom: '10px',
    },
    userIcon: {
        width: '60px',
        height: '60px',
        fill: '#e0e0e0',
        borderRadius: '50%',
        marginBottom: '10px',
        border: `2px solid #e0e0e0`,
    },
    username: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#202020',
        textAlign: 'center', // Added for better display
        wordBreak: 'break-word', // Handle long names/emails
    },
    menuItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 20px',
        fontSize: '16px',
        fontWeight: '500',
        color: '#202020',
        cursor: 'pointer',
        transition: '0.2s',
    },
    activeMenuItem: {
        backgroundColor: '#f7f7f7',
        color: '#29ABE2',
        borderLeft: `3px solid #29ABE2`,
    },
    logoutItem: {
        color: '#E74C3C',
        marginTop: '10px',
        borderTop: `1px solid #f7f7f7`,
        paddingTop: '10px',
    },
    chevronIcon: {
        width: '14px',
        height: '14px',
        fill: 'currentColor',
        opacity: 0.5,
    },

    contentArea: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        padding: '30px',
        minWidth: '300px',
        minHeight: '300px',
    },
    contentHeader: {
        fontSize: '24px',
        fontWeight: '600',
        color: '#202020',
        paddingBottom: '10px',
        borderBottom: `1px solid #333`,
        marginBottom: '30px',
    },
    underDevelopmentText: {
        fontSize: '20px',
        color: '#333',
        marginTop: '50px',
        fontStyle: 'italic',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        textAlign: 'center',
    },
    
    checkoutListContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '10px',
        ...scrollbarHiddenProps
    },
    reservationListContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '10px',
        alignContent: 'flex-start',
        ...scrollbarHiddenProps
    },
};

// --- Custom Components ---

const MenuItem = ({ name, isActive, onClick, isLogout = false }) => (
    <div
        style={{
            ...styles.menuItem,
            ...(isActive ? styles.activeMenuItem : {}),
            ...(isLogout ? styles.logoutItem : {}),
        }}
        onClick={onClick}
    >
        <span>{name}</span>
        <ChevronRightIcon style={{ ...styles.chevronIcon, opacity: isLogout ? 0 : 0.5 }} />
    </div>
);

const StyledAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    const backgroundColor = type === 'success' ? styles.successGreen : styles.dangerRed;
    
    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 25px',
            backgroundColor: backgroundColor,
            color: styles.white,
            borderRadius: '5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            minWidth: '250px',
            fontWeight: '600'
        }}>
            {message}
            <button 
                onClick={onClose} 
                style={{
                    marginLeft: '20px',
                    background: 'none',
                    border: 'none',
                    color: styles.white,
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    opacity: 0.8
                }}
            >&times;</button>
        </div>
    );
};

const Modal = ({ title, message, isOpen, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", useLogoutStyle = false }) => {
    if (!isOpen) return null;

    // Use specific styles for the logout modal design (MATCHES PREVIOUS REQUEST)
    if (useLogoutStyle) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: styles.white,
                    padding: '40px 30px', 
                    borderRadius: '15px', 
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)', 
                    maxWidth: '380px', 
                    width: '90%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                }}>
                    {/* Close Button (X icon) */}
                    <button 
                        onClick={onCancel} 
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            color: '#ccc',
                            cursor: 'pointer',
                        }}
                    >&times;</button>

                    {/* Icon Container */}
                    <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: '#FDECEC', 
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '15px',
                    }}>
                        <LogoutArrowIcon style={{ 
                            width: '28px', 
                            height: '28px', 
                            fill: styles.dangerRed 
                        }} />
                    </div>

                    <h3 style={{ 
                        fontSize: '24px', 
                        fontWeight: '700', 
                        color: styles.darkText, 
                        marginBottom: '5px' 
                    }}>
                        {title}
                    </h3>
                    
                    <p style={{ 
                        marginBottom: '30px', 
                        fontSize: '15px', 
                        color: '#666' 
                    }}>
                        {message}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px', width: '100%' }}>
                        {/* Cancel Button (Light Style) */}
                        <button
                            onClick={onCancel}
                            style={{
                                padding: '10px 20px',
                                border: `1px solid #ddd`, 
                                backgroundColor: styles.white,
                                color: styles.darkText,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                flex: 1,
                                fontWeight: '600',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f7f7f7'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.white}
                        >
                            {cancelText}
                        </button>
                        
                        {/* Logout Button (Red Style) */}
                        <button
                            onClick={onConfirm}
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                backgroundColor: styles.dangerRed, 
                                color: styles.white,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                flex: 1,
                                fontWeight: '600',
                                boxShadow: '0 4px 8px rgba(231, 76, 60, 0.3)', 
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C0392B'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.dangerRed}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default Modal Style (kept for non-logout confirmations if needed)
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: styles.white,
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center'
            }}>
                <h3 style={{ borderBottom: `1px solid ${styles.lightGray}`, paddingBottom: '10px', marginBottom: '20px', color: styles.darkText }}>{title}</h3>
                <p style={{ marginBottom: '30px', fontSize: '16px', color: styles.darkText }}>{message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '10px 20px',
                            border: `1px solid ${styles.primaryBlue}`,
                            backgroundColor: styles.white,
                            color: styles.primaryBlue,
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            backgroundColor: styles.dangerRed,
                            color: styles.white,
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flex: 1
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Sidebar Component (Extracted for better readability) ---
const ProfileSidebar = ({ accountInfo, activeMenu, handleNavigation, handleLogout }) => (
    <div style={styles.sidebar}>
        <div style={styles.userInfo}>
            <UserCircleIcon style={styles.userIcon} />
            <span style={styles.username}>
                {/* Displays the most relevant name/username/email in the sidebar */}
                {accountInfo.username || accountInfo.firstName || accountInfo.email}
            </span>
        </div>

        <MenuItem 
            name="Account Information" 
            isActive={activeMenu === 'AccountInformation'} 
            onClick={() => handleNavigation('AccountInformation')} 
        />
        <MenuItem 
            name="Checkout History" 
            isActive={activeMenu === 'CheckoutHistory'} 
            onClick={() => handleNavigation('CheckoutHistory')} 
        />
        <MenuItem 
            name="My Reservations" 
            isActive={activeMenu === 'Reserve'} 
            onClick={() => handleNavigation('Reserve')} 
        />
        <MenuItem 
            name="Notifications" 
            isActive={activeMenu === 'Notifications'} 
            onClick={() => handleNavigation('Notifications')} 
        />
        <MenuItem 
            name="Settings" 
            isActive={activeMenu === 'Settings'} 
            onClick={() => handleNavigation('Settings')} 
        />
        <MenuItem 
            name="Help" 
            isActive={activeMenu === 'Help'} 
            onClick={() => handleNavigation('Help')} 
        />
        <MenuItem 
            name="FAQs" 
            isActive={activeMenu === 'FAQs'} 
            onClick={() => handleNavigation('FAQs')} 
        />
        
        <MenuItem 
            name="Logout" 
            isLogout={true}
            onClick={handleLogout} 
        />
    </div>
);


// --- Main Profile Component ---
export default function Profile() {
    const [activeMenu, setActiveMenu] = useState('AccountInformation');
    const [transactions, setTransactions] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [modal, setModal] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        onConfirm: () => {},
        useLogoutStyle: false 
    });
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addToCart } = useCart();

    // --- Account Info State ---
    const [accountInfo, setAccountInfo] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await set(ref(db, `Users/${user.uid}`), {
                ...accountInfo,
                email: user.email // keep email unchanged
            });
            // Update the local state with the saved data (optional, but good practice)
            setAccountInfo(prev => ({ ...prev })); 
            showAlert("Account information updated successfully.", 'success');
        } catch (err) {
            console.error("Failed to update account info:", err);
            showAlert("Failed to update account information. Try again.", 'danger');
        } finally {
            setIsSaving(false);
        }
    };
    
    // Function to show alert
    const showAlert = (message, type = 'success') => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: '', type: '' }), 3000);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab) setActiveMenu(tab);
    }, [location.search]);

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);


    // --- Transaction/Reservation Fetching useEffects (Unchanged) ---
    useEffect(() => {
        if (activeMenu !== 'CheckoutHistory' || !user) return;

        const fetchTransactions = async () => {
            try {
                const cartSnap = await get(ref(db, "Cart"));
                const cartsData = cartSnap.val() || {};
                const userCartIDs = Object.entries(cartsData)
                    .filter(([, cart]) => cart.user_id === user.uid)
                    .map(([cartId]) => cartId);

                if (userCartIDs.length === 0) {
                    setTransactions([]);
                    return;
                }

                const txSnap = await get(ref(db, "Transaction_History"));
                const txData = txSnap.val() || {};
                const userTransactions = Object.values(txData)
                    .filter(tx => userCartIDs.includes(tx.cart_id));

                if (userTransactions.length === 0) {
                    setTransactions([]);
                    return;
                }

                const medSnap = await get(ref(db, "Medicine"));
                const medicineData = medSnap.val() || {};
                

                const enrichedTransactions = userTransactions.map(tx => {
                    const enrichedItems = tx.items?.map(item => {
                        const med = medicineData[String(item.id)]; 
                        return {
                            ...item,
                            product_image: med?.category_icon || "https://via.placeholder.com/150"
                        };
                    }) || [];

                    return {
                        ...tx,
                        items: enrichedItems
                    };
                });

                setTransactions(enrichedTransactions);

            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            }
        };

        fetchTransactions();

    }, [activeMenu, user]);

    useEffect(() => {
        if (activeMenu !== 'Reserve' || !user) return;

        const fetchReservations = async () => {
            try {
                const resSnap = await get(ref(db, "Reservation"));
                const resData = resSnap.val() || {};

                const userReservations = Object.entries(resData) // Use entries to get the key (reservation_id)
                    .filter(([, res]) => res.user_id === user.uid)
                    .map(([id, res]) => {

                        const med = apiDataset.find(item => item.id === res.medicine_id);

                        return {
                            ...res,
                            reservation_id: id, // Attach ID to reservation object
                            reservation_date: new Date(res.reservation_date),
                            medicine_name: med?.product_name || "Unknown",
                            category_icon: med?.category_icon || "https://via.placeholder.com/50",
                            price: med?.price ? Number(med.price.replace(/[^0-9.-]+/g, "")) : 0
                        };
                    })
                    .sort((a, b) => b.reservation_date - a.reservation_date);

                setReservations(userReservations);

            } catch (err) {
                console.error("Failed to fetch reservations:", err);
                setReservations([]);
            }
        };

        fetchReservations();
    }, [activeMenu, user]);


    const handleNavigation = (menuName) => setActiveMenu(menuName);

    const handleLogout = () => {
        setModal({
            isOpen: true,
            title: "Logout", // Matches new modal title
            message: "Are you sure you want to logout of your account?",
            confirmText: "Logout", 
            cancelText: "Cancel",
            useLogoutStyle: true, // Use the new, customized style
            onConfirm: async () => {
                setModal({ ...modal, isOpen: false });
                try {
                    await logout();
                    navigate("/login");
                } catch (err) {
                    console.error("Logout failed:", err);
                    showAlert("Failed to log out. Please try again.", 'danger');
                }
            },
            onCancel: () => setModal({ ...modal, isOpen: false })
        });
    };

    if (!user) return null;

    const renderContent = () => {
        switch (activeMenu) {

            case 'AccountInformation':
                // Helper function to safely extract initials
                const getInitials = (first, last) => {
                    const firstInitial = first ? first.charAt(0).toUpperCase() : '';
                    const lastInitial = last ? last.charAt(0).toUpperCase() : '';
                    return `${firstInitial}${lastInitial}`;
                };

                const userInitials = getInitials(accountInfo.firstName, accountInfo.lastName);

                // Define common styles for re-use
                const inputStyle = { 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: '1px solid #ddd', 
                    fontSize: '16px',
                    width: '100%',
                    boxSizing: 'border-box'
                };
                const disabledInputStyle = { 
                    ...inputStyle, 
                    backgroundColor: '#f5f5f5', 
                    color: '#888' 
                };
                const labelStyle = { 
                    marginBottom: '5px', 
                    fontWeight: '600', 
                    color: '#333'
                };

                return (
                    <>
                        <h2 style={{ ...styles.contentHeader, borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                            Account Information
                        </h2>
                        
                        {/* Master Container: Uses flex to split the content area into Left (Profile) and Right (Inputs) */}
                        <div style={{ display: 'flex', gap: '40px', maxWidth: '900px', padding: '0 10px' }}>
                            
                            {/* 1. 📸 Left Column: Profile Picture & Name */}
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '15px', 
                                padding: '20px',
                                minWidth: '200px',
                                backgroundColor: '#fff', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}>
                                
                                {/* Dynamic Avatar Placeholder */}
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    backgroundColor: '#29ABE2', 
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '40px',
                                    color: '#fff', 
                                    fontWeight: 'bold',
                                    marginBottom: '5px'
                                }}>
                                    {userInitials || '👤'} 
                                </div>

                                {/* User Full Name Display */}
                                <div style={{ fontSize: '20px', fontWeight: '700', color: '#222', textAlign: 'center' }}>
                                    {accountInfo.firstName || 'Guest'} {accountInfo.lastName}
                                </div>

                                {/* Username Display */}
                                {accountInfo.username && (
                                    <div style={{ 
                                        fontSize: '16px', 
                                        fontWeight: '500', 
                                        color: '#666', 
                                        textAlign: 'center',
                                        marginTop: '-10px', 
                                        marginBottom: '10px'
                                    }}>
                                        @{accountInfo.username}
                                    </div>
                                )}
                                {/* End Username Display */}


                                {/* Button to handle photo upload/change */}
                                <button
                                    // onClick={handlePhotoChange} 
                                    style={{
                                        padding: '8px 15px',
                                        backgroundColor: '#fff',
                                        color: '#29ABE2',
                                        border: '1px solid #29ABE2',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        width: '100%',
                                        marginTop: '5px'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#29ABE2'; e.currentTarget.style.color = '#fff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#29ABE2'; }}
                                >
                                    Upload/Change Photo
                                </button>
                            </div>

                            {/* 2. Right Column: Form Inputs */}
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '25px', 
                                flex: 1
                            }}>
                                
                                {/* First Name / Last Name Row */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {/* First Name */}
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <label style={labelStyle}>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={accountInfo.firstName}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* Last Name */}
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <label style={labelStyle}>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={accountInfo.lastName}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Username (full width) */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={labelStyle}>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={accountInfo.username}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Email / Phone Number Row */}
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    {/* Email */}
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <label style={labelStyle}>Email (Cannot be changed)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={accountInfo.email}
                                            disabled
                                            style={disabledInputStyle}
                                        />
                                    </div>
                                    
                                    {/* Phone Number */}
                                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <label style={labelStyle}>Phone Number</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={accountInfo.phone}
                                            onChange={handleChange}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Address (full width) */}
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={labelStyle}>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={accountInfo.address}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    style={{
                                        padding: '12px 30px', 
                                        backgroundColor: isSaving ? '#50C8F5' : '#29ABE2', 
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: isSaving ? 'default' : 'pointer',
                                        fontWeight: '600',
                                        marginTop: '15px',
                                        maxWidth: '250px', 
                                        alignSelf: 'flex-start',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </>
                );


            case 'CheckoutHistory':
            return (
                <>
                <h2 style={styles.contentHeader}>Checkout History</h2>
                {transactions.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>No transactions found.</p>
                ) : (
                    <div style={styles.checkoutListContainer}> 
                        {transactions
                            .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))
                            .map(tx => (
                            <div key={tx.transaction_id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '15px 20px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                backgroundColor: '#fff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }}>
                                <div style={{ marginBottom: '10px', fontWeight: '600', color: '#202020' }}>
                                {new Date(tx.transaction_date).toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {tx.items?.map(item => (
                                    <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: '1px solid #f0f0f0',
                                    borderRadius: '5px',
                                    backgroundColor: '#fafafa'
                                    }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <img
                                        src={item.product_image || 'https://via.placeholder.com/50'}
                                        alt={item.name}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                        />
                                        <span style={{ fontWeight: '500', color: '#202020' }}>
                                        {item.name} - {item.quantity} x ₱{item.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <span style={{ fontWeight: '600', color: '#29ABE2' }}>₱{item.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', alignItems: 'center' }}>
                                <button style={{
                                    padding: '5px 12px',
                                    backgroundColor: '#fff',
                                    border: '1px solid #29ABE2',
                                    borderRadius: '5px',
                                    color: '#29ABE2',
                                    cursor: 'pointer'
                                }}>Details</button>

                                <span style={{ fontWeight: '600', color: '#29ABE2' }}>Total: ₱{tx.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </>
            );
            case 'Reserve':
                const handleRemoveReservation = async (reservationId) => {
                    setModal({
                        isOpen: true,
                        title: "Remove Reservation",
                        message: "Are you sure you want to remove this reservation?",
                        confirmText: "Yes, Remove",
                        useLogoutStyle: false, // Use the default style for other confirmations
                        onConfirm: async () => {
                            setModal({ ...modal, isOpen: false });
                            try {
                                await remove(ref(db, `Reservation/${reservationId}`));
                                setReservations(prev => prev.filter(res => res.reservation_id !== reservationId));
                                showAlert("Reservation removed successfully.", 'success');
                            } catch (err) {
                                console.error("Failed to remove reservation:", err);
                                showAlert("Failed to remove reservation. Please try again.", 'danger');
                            }
                        },
                        onCancel: () => setModal({ ...modal, isOpen: false })
                    });
                };

                const handleAddReservationToCart = async (res) => {
                    if (!user) return;

                    const product = {
                        id: res.medicine_id,
                        product_name: res.medicine_name,
                        price: res.price.toString(),
                        pharmacy_name: res.pharmacy_name || "Default Pharmacy",
                        pharmacy_logo: res.pharmacy_logo || "",
                        pharmacy_location: res.pharmacy_location || "",
                        manufacturer: res.manufacturer || "",
                        availability: res.availability || "",
                        category_name: res.category_name || "",
                        category_icon: res.category_icon,
                        product_image: res.category_icon,
                        overview: res.overview || "",
                        usage: res.usage || "",
                        how_it_works: res.how_it_works || "",
                        side_effects: res.side_effects || ""
                    };

                    addToCart(product);

                    showAlert(`${res.medicine_name} added to cart.`, 'success');

                    try {
                        await remove(ref(db, `Reservation/${res.reservation_id}`));
                        setReservations(prev => prev.filter(r => r.reservation_id !== res.reservation_id));
                    } catch (err) {
                        console.error("Failed to remove reservation after adding to cart:", err);
                        showAlert("Item added to cart, but failed to remove reservation record.", 'danger');
                    }
                };

                return (
                    <>
                        <h2 style={styles.contentHeader}>My Reservations</h2>
                        {reservations.length === 0 ? (
                            <p style={{ textAlign: 'center', marginTop: '50px' }}>
                                You have no reservations.
                            </p>
                        ) : (
                            <div style={styles.reservationListContainer}>
                                {reservations.map(res => (
                                    <div key={res.reservation_id} style={{
                                        width: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        padding: '15px',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '10px',
                                        backgroundColor: '#fff',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                                        gap: '10px',
                                    }}>
                                        <img
                                            src={res.category_icon || 'https://via.placeholder.com/100'}
                                            alt={res.medicine_name}
                                            style={{ width: '100%', height: 'auto', maxHeight: '100px', objectFit: 'contain', borderRadius: '5px' }}
                                        />
                                        <div style={{ fontWeight: '600', color: styles.darkText, fontSize: '16px' }}>{res.medicine_name}</div>
                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                            <span style={{ fontWeight: 'bold', color: styles.primaryBlue }}>₱{res.price.toFixed(2)}</span> (Qty: {res.quantity})
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888' }}>
                                            Reserved: {res.reservation_date.toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <button
                                                onClick={() => handleAddReservationToCart(res)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    backgroundColor: styles.successGreen,
                                                    color: styles.white,
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                Add to Cart
                                            </button>
                                            <button
                                                onClick={() => handleRemoveReservation(res.reservation_id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '8px',
                                                    backgroundColor: styles.white,
                                                    color: styles.dangerRed,
                                                    border: `1px solid ${styles.dangerRed}`,
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                );
            case 'Notifications':
                return (
                    <>
                        <h2 style={styles.contentHeader}>Notifications</h2>
                        <p style={styles.underDevelopmentText}>
                            The Notifications section is currently under development. Please check back later!
                        </p>
                    </>
                );
            case 'Help':
                return (
                    <>
                        <h2 style={styles.contentHeader}>Help Center</h2>
                        <p style={styles.underDevelopmentText}>
                            Need assistance? The Help Center is currently under development. Please check back later!
                        </p>
                    </>
                );
            case 'FAQs':
                return (
                    <>
                        <h2 style={styles.contentHeader}>Frequently Asked Questions (FAQs)</h2>
                        <p style={styles.underDevelopmentText}>
                            The FAQs section is currently under development. Please check back later!
                        </p>
                    </>
                );
            case 'Settings':
            default:
                return (
                    <>
                        <h2 style={styles.contentHeader}>Settings</h2>
                        <p style={styles.underDevelopmentText}>
                            The Settings section is currently under development. Please check back later!
                        </p>
                    </>
                );
        }
    };

    return (
        <div style={styles.mainContainer}>
            <StyledAlert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
            <Modal
                title={modal.title}
                message={modal.message}
                isOpen={modal.isOpen}
                onConfirm={modal.onConfirm}
                onCancel={() => setModal({ ...modal, isOpen: false })}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                useLogoutStyle={modal.useLogoutStyle} 
            />
            <div style={styles.contentWrapper}>
                
                {/* --- Sidebar Menu (Now using the extracted component) --- */}
                <ProfileSidebar
                    accountInfo={accountInfo}
                    activeMenu={activeMenu}
                    handleNavigation={handleNavigation}
                    handleLogout={handleLogout}
                />

                {/* --- Content Area --- */}
                <div style={styles.contentArea}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}