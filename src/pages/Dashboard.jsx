import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { farmer as mockFarmer, price as mockPrice, queue as mockQueue } from "../data/mockData";

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(mockFarmer);
  const [currentPrice, setCurrentPrice] = useState(mockPrice);
  const [queueInfo, setQueueInfo] = useState(mockQueue);
  const [farmerId, setFarmerId] = useState(localStorage.getItem("farmerId") || mockFarmer.farmerId);
  const currentUser = api.getCurrentUser();
  const userRole = currentUser?.role || "FARMER";

  useEffect(() => {
    async function loadData() {
      try {
        const farmerData = await api.getFarmer();
        if (farmerData) {
          setProfile(farmerData);
          if (farmerData.farmer_id) setFarmerId(farmerData.farmer_id);
        }

        const prices = await api.getPrices();
        if (prices && prices.length > 0) {
          const firstPrice = prices[0];
          setCurrentPrice({
            crop: firstPrice.crop?.name || "Paddy",
            current: Math.round(firstPrice.price_per_kg * 100), // per quintal
            change: 30,
            percentage: 1.3,
          });
        }

        const queueData = await api.getQueue();
        if (queueData) {
          const yourToken = queueData.your_tokens?.[0];
          const summary = queueData.queue_summary;
          setQueueInfo({
            farmerAhead: yourToken?.queue_position ? yourToken.queue_position - 1 : summary?.waiting_count || 4,
            estimatedWait: yourToken?.estimated_wait_minutes || 25,
            serving: summary?.currently_serving || "TKN-1-001",
          });
        }
      } catch (err) {
        console.warn("Error fetching dashboard data:", err);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    api.logout();
    navigate("/");
  };

  const displayName = profile.name ? profile.name.split(" ")[0] : "Farmer";

  return (
    <div className="dashboard-page">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <div className="brand">
            🚜 FARMORA
          </div>
          <p>Farmer Procurement Portal</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="farmer-profile">
            <span>👤</span>
            <div>
              <strong>{farmerId}</strong>
              <small>{profile.name || "Farmer"}</small>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ padding: "6px 10px", fontSize: "12px", background: "rgba(255,255,255,0.15)", border: "none", color: "inherit", borderRadius: "6px", cursor: "pointer" }}
            title="Log Out"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Welcome */}
      <section className="welcome-section">
        <h1>Good Morning, {displayName}! 👋</h1>
        <p>
          Manage your procurement, slots and payments easily.
        </p>
      </section>

      {/* Information Cards */}
      <section className="info-grid">

        <div className="info-card">
          <span className="card-icon">🌾</span>
          <div>
            <p>Today's {currentPrice.crop} Price</p>
            <h2>₹{currentPrice.current.toLocaleString()} / Qtl</h2>

            <span className={currentPrice.change >= 0 ? "positive" : "negative"}>
              {currentPrice.change >= 0 ? "↑" : "↓"} ₹
              {Math.abs(currentPrice.change)} from yesterday
            </span>
          </div>
        </div>

        <div className="info-card">
          <span className="card-icon">🕐</span>
          <div>
            <p>Current Queue</p>
            <h2>
              {queueInfo.farmerAhead || 3} Farmers Ahead
            </h2>
            <span>
              Estimated wait: {queueInfo.estimatedWait || 20} min
            </span>
          </div>
        </div>

      </section>

      {/* Booking */}
      <section className="dashboard-card booking-section">
        <div>
          <span className="section-icon">📅</span>

          <div>
            <h2>Book Procurement Slot</h2>
            <p>
              Select a centre, date and time for your procurement.
            </p>
          </div>
        </div>

        <button onClick={() => navigate("/booking")}>
          Book Slot →
        </button>
      </section>

      {/* Procurement Status */}
      <section className="dashboard-card">
        <div className="section-heading">
          <span className="section-icon">📦</span>

          <div>
            <h2>My Procurement</h2>
            <p>
              Track your procurement progress
            </p>
          </div>
        </div>

        <div className="status-timeline">

          <div className="status-step active">
            <div className="status-circle">✓</div>
            <span>Verification</span>
          </div>

          <div className="status-line"></div>

          <div className="status-step">
            <div className="status-circle">2</div>
            <span>Quality Check</span>
          </div>

          <div className="status-line"></div>

          <div className="status-step">
            <div className="status-circle">3</div>
            <span>Weighing</span>
          </div>

          <div className="status-line"></div>

          <div className="status-step">
            <div className="status-circle">4</div>
            <span>Procurement</span>
          </div>

          <div className="status-line"></div>

          <div className="status-step">
            <div className="status-circle">5</div>
            <span>Payment</span>
          </div>

        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="quick-grid">

          <button onClick={() => navigate("/prices")}>
            🌾
            <span>Prices</span>
          </button>

          <button onClick={() => navigate("/booking")}>
            📅
            <span>Book Slot</span>
          </button>

          <button onClick={() => navigate("/my-booking")}>
            🎫
            <span>My Booking</span>
          </button>

          <button onClick={() => navigate("/queue")}>
            🕐
            <span>Live Queue</span>
          </button>

          <button onClick={() => navigate("/procurement")}>
            📦
            <span>Procurement</span>
          </button>

        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">

        <button onClick={() => navigate("/dashboard")}>
          🏠
          <span>Home</span>
        </button>

        <button onClick={() => navigate("/booking")}>
          📅
          <span>Booking</span>
        </button>

        <button onClick={() => navigate("/my-booking")}>
          🎫
          <span>Token</span>
        </button>

        <button onClick={() => navigate("/queue")}>
          🕐
          <span>Queue</span>
        </button>

        <button onClick={() => navigate("/prices")}>
          🌾
          <span>Prices</span>
        </button>

        <button onClick={() => navigate("/procurement")}>
          📦
          <span>Status</span>
        </button>

      </nav>

    </div>
  );
}

export default Dashboard;