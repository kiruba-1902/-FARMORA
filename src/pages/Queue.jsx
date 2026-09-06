import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { queue as mockQueue } from "../data/mockData";

function Queue() {
  const navigate = useNavigate();

  const [currentToken, setCurrentToken] = useState("TKN-1-001");
  const [farmerToken, setFarmerToken] = useState("TKN-1-002");
  const [queuePosition, setQueuePosition] = useState(2);
  const [estimatedTime, setEstimatedTime] = useState(20);
  const [queueList, setQueueList] = useState([]);
  const [centreName, setCentreName] = useState("Central Grain Mandi - Ludhiana");

  const fetchQueueData = async () => {
    try {
      const data = await api.getQueue(1);
      if (data) {
        if (data.centre_name) setCentreName(data.centre_name);

        const summary = data.queue_summary;
        if (summary?.currently_serving) {
          setCurrentToken(summary.currently_serving);
        }

        const myTok = data.your_tokens?.[0];
        if (myTok) {
          setFarmerToken(myTok.token_number);
          setQueuePosition(myTok.queue_position);
          setEstimatedTime(myTok.estimated_wait_minutes || myTok.queue_position * 10);
        }

        if (data.tokens) {
          setQueueList(data.tokens);
        } else if (data.queue_flow) {
          setQueueList(data.queue_flow);
        }
      }
    } catch (err) {
      console.warn("Error fetching queue:", err);
    }
  };

  useEffect(() => {
    fetchQueueData();
    const interval = setInterval(fetchQueueData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="queue-page">

      {/* Header */}

      <header className="dashboard-header">

        <div>
          <div className="brand">🚜 FARMORA</div>

          <p>Live Procurement Queue</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      <main className="queue-container">

        {/* Title */}

        <div className="queue-title">

          <h1>🕐 Live Queue</h1>

          <p>
            Track your position and estimated waiting time.
          </p>

          <div className="live-indicator">
            <span></span>
            LIVE
          </div>

        </div>

        {/* Main Queue Cards */}
        <div className="queue-grid">
          <div className="queue-card">
            <span className="queue-icon">🎫</span>
            <p>Now Serving</p>
            <h2>{currentToken}</h2>
          </div>

          <div className="queue-card highlight">
            <span className="queue-icon">👤</span>
            <p>Your Token</p>
            <h2>{farmerToken}</h2>
          </div>

          <div className="queue-card">
            <span className="queue-icon">👥</span>
            <p>Queue Position</p>
            <h2>#{queuePosition}</h2>
          </div>

          <div className="queue-card">
            <span className="queue-icon">⏱️</span>
            <p>Estimated Wait</p>
            <h2>{estimatedTime} min</h2>
          </div>
        </div>

        {/* Progress */}
        <div className="queue-panel">
          <div className="queue-panel-header">
            <div>
              <h2>Procurement Queue</h2>
              <p>{centreName}</p>
            </div>
            <div className="queue-count">
              {queuePosition > 1 ? `${queuePosition - 1} farmers ahead` : "You are next in line"}
            </div>
          </div>

          <div className="queue-list" style={{ marginTop: "15px" }}>
            {queueList.length > 0 ? (
              queueList.map((item, idx) => {
                const tokNum = item.token_number || item;
                const isServing = tokNum === currentToken;
                const isMe = tokNum === farmerToken;
                return (
                  <div
                    key={tokNum || idx}
                    className={`queue-item ${isMe ? "your-token" : isServing ? "serving-token" : ""}`}
                  >
                    <span>{tokNum}</span>
                    <span>
                      {isServing ? "🔄 Now Serving" : isMe ? "👤 Your Token" : "Waiting"}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="queue-item your-token">
                <span>{farmerToken}</span>
                <span>👤 Your Token (In Queue)</span>
              </div>
            )}
          </div>
        </div>

        {/* Information */}

        <div className="queue-info">

          <span>💡</span>

          <div>

            <h3>
              You don't need to wait in line!
            </h3>

            <p>
              You can arrive closer to your estimated
              procurement time. Farmora will notify you
              when your turn is approaching.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Queue;