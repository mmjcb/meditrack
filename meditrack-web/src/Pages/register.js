import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../backend/firebase.js";

const PRIMARY_COLOR = "#00B4D8";
const TEXT_COLOR = "#202020";

export default function Register() {
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

      await setDoc(doc(db, "users", user.uid), {
        fname,
        lname,
        username,
        email,
        profilePic:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt3VYVgX11z-bWzfirZ7dPKv8ymIQ9yimgQQ&s",
        createdAt: serverTimestamp(),
      });

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
      <div style={styles.card}>
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
            {success && <p style={{ ...styles.error, color: "green" }}>{success}</p>}

            <button type="submit" style={styles.loginBtn}>
              Register
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 15 }}>
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
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "100px 20px 50px 20px", // top margin for navbar, bottom smaller
    boxSizing: "border-box",
  },
  card: {
    width: "88%",
    maxWidth: "1100px",
    display: "flex",
    padding: "40px 50px",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  left: { width: "45%" },
  right: { width: "50%", display: "flex", justifyContent: "center" },
  title: { fontSize: 32, fontWeight: 800, marginBottom: 20, color: TEXT_COLOR },
  form: { width: "100%" },
  row: { display: "flex", marginBottom: 15 },
  inputGroup: { width: "100%", marginBottom: 15 },
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
  error: { color: "red", fontSize: 14, marginBottom: 10 },
  registerLink: { color: PRIMARY_COLOR, textDecoration: "none", fontWeight: 600 },
  illustration: { width: "90%", maxWidth: 420 },
};
