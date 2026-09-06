import { useNavigate } from "react-router-dom";
import { farmer, price, booking, queue } from "../data/mockData";

function Dashboard() {
  const navigate = useNavigate();

  const farmerId = localStorage.getItem("farmerId") || farmer.farmerId;

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

        <div className="farmer-profile">
          <span>👤</span>
          <div>
            <strong>{farmerId}</strong>
            <small>Farmer</small>
          </div>
        </div>
      </header>

      {/* Welcome */}
      <section className="welcome-section">
        <h1>Good Morning, {farmer.name.split(" ")[0]}! 👋</h1>
        <p>
          Manage your procurement, slots and payments easily.
        </p>
      </section>

      {/* Information Cards */}
      <section className="info-grid">

        <div className="info-card">
          <span className="card-icon">🌾</span>
          <div>
            <p>Today's {price.crop} Price</p>
            <h2>₹{price.current.toLocaleString()}</h2>

            <span className={price.change >= 0 ? "positive" : "negative"}>
              {price.change >= 0 ? "↑" : "↓"} ₹
              {Math.abs(price.change)} from yesterday
            </span>
          </div>
        </div>

        <div className="info-card">
          <span className="card-icon">🕐</span>
          <div>
            <p>Current Queue</p>
            <h2>
              {queue.farmerToken - queue.currentToken} Farmers
            </h2>
            <span>
              Estimated wait: {queue.estimatedWait} min
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

        <button onClick={() => navigate("/procurement")}>
          📦
          <span>Status</span>
        </button>

      </nav>

    </div>
  );
}

export default Dashboard;