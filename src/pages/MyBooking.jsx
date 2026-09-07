import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { booking as mockBooking, queue as mockQueue } from "../data/mockData";

function MyBooking() {
  const [booking, setBooking] = useState(null);
  const [queueInfo, setQueueInfo] = useState(mockQueue);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadBooking() {
      setLoading(true);
      try {
        const active = await api.getActiveBooking();
        if (active) {
          // Normalize structure between API and legacy UI
          const tokenStr = active.token?.token_number || active.token || "TKN-1-001";
          const cropName = active.crop?.name || active.crop || "Wheat";
          const centreName = active.centre?.name || active.centre || "Central Grain Mandi - Ludhiana";
          const slotDate = active.slot?.slot_date || active.date || new Date().toISOString().slice(0, 10);
          const slotTime = active.slot?.start_time ? `${active.slot.start_time.slice(0, 5)} - ${active.slot.end_time.slice(0, 5)}` : (active.time || "09:00 - 12:00");
          const farmerCode = active.farmer?.farmer_id || active.farmerId || localStorage.getItem("farmerId") || "FARM-1001";
          const qty = active.quantity > 100 ? (active.quantity / 100).toFixed(1) : active.quantity;

          setBooking({
            id: active.id,
            bookingId: active.booking_id || active.bookingId || "BK-001",
            token: tokenStr,
            crop: cropName,
            centre: centreName,
            date: slotDate,
            time: slotTime,
            farmerId: farmerCode,
            quantity: qty,
            status: active.status || "CONFIRMED",
          });

          // Fetch queue info for this centre
          const qData = await api.getQueue(active.centre_id || 1);
          if (qData) {
            const yourTok = qData.your_tokens?.[0];
            const summary = qData.queue_summary;
            setQueueInfo({
              farmersAhead: yourTok ? Math.max(0, yourTok.queue_position - 1) : 2,
              estimatedWait: yourTok?.estimated_wait_minutes || 20,
              currentToken: summary?.currently_serving || "TKN-1-001",
            });
          }
        }
      } catch (err) {
        console.warn("Error loading booking:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, []);

  if (loading) {
    return (
      <div className="booking-page">
        <header className="dashboard-header">
          <div className="brand">🚜 FARMORA</div>
        </header>
        <main className="booking-container">
          <p>Loading your booking details...</p>
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-page">
        <header className="dashboard-header">
          <div>
            <div className="brand">🚜 FARMORA</div>
            <p>My Booking</p>
          </div>
        </header>

        <main className="booking-container">
          <h1>No Active Booking</h1>

          <p className="booking-intro">
            You have not booked a procurement slot yet.
          </p>

          <button
            className="confirm-booking"
            onClick={() => navigate("/booking")}
          >
            Book a Slot →
          </button>
        </main>
      </div>
    );
  }

  const qrData = JSON.stringify({
    bookingId: booking.bookingId,
    token: booking.token,
    farmerId: booking.farmerId,
    centre: booking.centre,
    date: booking.date,
    time: booking.time,
  });

  const queuePosition = queueInfo.farmersAhead ?? 2;

  return (
    <div className="booking-page">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Digital Procurement Token</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="token-container">

        {/* Success */}
        <div className="success-message">
          <div className="success-icon">✓</div>

          <h1>Booking Confirmed!</h1>

          <p>
            Your procurement slot has been successfully booked.
          </p>
        </div>

        {/* Token Card */}
        <div className="token-card">

          <p className="token-label">
            YOUR DIGITAL TOKEN
          </p>

          <h2>{booking.token}</h2>

          <div className="token-status">
            ● {booking.status}
          </div>

          {/* QR Code */}
          <div className="qr-section">
            <QRCodeCanvas
              value={qrData}
              size={180}
            />

            <p>
              Show this QR code at the procurement centre.
            </p>
          </div>

          {/* Booking Details */}
          <div className="booking-details">

            <div>
              <span>👤 Farmer ID</span>
              <strong>{booking.farmerId}</strong>
            </div>

            <div>
              <span>🌾 Crop</span>
              <strong>{booking.crop}</strong>
            </div>

            <div>
              <span>⚖️ Quantity</span>
              <strong>{booking.quantity} Quintals</strong>
            </div>

            <div>
              <span>📍 Procurement Centre</span>
              <strong>{booking.centre}</strong>
            </div>

            <div>
              <span>📅 Date</span>
              <strong>{booking.date}</strong>
            </div>

            <div>
              <span>🕐 Time Slot</span>
              <strong>{booking.time}</strong>
            </div>

          </div>
        </div>

        {/* Queue Information */}
        <div className="queue-preview">

          <span>🕐</span>

          <div>
            <h3>Live Queue</h3>

            <p>
              Farmers ahead:{" "}
              <strong>{queuePosition}</strong>
            </p>

            <p>
              Estimated waiting time:{" "}
              <strong>{queueInfo.estimatedWait} minutes</strong>
            </p>
          </div>

          <button onClick={() => navigate("/queue")}>
            View Queue →
          </button>

        </div>

      </main>

    </div>
  );
}

export default MyBooking;