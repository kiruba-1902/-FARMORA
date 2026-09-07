import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { procurement as mockProcurement, payment as mockPayment } from "../data/mockData";

function Procurement() {
  const navigate = useNavigate();

  const [procurement, setProcurement] = useState({
    token: "TKN-1-001",
    crop: "Wheat",
    quantity: 12,
    rate: 2275,
    centre: "Central Grain Mandi - Ludhiana",
    status: "Procurement Scheduled",
  });

  const [paymentData, setPaymentData] = useState({
    amount: 27300,
    status: "Pending",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const active = await api.getActiveBooking();
        if (active) {
          const qty = active.quantity > 100 ? active.quantity / 100 : active.quantity;
          const cropName = active.crop?.name || active.crop || "Wheat";
          const centreName = active.centre?.name || active.centre || "Central Grain Mandi - Ludhiana";
          const tokenStr = active.token?.token_number || active.token || "TKN-1-001";

          setProcurement({
            token: tokenStr,
            crop: cropName,
            quantity: qty,
            rate: 2275,
            centre: centreName,
            status: active.status || "CONFIRMED",
          });

          // Fetch linked payment
          const payment = await api.getPayment(active.id || 1);
          if (payment) {
            setPaymentData({
              amount: payment.amount || qty * 2275,
              status: payment.payment_status || "Pending",
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load procurement status:", err);
      }
    }
    loadData();
  }, []);

  const totalAmount = paymentData.amount || procurement.quantity * procurement.rate;

  const steps = [
    {
      title: "Verification",
      description: "Farmer details verified",
      status: "completed",
      icon: "✓",
    },
    {
      title: "Quality Check",
      description: "Crop quality verified",
      status: "completed",
      icon: "✓",
    },
    {
      title: "Weighing",
      description: "Crop weighing in progress",
      status: "current",
      icon: "⚖️",
    },
    {
      title: "Procurement",
      description: "Procurement confirmation pending",
      status: "pending",
      icon: "4",
    },
    {
      title: "Payment",
      description: "Payment will be processed after procurement",
      status: "pending",
      icon: "5",
    },
  ];

  return (
    <div className="procurement-page">

      {/* Header */}

      <header className="dashboard-header">

        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Procurement Status</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>

      </header>

      <main className="procurement-container">

        {/* Title */}

        <div className="procurement-title">

          <h1>📦 My Procurement</h1>

          <p>
            Track your crop procurement from verification to payment.
          </p>

        </div>

        {/* Summary */}

        <div className="procurement-summary">

          <div className="summary-item">
            <span>🎫 Token</span>
            <strong>{procurement.token}</strong>
          </div>

          <div className="summary-item">
            <span>🌾 Crop</span>
            <strong>{procurement.crop}</strong>
          </div>

          <div className="summary-item">
            <span>⚖️ Quantity</span>
            <strong>{procurement.quantity} Quintals</strong>
          </div>

          <div className="summary-item">
            <span>📍 Centre</span>
            <strong>{procurement.centre}</strong>
          </div>

        </div>

        {/* Current status */}

        <div className="current-status">

          <div className="current-status-icon">
            ⚖️
          </div>

          <div>
            <span>Current Status</span>

            <h2>
              Weighing in Progress
            </h2>

            <p>
              Your crop is currently being weighed at the procurement centre.
            </p>
          </div>

        </div>

        {/* Timeline */}

        <div className="procurement-card">

          <h2>Procurement Progress</h2>

          <p className="card-subtitle">
            Real-time status of your procurement
          </p>

          <div className="procurement-timeline">

            {steps.map((step, index) => (

              <div
                className={`procurement-step ${step.status}`}
                key={step.title}
              >

                <div className="procurement-step-icon">
                  {step.icon}
                </div>

                <div className="procurement-step-content">

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.description}
                  </p>

                </div>

                {index < steps.length - 1 && (
                  <div className="procurement-step-line"></div>
                )}

              </div>

            ))}

          </div>

        </div>

        {/* Payment & DBT Tracking */}

        <div className="payment-card">

          <div className="payment-header">

            <div>
              <h2>💰 Payment & DBT Tracking</h2>

              <p>
                Direct Benefit Transfer to Registered Bank Account
              </p>
            </div>

            <span 
              className="payment-status" 
              style={{
                background: paymentData.status === "RELEASED" ? "#e7f6ec" : "#fff7df",
                color: paymentData.status === "RELEASED" ? "#1f7a3f" : "#b45309",
                border: "1px solid currentColor"
              }}
            >
              ● {paymentData.status || "PROCESSING"}
            </span>

          </div>

          <div className="payment-calculation">

            <div>
              <span>Procured Quantity</span>
              <strong>
                {procurement.quantity} Qtl
              </strong>
            </div>

            <div>
              <span>MSP Rate</span>
              <strong>
                ₹{procurement.rate.toLocaleString()} / Qtl
              </strong>
            </div>

            <div className="payment-total">
              <span>Total Amount</span>
              <strong>
                ₹{totalAmount.toLocaleString()}
              </strong>
            </div>

          </div>

          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f3f4f6", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>🏦 Credit Bank Account</span>
              <strong>{paymentData.bankAccount || mockPayment.bankAccount}</strong>
            </div>
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>📄 DBT Transaction Ref</span>
              <strong>{paymentData.transactionRef || mockPayment.transactionRef}</strong>
            </div>
            <div>
              <span style={{ color: "#6b7280", display: "block" }}>⏱️ Estimated Payout</span>
              <strong>{paymentData.estimatedPayoutDate || mockPayment.estimatedPayoutDate}</strong>
            </div>
          </div>

          <div className="payment-note" style={{ marginTop: "14px" }}>
            ℹ️ Payment directly credited via Govt. DBT (Direct Benefit Transfer) within 24 hours of procurement completion.
          </div>

        </div>

        {/* Queue */}

        <div className="procurement-actions">

          <button onClick={() => navigate("/queue")}>
            🕐 View Live Queue
          </button>

          <button onClick={() => navigate("/my-booking")}>
            🎫 View Token
          </button>

        </div>

      </main>

    </div>
  );
}

export default Procurement;