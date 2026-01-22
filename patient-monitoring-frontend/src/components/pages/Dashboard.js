import React, { useEffect, useState } from "react";
import { getVitals } from "../services/api";

function Dashboard({ token, logout }) {
  const [vitals, setVitals] = useState(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await getVitals(token);
      if (data && data.length > 0) {
        setVitals(data[0]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  if (!vitals) {
    return <h2 style={{ textAlign: "center" }}>Loading vitals...</h2>;
  }

  const statusColor =
    vitals.status === "CRITICAL"
      ? "red"
      : vitals.status === "WARNING"
      ? "orange"
      : "green";

  return (
    <div style={styles.container}>
      <button onClick={logout} style={styles.logout}>Logout</button>

      <h1>Patient Monitoring Dashboard</h1>

      <div style={styles.card}>
        <h3>Patient ID</h3>
        <p>{vitals.patientId}</p>
      </div>

      <div style={styles.row}>
        <div style={styles.card}>
          ❤️ <h3>BPM</h3>
          <p>{vitals.heartRate}</p>
        </div>

        <div style={styles.card}>
          🫁 <h3>SpO2</h3>
          <p>{vitals.spo2}%</p>
        </div>

        <div style={styles.card}>
          🌡 <h3>Temperature</h3>
          <p>{vitals.temperature} °C</p>
        </div>
      </div>

      <h2 style={{ color: statusColor }}>
        Status: {vitals.status}
      </h2>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: 20,
    background: "#f5f7fa",
    textAlign: "center"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    gap: 20
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    width: 180
  },
  logout: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 10,
    cursor: "pointer"
  }
};

export default Dashboard;
