const BASE_URL = "http://localhost:5000/api";

/* -------- LOGIN -------- */
export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
};

/* -------- GET VITALS -------- */
export const getVitals = async (token) => {
  const res = await fetch(`${BASE_URL}/vitals`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};
