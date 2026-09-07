import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function OfficerLogin() {
  const [officerId, setOfficerId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!officerId.trim()) {
      setError("Please enter your Officer ID or Username");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      await api.officerLogin(officerId, password);
      navigate("/officer");
    } catch (err) {
      setError(err.message || "Officer login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
          🏛️
        </div>

        <h1>FARMORA OFFICER</h1>

        <p className="subtitle">
          District Procurement Officer Dashboard Login
        </p>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">

          <div className="form-group">
            <label htmlFor="officerId">Officer ID / Username</label>
            <input
              id="officerId"
              type="text"
              placeholder="e.g. OFF-901 or officer1"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter officer password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-submit" style={{ background: "#1d4ed8" }}>
            {loading ? "Authenticating Officer..." : "Officer Login →"}
          </button>

        </form>

        <p className="help-text">
          Demo Officer ID: <strong>OFF-901</strong> &nbsp;·&nbsp; Password: <strong>officer123</strong>
          <br />
          <span 
            style={{ color: "#1f7a3f", cursor: "pointer", textDecoration: "underline", marginTop: "8px", display: "inline-block" }} 
            onClick={() => navigate("/")}
          >
            ← Switch to Farmer Portal Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default OfficerLogin;
