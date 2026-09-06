import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import {
  booking as mockBooking,
  queue,
} from "../data/mockData";

function MyBooking() {
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedBooking = localStorage.getItem("farmoraBooking");

    if (savedBooking) {
      setBooking(JSON.parse(savedBooking));
    } else {
      // Use demo booking from shared mock data
      setBooking(mockBooking);
    }
  }, []);

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
    token: booking.token,
    farmerId: booking.farmerId,
    centre: booking.centre,
    date: booking.date,
    time: booking.time,
  });

  const queuePosition =
    queue.farmerToken - queue.currentToken;

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
              <strong>{queue.estimatedWait} minutes</strong>
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