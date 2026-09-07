import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function OperatorLogin() {
  const [operatorId, setOperatorId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!operatorId.trim()) {
      setError("Please enter your Operator ID or Username");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      await api.operatorLogin(operatorId, password);
      navigate("/operator");
    } catch (err) {
      setError(err.message || "Operator login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo" style={{ background: "#fef3c7", color: "#d97706" }}>
          🎯
        </div>

        <h1>FARMORA OPERATOR</h1>

        <p className="subtitle">
          Centre Operator Terminal Login
        </p>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">

          <div className="form-group">
            <label htmlFor="operatorId">Operator ID / Username</label>
            <input
              id="operatorId"
              type="text"
              placeholder="e.g. OP-501 or operator1"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
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
                placeholder="Enter operator password"
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

          <button type="submit" disabled={loading} className="login-submit" style={{ background: "#d97706" }}>
            {loading ? "Authenticating Operator..." : "Operator Login →"}
          </button>

        </form>

        <p className="help-text">
          Demo Operator ID: <strong>OP-501</strong> &nbsp;·&nbsp; Password: <strong>operator123</strong>
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

export default OperatorLogin;
