import React, { useState } from "react";
import { loginUser } from "../services/api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const data = await loginUser(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Secure Patient Monitoring</h1>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>

      <p style={{ color: "red" }}>{error}</p>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#667eea,#764ba2)",
    color: "white"
  },
  title: { marginBottom: 30 },
  input: {
    padding: 12,
    width: 260,
    marginBottom: 15,
    borderRadius: 5,
    border: "none"
  },
  button: {
    padding: 12,
    width: 260,
    backgroundColor: "#00e676",
    border: "none",
    borderRadius: 5,
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Login;

