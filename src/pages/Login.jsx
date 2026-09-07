import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function Login() {
  const [role, setRole] = useState("FARMER"); // "FARMER" | "OPERATOR" | "OFFICER"
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regVillage, setRegVillage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError(`Please enter your ${role === "FARMER" ? "Farmer ID / Username" : role === "OPERATOR" ? "Operator ID" : "Officer ID"}`);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      if (role === "OPERATOR") {
        await api.operatorLogin(username, password);
        navigate("/operator");
      } else if (role === "OFFICER") {
        await api.officerLogin(username, password);
        navigate("/officer");
      } else {
        const nameToPass = isRegister && regName.trim() ? regName.trim() : username.trim();
        await api.login(username, password, nameToPass);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case "OPERATOR":
        return {
          icon: "🎯",
          title: "Operator Login",
          subtitle: "Procurement Desk Terminal",
          bgIcon: "#fef3c7",
          colorIcon: "#d97706",
          btnBg: "#d97706",
          label: "Operator ID / Username",
          placeholder: "e.g. OP-501 or operator1",
          demoId: "OP-501",
          demoPass: "operator123",
        };
      case "OFFICER":
        return {
          icon: "🏛️",
          title: "Officer Login",
          subtitle: "District Procurement Analytics",
          bgIcon: "#dbeafe",
          colorIcon: "#1d4ed8",
          btnBg: "#1d4ed8",
          label: "Officer ID / Username",
          placeholder: "e.g. OFF-901 or officer1",
          demoId: "OFF-901",
          demoPass: "officer123",
        };
      default:
        return {
          icon: "🚜",
          title: "Farmer Login",
          subtitle: "Procurement Slot Booking",
          bgIcon: "#e7f6ec",
          colorIcon: "#1f7a3f",
          btnBg: "#1f7a3f",
          label: "Farmer ID / Username",
          placeholder: "e.g. FARM-1001 or farmer1",
          demoId: "FARM-1001",
          demoPass: "password123",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="login-page">
      <div className="login-card">
        
        {/* Role Switcher Tabs */}
        <div style={{
          display: "flex",
          background: "#f3f4f6",
          padding: "4px",
          borderRadius: "10px",
          marginBottom: "20px",
          gap: "4px"
        }}>
          <button
            type="button"
            onClick={() => { setRole("FARMER"); setError(""); setUsername(""); setPassword(""); }}
            style={{
              flex: 1,
              padding: "8px 4px",
              fontSize: "13px",
              fontWeight: role === "FARMER" ? "700" : "500",
              color: role === "FARMER" ? "#1f7a3f" : "#6b7280",
              background: role === "FARMER" ? "#ffffff" : "transparent",
              border: "none",
              borderRadius: "8px",
              boxShadow: role === "FARMER" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            🌾 Farmer
          </button>
          
          <button
            type="button"
            onClick={() => { setRole("OPERATOR"); setError(""); setUsername(""); setPassword(""); }}
            style={{
              flex: 1,
              padding: "8px 4px",
              fontSize: "13px",
              fontWeight: role === "OPERATOR" ? "700" : "500",
              color: role === "OPERATOR" ? "#b45309" : "#6b7280",
              background: role === "OPERATOR" ? "#ffffff" : "transparent",
              border: "none",
              borderRadius: "8px",
              boxShadow: role === "OPERATOR" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            🎯 Operator
          </button>

          <button
            type="button"
            onClick={() => { setRole("OFFICER"); setError(""); setUsername(""); setPassword(""); }}
            style={{
              flex: 1,
              padding: "8px 4px",
              fontSize: "13px",
              fontWeight: role === "OFFICER" ? "700" : "500",
              color: role === "OFFICER" ? "#1d4ed8" : "#6b7280",
              background: role === "OFFICER" ? "#ffffff" : "transparent",
              border: "none",
              borderRadius: "8px",
              boxShadow: role === "OFFICER" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            🏛️ Officer
          </button>
        </div>

        <div className="logo" style={{ background: theme.bgIcon, color: theme.colorIcon }}>
          {theme.icon}
        </div>

        <h1>FARMORA</h1>

        <p className="subtitle">
          {theme.subtitle}
        </p>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">

          {isRegister ? (
            <>
              <div className="form-group">
                <label htmlFor="regName">Full Name</label>
                <input
                  id="regName"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="regPhone">Phone Number</label>
                <input
                  id="regPhone"
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="regVillage">Village / District</label>
                <input
                  id="regVillage"
                  type="text"
                  placeholder="e.g. Kovilpatti, Ludhiana"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="username">Create {role === "FARMER" ? "Farmer ID" : role === "OPERATOR" ? "Operator ID" : "Officer ID"} / Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder={theme.placeholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label htmlFor="username">{theme.label}</label>
              <input
                id="username"
                type="text"
                placeholder={theme.placeholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">{isRegister ? "Create Password" : "Password"}</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isRegister ? "Minimum 6 characters" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete={isRegister ? "new-password" : "current-password"}
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

          <button
            type="submit"
            disabled={loading}
            className="login-submit"
            style={{ background: theme.btnBg }}
          >
            {loading ? (isRegister ? "Registering..." : "Authenticating...") : (isRegister ? "Create Account & Login →" : `${theme.title} →`)}
          </button>

        </form>

        <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f3f4f6" }}>
          {isRegister ? (
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(""); }}
                style={{ background: "none", border: "none", color: theme.colorIcon, fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p style={{ fontSize: "14px", color: "#4b5563" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(""); }}
                style={{ background: "none", border: "none", color: theme.colorIcon, fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
              >
                Create a New Account
              </button>
            </p>
          )}
        </div>

        <p className="help-text">
          Demo User ID: <strong>{theme.demoId}</strong> &nbsp;·&nbsp; Password: <strong>{theme.demoPass}</strong>
        </p>

      </div>
    </div>
  );
}

export default Login;
