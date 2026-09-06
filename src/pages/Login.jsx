import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [farmerId, setFarmerId] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!farmerId.trim()) {
      alert("Please enter your Farmer ID");
      return;
    }

    localStorage.setItem("farmerId", farmerId);
    navigate("/dashboard");
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

        <form onSubmit={handleLogin}>
          <label>Farmer ID</label>

          <input
            type="text"
            placeholder="Enter your Farmer ID"
            value={farmerId}
            onChange={(e) => setFarmerId(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        <p className="help-text">
          Don't have a smartphone?
          <br />
          Visit your nearest procurement centre for assisted booking.
        </p>
      </div>
    </div>
  );
}

export default Login;
