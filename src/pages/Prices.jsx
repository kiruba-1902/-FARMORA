import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const priceHistory = [
  { day: "Mon", price: 2240 },
  { day: "Tue", price: 2260 },
  { day: "Wed", price: 2275 },
  { day: "Thu", price: 2290 },
  { day: "Fri", price: 2300 },
  { day: "Sat", price: 2310 },
  { day: "Today", price: 2310 },
];

const crops = [
  {
    name: "Paddy",
    icon: "🌾",
    price: 2310,
    change: "+₹30",
    percentage: "+1.3%",
  },
  {
    name: "Wheat",
    icon: "🌾",
    price: 2275,
    change: "+₹15",
    percentage: "+0.7%",
  },
  {
    name: "Maize",
    icon: "🌽",
    price: 2180,
    change: "-₹20",
    percentage: "-0.9%",
  },
];

function Prices() {
  const navigate = useNavigate();

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
              🌾 Paddy
            </span>

            <h2>
              ₹2,310
              <small> / Quintal</small>
            </h2>

            <p className="price-up">
              ↑ ₹30 (+1.3%) from yesterday
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
                Paddy procurement price — Last 7 days
              </p>
            </div>

            <span className="period-badge">
              7 Days
            </span>

          </div>

          <div className="chart-container">

            <ResponsiveContainer width="100%" height={300}>

              <LineChart data={priceHistory}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis
                  domain={["dataMin - 20", "dataMax + 20"]}
                />

                <Tooltip
                  formatter={(value) => [
                    `₹${value}`,
                    "Price",
                  ]}
                />

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

            <h2>
              AI Price Trend
            </h2>

            <p>
              Based on recent price movement, Farmora predicts
              that Paddy prices may remain stable or increase
              slightly over the next few days.
            </p>

            <div className="prediction">

              <span>
                🔮 Predicted Trend
              </span>

              <strong>
                ↗ Slight Increase
              </strong>

            </div>

          </div>

        </div>

        {/* Price Alert */}

        <div className="price-alert">

          <span>🔔</span>

          <div>

            <h3>
              Price Alert
            </h3>

            <p>
              Get notified when Paddy price changes
              significantly.
            </p>

          </div>

          <button>
            Enable Alert
          </button>

        </div>

        {/* Other Crops */}

        <h2 className="other-crops-title">
          Other Crop Prices
        </h2>

        <div className="crop-grid">

          {crops.map((crop) => (

            <div className="crop-card" key={crop.name}>

              <div className="crop-header">

                <span className="crop-icon">
                  {crop.icon}
                </span>

                <div>
                  <h3>{crop.name}</h3>

                  <p>
                    Procurement Price
                  </p>
                </div>

              </div>

              <h2>
                ₹{crop.price}
                <small> / Qtl</small>
              </h2>

              <div
                className={
                  crop.change.startsWith("+")
                    ? "crop-up"
                    : "crop-down"
                }
              >
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