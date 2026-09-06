import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function Login() {
  const [farmerId, setFarmerId] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!farmerId.trim()) {
      setError("Please enter your Farmer ID or Username");
      return;
    }

    setLoading(true);
    try {
      await api.login(farmerId, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo">
          🚜
        </div>

        <h1>FARMORA</h1>

        <p className="subtitle">
          Farmer Procurement Slot Booking
        </p>

        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "8px 12px", borderRadius: "6px", marginBottom: "12px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label>Farmer ID / Username</label>

          <input
            type="text"
            placeholder="Enter Farmer ID (e.g. FARM-1001 or farmer1)"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
            disabled={loading}
          />

          <label style={{ marginTop: "12px" }}>Password</label>
          <input
            type="password"
            placeholder="Password (default: password123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button type="submit" disabled={loading} style={{ marginTop: "16px" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="help-text">
          Demo Farmer IDs: <strong>FARM-1001</strong>, <strong>FARM-1002</strong>, <strong>FARM-1003</strong>
          <br />
          Password: <strong>password123</strong>
        </p>
      </div>
    </div>
  );
}

export default Login;
