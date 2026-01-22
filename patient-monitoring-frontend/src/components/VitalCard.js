export default function VitalCard({ title, value, color }) {
  return (
    <div style={{
      background: color,
      padding: "20px",
      borderRadius: "15px",
      color: "#fff",
      width: "220px",
      textAlign: "center",
      boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
    }}>
      <h2>{title}</h2>
      <h1>{value}</h1>
    </div>
  );
}
