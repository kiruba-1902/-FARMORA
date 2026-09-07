import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function Booking() {
  const navigate = useNavigate();

  const [cropsList, setCropsList] = useState([]);
  const [centresList, setCentresList] = useState([]);
  const [slotsList, setSlotsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    cropId: "1",
    centreId: "1",
    date: new Date().toISOString().split("T")[0],
    slotId: "",
    quantity: "",
  });

  // Load Crops & Centres on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const [crops, centres] = await Promise.all([
          api.getCrops(),
          api.getCentres(),
        ]);
        if (crops?.length) {
          setCropsList(crops);
          setForm((f) => ({ ...f, cropId: String(crops[0].id) }));
        }
        if (centres?.length) {
          setCentresList(centres);
          setForm((f) => ({ ...f, centreId: String(centres[0].id) }));
        }
      } catch (err) {
        console.warn("Error loading crops/centres:", err);
      }
    }
    loadInitial();
  }, []);

  // Load Slots whenever centre or date changes
  useEffect(() => {
    async function loadSlots() {
      if (!form.centreId || !form.date) return;
      try {
        const slots = await api.getSlots(form.centreId, form.date);
        setSlotsList(slots || []);
        if (slots?.length) {
          setForm((f) => ({ ...f, slotId: String(slots[0].id) }));
        } else {
          setForm((f) => ({ ...f, slotId: "" }));
        }
      } catch (err) {
        console.warn("Error loading slots:", err);
      }
    }
    loadSlots();
  }, [form.centreId, form.date]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.centreId || !form.date || !form.slotId || !form.quantity) {
      setError("Please fill all the details and select a slot");
      return;
    }

    setLoading(true);
    try {
      const result = await api.createBooking({
        cropId: form.cropId,
        centreId: form.centreId,
        slotId: form.slotId,
        quantity: Number(form.quantity) * 100, // convert Quintals to kg for backend
      });

      const tokenNum = result.token?.token_number || "TKN-1-001";
      alert(`Slot booked successfully! Your Token: ${tokenNum}`);
      navigate("/my-booking");
    } catch (err) {
      setError(err.message || "Slot booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">

      <header className="dashboard-header">
        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Book Procurement Slot</p>
        </div>
        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Dashboard
        </button>
      </header>

      <main className="booking-container">

        <h1>📅 Book Procurement Slot</h1>

        <p className="booking-intro">
          Select your crop, preferred centre and time slot.
        </p>

        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

        <form
          className="booking-form"
          onSubmit={handleBooking}
        >

          {/* Crop */}
          <div className="form-group">
            <label>Crop</label>
            <select
              name="cropId"
              value={form.cropId}
              onChange={handleChange}
            >
              {cropsList.map((c) => (
                <option key={c.id} value={c.id}>
                  🌾 {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Centre */}
          <div className="form-group">
            <label>Procurement Centre</label>
            <select
              name="centreId"
              value={form.centreId}
              onChange={handleChange}
            >
              {centresList.map((cnt) => (
                <option key={cnt.id} value={cnt.id}>
                  📍 {cnt.name} ({cnt.district})
                </option>
              ))}
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

          {/* Time Slot */}
          <div className="form-group">
            <label>Available Time Slot</label>
            <select
              name="slotId"
              value={form.slotId}
              onChange={handleChange}
            >
              {slotsList.length === 0 ? (
                <option value="">No available slots for this date</option>
              ) : (
                slotsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    🕒 {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)} (Capacity: {s.available_capacity ?? s.capacity} left)
                  </option>
                ))
              )}
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
            disabled={loading}
          >
            {loading ? "Confirming Slot..." : "Confirm Slot Booking →"}
          </button>

        </form>

      </main>
    </div>
  );
}

export default Booking;