import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../backend/AuthContext.js';
import { ref, onValue } from "firebase/database";
import { db } from '../backend/firebase.js';

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

// --- STYLES DEFINITION ---
const styles = {
    primaryBlue: '#29ABE2',
    lightGray: '#f7f7f7',
    darkText: '#202020',
    white: '#fff',

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
};

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

// --- Main Profile Component ---
export default function Profile() {
    const [activeMenu, setActiveMenu] = useState('AccountInformation');
    const [transactions, setTransactions] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // --- Set activeMenu from query param ---
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab) setActiveMenu(tab);
    }, [location.search]);

    // --- Redirect to login if not logged in ---
    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);

    // --- Fetch transactions when CheckoutHistory is active ---
   useEffect(() => {
  if (activeMenu === 'CheckoutHistory' && user) {
    // 1. Fetch all carts
    const cartsRef = ref(db, "Cart");
    const unsubscribeCarts = onValue(cartsRef, (snapshot) => {
      const cartsData = snapshot.val() || {};
      // Get all cart IDs that belong to this user
      const userCartIDs = Object.entries(cartsData)
        .filter(([cartId, cart]) => cart.user_id === user.uid)
        .map(([cartId]) => cartId);

      // 2. Fetch all transactions
      const transactionsRef = ref(db, "Transaction_History");
      const unsubscribeTransactions = onValue(transactionsRef, (txSnapshot) => {
        const txData = txSnapshot.val() || {};
        // Only include transactions whose cart_id is in the user's carts
        const userTransactions = Object.values(txData)
          .filter(tx => userCartIDs.includes(tx.cart_id));

        setTransactions(userTransactions);
      });

      // Clean up transactions listener when carts listener updates
      return () => unsubscribeTransactions();
    });

    // Clean up carts listener
    return () => unsubscribeCarts();
  }
}, [activeMenu, user]);


    const handleNavigation = (menuName) => setActiveMenu(menuName);

    if (!user) return null;

    // --- Render content based on active menu ---
    const renderContent = () => {
        switch (activeMenu) {
            case 'AccountInformation':
                return (
                    <>
                        <h2 style={styles.contentHeader}>Account Information</h2>
                        <div style={styles.underDevelopmentText}>
                            Currently under development
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
                            <div>
                                {transactions.map(tx => (
                                    <div key={tx.transaction_id} style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                                        <p><strong>Date:</strong> {new Date(tx.transaction_date).toLocaleString()}</p>
                                        <p><strong>Total:</strong> ₱{tx.total_amount.toFixed(2)}</p>
                                        <ul>
                                            {tx.items?.map(item => (
                                                <li key={item.id}>
                                                    {item.name} - {item.quantity} x ₱{item.price.toFixed(2)} = ₱{item.subtotal.toFixed(2)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                );

            case 'Reserve':
            case 'Notifications':
            case 'Settings':
            case 'Help':
            case 'FAQs':
                const headerText = activeMenu.replace(/([A-Z])/g, ' $1').trim();
                return (
                    <>
                        <h2 style={styles.contentHeader}>{headerText}</h2>
                        <div style={styles.underDevelopmentText}>
                            Content for {headerText} is currently under development.
                        </div>
                    </>
                );

            case 'Logout':
                return (
                    <>
                        <h2 style={styles.contentHeader}>Logout</h2>
                        <div style={styles.underDevelopmentText}>
                            Are you sure you want to log out?
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.contentWrapper}>
                {/* Left Sidebar */}
                <aside style={styles.sidebar}>
                    <div style={styles.userInfo}>
                        <UserCircleIcon style={styles.userIcon} />
                        <span style={styles.username}>{user?.username || user?.email}</span>
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
                        name="Reserve"
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
                        onClick={async () => {
                            const confirmLogout = window.confirm("Are you sure you want to log out?");
                            if (confirmLogout) {
                                try {
                                    await logout();
                                    navigate("/login");
                                } catch (err) {
                                    console.error("Logout failed:", err);
                                    alert("Failed to log out. Please try again.");
                                }
                            }
                        }}
                    />
                </aside>

                {/* Right Content Area */}
                <section style={styles.contentArea}>
                    {renderContent()}
                </section>
            </div>
        </div>
    );
}