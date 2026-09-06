import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Booking() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    crop: "Paddy",
    centre: "",
    date: "",
    time: "",
    quantity: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = (e) => {
    e.preventDefault();

    if (
      !form.centre ||
      !form.date ||
      !form.time ||
      !form.quantity
    ) {
      alert("Please fill all the details");
      return;
    }

    const booking = {
      ...form,
      token: "A-124",
      farmerId: localStorage.getItem("farmerId"),
      status: "Slot Booked",
    };

    localStorage.setItem(
      "farmoraBooking",
      JSON.stringify(booking)
    );

    alert("Slot booked successfully! Token: A-124");

    navigate("/my-booking");
  };

  return (
    <div className="booking-page">

      <header className="dashboard-header">
        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Book Procurement Slot</p>
        </div>
      </header>

      <main className="booking-container">

        <h1>📅 Book Procurement Slot</h1>

        <p className="booking-intro">
          Select your preferred procurement centre and time slot.
        </p>

        <form
          className="booking-form"
          onSubmit={handleBooking}
        >

          {/* Crop */}

          <div className="form-group">
            <label>Crop</label>

            <select
              name="crop"
              value={form.crop}
              onChange={handleChange}
            >
              <option value="Paddy">🌾 Paddy</option>
              <option value="Wheat">🌾 Wheat</option>
              <option value="Cotton">🌿 Cotton</option>
              <option value="Maize">🌽 Maize</option>
            </select>
          </div>

          {/* Centre */}

          <div className="form-group">
            <label>Procurement Centre</label>

            <select
              name="centre"
              value={form.centre}
              onChange={handleChange}
            >
              <option value="">
                Select procurement centre
              </option>

              <option value="Central Procurement Centre">
                Central Procurement Centre
              </option>

              <option value="North Village Centre">
                North Village Centre
              </option>

              <option value="South Village Centre">
                South Village Centre
              </option>
            </select>
          </div>

          {/* Date */}

          <div className="form-group">
            <label>Preferred Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {/* Time */}

          <div className="form-group">
            <label>Available Time Slot</label>

            <select
              name="time"
              value={form.time}
              onChange={handleChange}
            >
              <option value="">
                Select time slot
              </option>

              <option value="09:00 AM - 10:00 AM">
                09:00 AM - 10:00 AM
              </option>

              <option value="10:00 AM - 11:00 AM">
                10:00 AM - 11:00 AM
              </option>

              <option value="11:00 AM - 12:00 PM">
                11:00 AM - 12:00 PM
              </option>

              <option value="02:00 PM - 03:00 PM">
                02:00 PM - 03:00 PM
              </option>
            </select>
          </div>

          {/* Quantity */}

          <div className="form-group">
            <label>Expected Quantity (Quintals)</label>

            <input
              type="number"
              name="quantity"
              min="1"
              placeholder="Example: 25"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>

          <button
            className="confirm-booking"
            type="submit"
          >
            Confirm Slot Booking →
          </button>

        </form>

      </main>
    </div>
  );
}

export default Booking;