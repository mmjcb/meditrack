import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "../backend/firebase.js";

const PRIMARY_COLOR = "#29ABE2"; // Consistent with Login/About/Cart
const TEXT_COLOR = "#202020";
const FONT_FAMILY = "'Poppins', sans-serif";

export default function Register() {
  const db = getDatabase();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fname || !lname || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        fname,
        lname,
        username,
        email,
        profilePic:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3VYVgX11z-bWzfirZ7dPKv8ymIQ9yimgQQ&s",
        createdAt: Date.now(),
      };

      await set(ref(db, `User/${user.uid}`), userData);

      setSuccess("Registration successful! You can now log in.");
      setFname("");
      setLname("");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        .register-container * { 
            font-family: ${FONT_FAMILY} !important; 
        }

        input::placeholder { 
            font-family: ${FONT_FAMILY} !important; 
            color: #aaa; 
            font-size: 14px;
        }
        `}
      </style>

      <div className="register-container" style={styles.card}>
        {/* LEFT FORM */}
        <div style={styles.left}>
          <h2 style={styles.title}>Register</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <input
                type="text"
                placeholder="First Name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                style={{ ...styles.input, marginRight: 10 }}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.row}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, marginRight: 10 }}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>{success}</p>}

            <button type="submit" style={styles.loginBtn}>
              Register
            </button>
          </form>

          <div style={styles.footerText}>
            Already have an account?{" "}
            <a href="/login" style={styles.registerLink}>
              Login
            </a>
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

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "100px", // Consistent top padding
    paddingBottom: "80px",
    boxSizing: "border-box",
  },
  card: {
    width: "90%",
    maxWidth: "1100px",
    display: "flex",
    padding: "20px 50px",
    alignItems: "center",
    justifyContent: "space-between"
  },
  left: { width: "45%" },
  right: { width: "50%", display: "flex", justifyContent: "center" },
  title: { 
    fontSize: "38px", 
    fontWeight: 700, 
    marginBottom: "30px", 
    color: TEXT_COLOR,
    letterSpacing: "-1px" 
  },
  form: { width: "100%" },
  row: { display: "flex", marginBottom: "20px" },
  inputGroup: { width: "100%", marginBottom: "20px" },
  input: {
    width: "100%",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1.5px solid #EAEAEA",
    outline: "none",
    fontSize: "15px",
    color: TEXT_COLOR,
    boxSizing: "border-box",
    backgroundColor: "#FBFBFB",
    transition: "all 0.3s ease"
  },
  loginBtn: {
    width: "100%",
    padding: "16px",
    background: PRIMARY_COLOR,
    color: "#fff",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 600,
    marginTop: "10px",
    boxShadow: "0 10px 20px rgba(41, 171, 226, 0.15)"
  },
  error: { color: "#E63946", fontSize: "14px", marginBottom: "15px", fontWeight: 500 },
  success: { color: "#2D6A4F", fontSize: "14px", marginBottom: "15px", fontWeight: 500 },
  footerText: { textAlign: "center", marginTop: "25px", fontSize: "15px", color: "#666" },
  registerLink: { color: PRIMARY_COLOR, textDecoration: "none", fontWeight: 600 },
  illustration: { width: "100%", maxWidth: 450 },
};