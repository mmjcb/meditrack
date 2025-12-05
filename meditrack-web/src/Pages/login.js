import React, { useState } from "react";

const PRIMARY_COLOR = "#00B4D8";
const TEXT_COLOR = "#202020";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        console.log("Logging in:", email, password);
    };

    return (
        <div style={styles.page}>
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
                                <input type="checkbox" />
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

                    <p style={styles.noAccount}>
                        No account yet?{" "}
                        <a href="/register" style={styles.registerLink}>
                            Register
                        </a>
                    </p>

                    <div style={styles.orLine}>
                        <span>Or Login With</span>
                    </div>

                    <div style={styles.socialRow}>
                        <button style={styles.socialBtn}>🍎</button>
                        <button style={styles.socialBtn}>🐦</button>
                        <button style={styles.socialBtn}>📘</button>
                        <button style={styles.socialBtn}>🟧</button>
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
        width: "97%",
        height: "100vh",
        background: "#f4fcff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "88%",
        maxWidth: "1100px",
        display: "flex",
        padding: "40px 50px",
        alignItems: "center",
        justifyContent: "space-between",
    },
    left: {
        width: "45%",
    },
    right: {
        width: "50%",
        display: "flex",
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: 800,
        marginBottom: 20,
        color: TEXT_COLOR,
    },
    form: {
        width: "100%",
    },

    /* UPDATED: makes input group same width as button */
    inputGroup: {
        width: "100%",
        marginBottom: 15,
    },

    /* Input now expands full width like the button */
    input: {
        width: "100%",
        padding: "14px 16px",
        borderRadius: 10,
        border: "2px solid #bdeeff",
        outline: "none",
        fontSize: 16,
        color: TEXT_COLOR,
        boxSizing: "border-box",
    },

    rowBetween: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    rememberRow: {
        display: "flex",
        alignItems: "center",
        fontSize: 14,
        color: TEXT_COLOR,
    },
    forgot: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        textDecoration: "none",
    },

    /* Button full width */
    loginBtn: {
        width: "100%",
        padding: "14px",
        background: PRIMARY_COLOR,
        color: "#fff",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
    },

    error: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
    },
    noAccount: {
        marginTop: 15,
        fontSize: 14,
        color: TEXT_COLOR,
    },
    registerLink: {
        color: PRIMARY_COLOR,
        textDecoration: "none",
        fontWeight: 600,
    },
    orLine: {
        textAlign: "center",
        margin: "15px 0",
        fontSize: 14,
        color: "#777",
    },
    socialRow: {
        display: "flex",
        gap: 12,
        justifyContent: "center",
    },
    socialBtn: {
        height: 45,
        width: 45,
        borderRadius: 10,
        border: "1px solid #ddd",
        background: "#fff",
        cursor: "pointer",
        fontSize: 20,
    },
    illustration: {
        width: "90%",
        maxWidth: 420,
    },
};
