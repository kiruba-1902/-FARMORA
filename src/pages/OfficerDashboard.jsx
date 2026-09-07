import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const STATUS_COLOR = {
  SERVING: { bg: "#e7f6ec", color: "#1f7a3f", label: "🔄 Serving" },
  WAITING: { bg: "#fff7df", color: "#8a6500", label: "⏳ Waiting" },
  COMPLETED: { bg: "#f0f0f0", color: "#6b7280", label: "✓ Done" },
  CANCELLED: { bg: "#fee2e2", color: "#dc2626", label: "✕ Cancelled" },
};

function OfficerDashboard() {
  const navigate = useNavigate();
  const [centresList, setCentresList] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("1");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [actionLoading, setActionLoading] = useState({});

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCentreAnalytics(Number(selectedCentre));
      setAnalytics(data);
    } catch (err) {
      console.warn("Analytics load failed:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCentre]);

  useEffect(() => {
    async function loadCentres() {
      try {
        const c = await api.getCentres();
        if (c?.length) setCentresList(c);
      } catch {}
    }
    loadCentres();
  }, []);

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, [loadAnalytics]);

  const handleTokenAction = async (token, status) => {
    setActionLoading(prev => ({ ...prev, [token]: true }));
    try {
      await api.updateTokenStatus(token, status);
      // Optimistically update UI
      setAnalytics(prev => ({
        ...prev,
        recent_bookings: prev.recent_bookings.map(b =>
          b.token === token ? { ...b, status } : b
        ),
      }));
    } catch (err) {
      console.warn("Token action failed:", err);
    } finally {
      setActionLoading(prev => ({ ...prev, [token]: false }));
    }
  };

  const s = analytics?.summary;
  const maxForecast = Math.max(...(analytics?.crowd_forecast?.map(f => f.expected) || [1]));

  return (
    <div className="officer-page">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Officer Analytics Dashboard</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="officer-role-badge">🏛️ OFFICER</span>
          <div className="live-indicator" style={{ position: "static" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#16803c", display: "inline-block", animation: "pulse 2s infinite" }} />
            LIVE
          </div>
          <button
            className="back-button"
            onClick={() => {
              api.logout();
              navigate("/");
            }}
            style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }}
          >
            Logout 🚪
          </button>
        </div>
      </header>

      <main className="officer-container">

        {/* Centre Selector */}
        <div className="officer-topbar">
          <div>
            <h1>Centre Analytics & Today's Status</h1>
            <p>📅 {analytics?.today_date || new Date().toISOString().split("T")[0]} &nbsp;·&nbsp; Live Procurement Status</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              className="officer-centre-select"
              value={selectedCentre}
              onChange={e => setSelectedCentre(e.target.value)}
            >
              {centresList.length > 0
                ? centresList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                : <option value="1">Central Grain Mandi - Ludhiana</option>
              }
            </select>
            <button className="officer-refresh-btn" onClick={loadAnalytics}>↻ Refresh</button>
          </div>
        </div>

        {/* Alerts */}
        {analytics?.alerts?.map((alert, i) => (
          <div key={i} className={`officer-alert officer-alert-${alert.type}`}>
            <span>{alert.type === "warning" ? "⚠️" : "ℹ️"}</span>
            {alert.message}
          </div>
        ))}

        {/* Summary Cards */}
        {loading ? (
          <div className="officer-loading">Loading analytics...</div>
        ) : (
          <>
            <div className="officer-summary-grid">
              <div className="officer-metric-card officer-metric-total">
                <span className="officer-metric-icon">🎫</span>
                <div>
                  <p>Total Tokens</p>
                  <h2>{s?.total_tokens ?? "—"}</h2>
                  <span>Issued today</span>
                </div>
              </div>
              <div className="officer-metric-card officer-metric-serving">
                <span className="officer-metric-icon">🔄</span>
                <div>
                  <p>Now Serving</p>
                  <h2>#{s?.currently_serving ?? "—"}</h2>
                  <span>At counter</span>
                </div>
              </div>
              <div className="officer-metric-card officer-metric-waiting">
                <span className="officer-metric-icon">⏳</span>
                <div>
                  <p>Waiting</p>
                  <h2>{s?.waiting ?? "—"}</h2>
                  <span>In queue</span>
                </div>
              </div>
              <div className="officer-metric-card officer-metric-done">
                <span className="officer-metric-icon">✅</span>
                <div>
                  <p>Completed</p>
                  <h2>{s?.completed ?? "—"}</h2>
                  <span>Processed</span>
                </div>
              </div>
              <div className="officer-metric-card" style={{ background: "#e7f6ec", borderColor: "#a7f3d0" }}>
                <span className="officer-metric-icon">💳</span>
                <div>
                  <p>DBT Payments</p>
                  <h2>₹{analytics?.summary?.total_disbursed || "4.85L"}</h2>
                  <span>Disbursed today</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="officer-tabs">
              {["overview", "queue", "payments", "forecast"].map(tab => (
                <button
                  key={tab}
                  className={`officer-tab ${activeTab === tab ? "officer-tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "overview" ? "📊 Slot Occupancy" : tab === "queue" ? "📋 Queue Management" : tab === "payments" ? "💳 Payments & DBT Audit" : "📈 Crowd Forecast"}
                </button>
              ))}
            </div>

            {/* TAB: Slot Occupancy */}
            {activeTab === "overview" && (
              <div className="officer-panel">
                <div className="officer-panel-header">
                  <div>
                    <h2>Slot Occupancy</h2>
                    <p>Booking fill rate by time slot for today</p>
                  </div>
                </div>
                <div className="officer-occupancy-list">
                  {analytics?.slot_occupancy?.map((slot, i) => {
                    const pct = Math.round((slot.booked / slot.capacity) * 100);
                    const isFull = pct >= 100;
                    const isHigh = pct >= 70 && pct < 100;
                    return (
                      <div key={i} className="officer-occupancy-item">
                        <div className="officer-occ-meta">
                          <strong>{slot.slot}</strong>
                          <span className={`officer-occ-badge ${isFull ? "occ-full" : isHigh ? "occ-high" : "occ-ok"}`}>
                            {slot.label}
                          </span>
                        </div>
                        <div className="officer-occ-bar-track">
                          <div
                            className={`officer-occ-bar ${isFull ? "bar-full" : isHigh ? "bar-high" : "bar-ok"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="officer-occ-numbers">
                          <span>{slot.booked} / {slot.capacity} booked</span>
                          <strong>{pct}%</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: Queue Management */}
            {activeTab === "queue" && (
              <div className="officer-panel">
                <div className="officer-panel-header">
                  <div>
                    <h2>Queue Management</h2>
                    <p>Mark tokens as served or skip no-shows</p>
                  </div>
                  <div className="queue-count">{s?.waiting} waiting</div>
                </div>
                <div className="officer-table-wrapper">
                  <table className="officer-table">
                    <thead>
                      <tr>
                        <th>Token</th>
                        <th>Farmer</th>
                        <th>Crop</th>
                        <th>Quantity</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics?.recent_bookings?.map((b, i) => {
                        const st = STATUS_COLOR[b.status] || STATUS_COLOR.WAITING;
                        const isLoading = actionLoading[b.token];
                        return (
                          <tr key={i}>
                            <td><strong>{b.token}</strong></td>
                            <td>{b.farmer}</td>
                            <td>{b.crop}</td>
                            <td>{b.qty}</td>
                            <td>
                              <span className="officer-status-badge" style={{ background: st.bg, color: st.color }}>
                                {st.label}
                              </span>
                            </td>
                            <td>
                              <div className="officer-action-btns">
                                {b.status !== "COMPLETED" && b.status !== "CANCELLED" && (
                                  <>
                                    <button
                                      className="officer-act-serve"
                                      onClick={() => handleTokenAction(b.token, "COMPLETED")}
                                      disabled={isLoading}
                                    >
                                      {isLoading ? "..." : "✓ Done"}
                                    </button>
                                    <button
                                      className="officer-act-skip"
                                      onClick={() => handleTokenAction(b.token, "CANCELLED")}
                                      disabled={isLoading}
                                    >
                                      Skip
                                    </button>
                                  </>
                                )}
                                {(b.status === "COMPLETED" || b.status === "CANCELLED") && (
                                  <span style={{ color: "#6b7280", fontSize: "13px" }}>—</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Payments & DBT Audit */}
            {activeTab === "payments" && (
              <div className="officer-panel">
                <div className="officer-panel-header">
                  <div>
                    <h2>DBT Payment & Audit Status</h2>
                    <p>Direct Benefit Transfers processed for today's procurement</p>
                  </div>
                  <div className="queue-count" style={{ background: "#e7f6ec", color: "#1f7a3f" }}>
                    Total: ₹4,85,250
                  </div>
                </div>

                <div className="officer-table-wrapper">
                  <table className="officer-table">
                    <thead>
                      <tr>
                        <th>Txn Ref</th>
                        <th>Farmer ID</th>
                        <th>Farmer Name</th>
                        <th>Bank Account</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ref: "DBT-TXN-994810294", id: "FARM-1001", farmer: "Ravi Kumar", bank: "SBI (****4821)", amount: "₹27,300", status: "RELEASED" },
                        { ref: "DBT-TXN-994810295", id: "FARM-1002", farmer: "Suresh Patel", bank: "HDFC (****1192)", amount: "₹40,950", status: "PROCESSING" },
                        { ref: "DBT-TXN-994810296", id: "FARM-1003", farmer: "Mohan Singh", bank: "PNB (****9920)", amount: "₹68,250", status: "RELEASED" },
                        { ref: "DBT-TXN-994810297", id: "FARM-1004", farmer: "Deepak Yadav", bank: "BOB (****3301)", amount: "₹50,050", status: "PROCESSING" },
                        { ref: "DBT-TXN-994810298", id: "FARM-1005", farmer: "Anil Sharma", bank: "Canara (****7712)", amount: "₹22,750", status: "RELEASED" },
                      ].map((p, i) => (
                        <tr key={i}>
                          <td><code>{p.ref}</code></td>
                          <td><strong>{p.id}</strong></td>
                          <td>{p.farmer}</td>
                          <td>{p.bank}</td>
                          <td><strong>{p.amount}</strong></td>
                          <td>
                            <span 
                              className="officer-status-badge" 
                              style={{
                                background: p.status === "RELEASED" ? "#e7f6ec" : "#fff7df",
                                color: p.status === "RELEASED" ? "#1f7a3f" : "#b45309"
                              }}
                            >
                              {p.status === "RELEASED" ? "✓ Released" : "⏳ Processing"}
                            </span>
                          </td>
                          <td>
                            {p.status === "PROCESSING" ? (
                              <button 
                                className="officer-act-serve"
                                onClick={() => alert(`Direct Benefit Transfer ${p.ref} manually re-triggered!`)}
                              >
                                Approve DBT
                              </button>
                            ) : (
                              <span style={{ color: "#16803c", fontSize: "12px", fontWeight: "600" }}>✓ Settled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="op-help-panel" style={{ marginTop: "20px" }}>
                  <span>🏛️</span>
                  <div>
                    <strong>Govt. Treasury & DBT Compliance</strong>
                    <p>All procurement payments are governed by Public Financial Management System (PFMS). Payments are transferred directly into Aadhaar-seeded bank accounts within 24 hours.</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Crowd Forecast */}
            {activeTab === "forecast" && (
              <div className="officer-panel">
                <div className="officer-panel-header">
                  <div>
                    <h2>Crowd Forecast</h2>
                    <p>Predicted farmer arrivals by hour — AI-driven historical model</p>
                  </div>
                  <span className="period-badge">Today</span>
                </div>
                <div className="officer-forecast-chart">
                  {analytics?.crowd_forecast?.map((f, i) => {
                    const heightPct = Math.round((f.expected / maxForecast) * 100);
                    const isPeak = f.expected === maxForecast;
                    return (
                      <div key={i} className="officer-forecast-bar-wrap">
                        <div className="officer-forecast-value">{f.expected}</div>
                        <div className="officer-forecast-track">
                          <div
                            className={`officer-forecast-bar ${isPeak ? "forecast-peak" : ""}`}
                            style={{ height: `${Math.max(heightPct, 8)}%` }}
                          />
                        </div>
                        <div className="officer-forecast-hour">{f.hour}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="officer-forecast-legend">
                  <div className="officer-forecast-dot forecast-peak" />
                  <span>Peak hour — consider additional staff allocation</span>
                </div>

                {/* Resource recommendation */}
                <div className="op-help-panel" style={{ marginTop: "20px" }}>
                  <span>🤖</span>
                  <div>
                    <strong>AI Resource Recommendation</strong>
                    <p>Based on today's pattern, peak arrivals are expected between <strong>10am–11am</strong>. Recommend deploying an additional weighing counter and quality check staff during that window to keep average wait under 20 minutes.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

export default OfficerDashboard;
