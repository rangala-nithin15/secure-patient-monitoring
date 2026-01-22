import React, { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <>
      {token ? (
        <Dashboard token={token} logout={logout} />
      ) : (
        <Login setToken={setToken} />
      )}
    </>
  );
}

export default App;
