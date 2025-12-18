import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../backend/firebase.js";
import { useNavigate } from "react-router-dom";

const PRIMARY_COLOR = "#29ABE2"; 
const TEXT_COLOR = "#202020";
const FONT_FAMILY = "'Poppins', sans-serif";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in user:", userCredential.user);
            setError(""); 
            navigate("/"); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.page}>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
                * { font-family: ${FONT_FAMILY} !important; }
                input::placeholder { font-family: ${FONT_FAMILY}; color: #aaa; }
                `}
            </style>

            <div style={styles.card}>

                {/* LEFT FORM */}
                <div style={styles.left}>
                    <h2 style={styles.title}>Login</h2>

                    <form onSubmit={handleSubmit} style={styles.form}>

                        <div style={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.rowBetween}>
                            <label style={styles.rememberRow}>
                                <input type="checkbox" style={{ accentColor: PRIMARY_COLOR }} />
                                <span style={{ marginLeft: 6 }}>Remember Password</span>
                            </label>
                            <a href="/forgot" style={styles.forgot}>
                                Forgot Password?
                            </a>
                        </div>

                        {error && <p style={styles.error}>{error}</p>}

                        <button type="submit" style={styles.loginBtn}>
                            Login
                        </button>
                    </form>

                    <p style={{ ...styles.noAccount, textAlign: "center" }}>
                        No account yet?{" "}
                        <a href="/register" style={styles.registerLink}>
                            Register
                        </a>
                    </p>

                    <div style={styles.orLine}>
                        <span style={styles.orText}>Or Login With</span>
                    </div>

                    <div style={styles.socialRow}>
                        <button style={styles.socialBtn}>
                            <img 
                                src="https://static.vecteezy.com/system/resources/previews/021/515/161/non_2x/google-symbol-logo-black-design-illustration-free-vector.jpg" 
                                alt="Google" 
                                style={styles.socialIcon}
                            />
                        </button>
                        <button style={styles.socialBtn}>
                            <img 
                                src="https://static.vecteezy.com/system/resources/thumbnails/018/930/707/small/facebook-logo-facebook-icon-transparent-free-png.png" 
                                alt="Facebook" 
                                style={styles.socialIcon}
                            />
                        </button>
                        <button style={styles.socialBtn}>
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" 
                                alt="Apple" 
                                style={styles.socialIcon}
                            />
                        </button>
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div style={styles.right}>
                    <img
                        src="https://png.pngtree.com/png-vector/20240612/ourmid/pngtree-the-concept-of-an-online-pharmacy-isometric-png-image_12697892.png"
                        alt="illustration"
                        style={styles.illustration}
                    />
                </div>
            </div>
        </div>
    );
}

/* -------------------- STYLES -------------------- */

const styles = {
    page: {
        width: "100%",
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "100px", // Increased padding on top
        paddingBottom: "60px",
        boxSizing: "border-box"
    },
    card: {
        width: "90%",
        maxWidth: "1100px",
        display: "flex",
        padding: "40px 50px",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: { width: "45%" },
    right: { width: "50%", display: "flex", justifyContent: "center" },
    title: { 
        fontSize: 36, 
        fontWeight: 700, 
        marginBottom: 25, 
        color: TEXT_COLOR,
        letterSpacing: "-0.5px"
    },
    form: { width: "100%" },
    inputGroup: { width: "100%", marginBottom: 18 },
    input: {
        width: "100%",
        padding: "16px 20px",
        borderRadius: 12,
        border: "1.5px solid #E5E7EB",
        outline: "none",
        fontSize: 15,
        color: TEXT_COLOR,
        boxSizing: "border-box",
        backgroundColor: "#F9FAFB"
    },
    rowBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    rememberRow: { display: "flex", alignItems: "center", fontSize: 13, color: "#666" },
    forgot: { fontSize: 13, color: PRIMARY_COLOR, textDecoration: "none", fontWeight: 500 },
    loginBtn: {
        width: "100%",
        padding: "16px",
        background: PRIMARY_COLOR,
        color: "#fff",
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 600,
        marginTop: 10,
        boxShadow: "0 4px 12px rgba(41, 171, 226, 0.2)"
    },
    error: { color: "#ff4d4f", fontSize: 13, marginBottom: 10, fontWeight: 500 },
    noAccount: { marginTop: 20, fontSize: 14, color: "#666" },
    registerLink: { color: PRIMARY_COLOR, textDecoration: "none", fontWeight: 600 },
    orLine: { 
        position: "relative",
        textAlign: "center", 
        margin: "25px 0", 
        fontSize: 13, 
        color: "#aaa",
    },
    orText: {
        background: "#fff",
        padding: "0 10px",
        position: "relative",
        zIndex: 1
    },
    socialRow: { display: "flex", gap: 15, justifyContent: "center" },
    socialBtn: {
        height: 50,
        width: 50,
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        background: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },
    socialIcon: { width: "100%", height: "100%", objectFit: "contain" },
    illustration: { width: "100%", maxWidth: 450 },
};