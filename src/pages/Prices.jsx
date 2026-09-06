import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultPriceHistory = [
  { day: "Mon", price: 2240 },
  { day: "Tue", price: 2260 },
  { day: "Wed", price: 2275 },
  { day: "Thu", price: 2290 },
  { day: "Fri", price: 2300 },
  { day: "Sat", price: 2310 },
  { day: "Today", price: 2310 },
];

function Prices() {
  const navigate = useNavigate();
  const [cropsList, setCropsList] = useState([]);
  const [mainPrice, setMainPrice] = useState({ name: "Paddy", price: 2310, change: "+₹30", percentage: "+1.3%" });

  useEffect(() => {
    async function loadPrices() {
      try {
        const prices = await api.getPrices();
        if (prices && prices.length > 0) {
          const formatted = prices.map((p) => ({
            name: p.crop?.name || `Crop #${p.crop_id}`,
            icon: p.crop?.name === "Cotton" ? "🌿" : p.crop?.name === "Maize" ? "🌽" : "🌾",
            price: Math.round(p.price_per_kg * 100),
            change: "+₹25",
            percentage: "+1.1%",
          }));
          setCropsList(formatted);
          setMainPrice(formatted[0]);
        }
      } catch (err) {
        console.warn("Failed to load prices:", err);
      }
    }
    loadPrices();
  }, []);

  return (
    <div className="prices-page">

      {/* Header */}

      <header className="dashboard-header">

        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Crop Prices & Market Insights</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      <main className="prices-container">

        {/* Page title */}

        <div className="prices-title">

          <h1>🌾 Today's Crop Prices</h1>

          <p>
            View current procurement prices and recent price trends.
          </p>

        </div>

        {/* Main Price Card */}
        <div className="main-price-card">
          <div>
            <span className="crop-label">
              {mainPrice.icon || "🌾"} {mainPrice.name}
            </span>

            <h2>
              ₹{mainPrice.price.toLocaleString()}
              <small> / Quintal</small>
            </h2>

            <p className="price-up">
              ↑ ₹30 (+1.3%) MSP effective
            </p>
          </div>

          <div className="price-icon">
            📈
          </div>
        </div>

        {/* Price History */}
        <div className="price-panel">
          <div className="panel-heading">
            <div>
              <h2>Price History</h2>
              <p>
                {mainPrice.name} procurement price — Last 7 days
              </p>
            </div>
            <span className="period-badge">
              7 Days
            </span>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={defaultPriceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={["dataMin - 20", "dataMax + 20"]} />
                <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#1f7a3f"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight */}
        <div className="ai-price-card">
          <div className="ai-icon">
            🤖
          </div>
          <div>
            <h2>AI Price Trend</h2>
            <p>
              Based on recent procurement volume, Farmora predicts
              that {mainPrice.name} prices may remain steady or trend
              upwards over the upcoming procurement cycle.
            </p>
            <div className="prediction">
              <span>🔮 Predicted Trend</span>
              <strong>↗ Stable / Positive</strong>
            </div>
          </div>
        </div>

        {/* Price Alert */}
        <div className="price-alert">
          <span>🔔</span>
          <div>
            <h3>Price Alert</h3>
            <p>
              Get notified when crop procurement prices change.
            </p>
          </div>
          <button>
            Enable Alert
          </button>
        </div>

        {/* Other Crops */}
        <h2 className="other-crops-title">
          All Procurement Crops
        </h2>

        <div className="crop-grid">
          {cropsList.map((crop) => (
            <div className="crop-card" key={crop.name} onClick={() => setMainPrice(crop)} style={{ cursor: "pointer" }}>
              <div className="crop-header">
                <span className="crop-icon">
                  {crop.icon}
                </span>
                <div>
                  <h3>{crop.name}</h3>
                  <p>Procurement MSP</p>
                </div>
              </div>
              <h2>
                ₹{crop.price.toLocaleString()}
                <small> / Qtl</small>
              </h2>
              <div className="crop-up">
                {crop.change} ({crop.percentage})
              </div>
            </div>
          ))}
        </div>

      </main>

    </div>
  );
}

export default Prices;