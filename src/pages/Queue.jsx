import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Queue() {
  const navigate = useNavigate();

  const [currentToken, setCurrentToken] = useState(117);

  const farmerToken = 124;

  const queuePosition = farmerToken - currentToken;

  const estimatedTime = queuePosition * 5;

  // Demo simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentToken((previous) => {
        if (previous < farmerToken - 1) {
          return previous + 1;
        }

        return previous;
      });
    }, 10000);

    return () => clearInterval(timer);
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

            <span className="queue-icon">
              🎫
            </span>

            <p>Now Serving</p>

            <h2>
              A-{currentToken}
            </h2>

          </div>

          <div className="queue-card highlight">

            <span className="queue-icon">
              👤
            </span>

            <p>Your Token</p>

            <h2>
              A-{farmerToken}
            </h2>

          </div>

          <div className="queue-card">

            <span className="queue-icon">
              👥
            </span>

            <p>Queue Position</p>

            <h2>
              #{queuePosition}
            </h2>

          </div>

          <div className="queue-card">

            <span className="queue-icon">
              ⏱️
            </span>

            <p>Estimated Wait</p>

            <h2>
              {estimatedTime} min
            </h2>

          </div>

        </div>

        {/* Progress */}

        <div className="queue-panel">

          <div className="queue-panel-header">

            <div>

              <h2>
                Procurement Queue
              </h2>

              <p>
                Central Procurement Centre
              </p>

            </div>

            <div className="queue-count">
              {queuePosition} farmers ahead
            </div>

          </div>

          <div className="progress-container">

            <div
              className="progress-bar"
              style={{
                width: `${Math.min(
                  ((currentToken - 117) /
                    (farmerToken - 117)) *
                    100,
                  100
                )}%`,
              }}
            ></div>

          </div>

          <div className="queue-list">

            {Array.from(
              { length: 8 },
              (_, index) => currentToken + index
            ).map((token) => (

              <div
                key={token}
                className={`queue-item ${
                  token === farmerToken
                    ? "your-token"
                    : token === currentToken
                    ? "serving-token"
                    : ""
                }`}
              >

                <span>
                  A-{token}
                </span>

                <span>

                  {token === currentToken
                    ? "🔄 Now Serving"
                    : token === farmerToken
                    ? "👤 You"
                    : "Waiting"}

                </span>

              </div>

            ))}

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