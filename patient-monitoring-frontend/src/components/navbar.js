export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav style={{
      background: "#111",
      padding: "15px",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <h3>Secure Patient Monitoring</h3>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
