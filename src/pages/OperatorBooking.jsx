import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function OperatorBooking() {
  const navigate = useNavigate();

  // Step state: "search" -> "booking" -> "confirmed"
  const [step, setStep] = useState("search");

  // Farmer lookup & registration
  const [farmerQuery, setFarmerQuery] = useState("");
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState("");
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    phone: "",
    village: "",
    district: "Ludhiana",
  });

  const handleCreateFarmer = async (e) => {
    e.preventDefault();
    setLookupError("");
    setRegSuccess("");

    if (!newFarmer.name.trim() || !newFarmer.phone.trim() || !newFarmer.village.trim()) {
      setLookupError("Please fill all required fields (Name, Phone, Village)");
      return;
    }

    setLookupLoading(true);
    try {
      const generatedId = `FARM-${Math.floor(1000 + Math.random() * 9000)}`;
      const profile = {
        id: Date.now(),
        farmer_id: generatedId,
        name: newFarmer.name.trim(),
        phone: newFarmer.phone.trim(),
        village: newFarmer.village.trim(),
        district: newFarmer.district.trim() || "Ludhiana",
        crops: ["Paddy", "Wheat"],
      };

      setFarmerProfile(profile);
      setRegSuccess(`Farmer Profile Created! Generated ID: ${generatedId}`);
      setStep("booking");
    } catch (err) {
      setLookupError(err.message || "Failed to create farmer profile");
    } finally {
      setLookupLoading(false);
    }
  };

  // Booking form
  const [cropsList, setCropsList] = useState([]);
  const [centresList, setCentresList] = useState([]);
  const [slotsList, setSlotsList] = useState([]);
  const [formError, setFormError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [form, setForm] = useState({
    cropId: "1",
    centreId: "1",
    date: new Date().toISOString().split("T")[0],
    slotId: "",
    quantity: "",
    operatorNote: "",
  });

  // Confirmed token
  const [confirmedToken, setConfirmedToken] = useState(null);

  useEffect(() => {
    async function loadInitial() {
      try {
        const [crops, centres] = await Promise.all([api.getCrops(), api.getCentres()]);
        if (crops?.length) { setCropsList(crops); setForm(f => ({ ...f, cropId: String(crops[0].id) })); }
        if (centres?.length) { setCentresList(centres); setForm(f => ({ ...f, centreId: String(centres[0].id) })); }
      } catch (err) { console.warn("Failed to load crops/centres", err); }
    }
    loadInitial();
  }, []);

  useEffect(() => {
    async function loadSlots() {
      if (!form.centreId || !form.date) return;
      try {
        const slots = await api.getSlots(form.centreId, form.date);
        setSlotsList(slots || []);
        if (slots?.length) setForm(f => ({ ...f, slotId: String(slots[0].id) }));
        else setForm(f => ({ ...f, slotId: "" }));
      } catch (err) { console.warn("Failed to load slots", err); }
    }
    if (step === "booking") loadSlots();
  }, [form.centreId, form.date, step]);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLookupError("");
    if (!farmerQuery.trim()) { setLookupError("Please enter a Farmer ID"); return; }
    setLookupLoading(true);
    try {
      const farmer = await api.lookupFarmer(farmerQuery.trim());
      if (farmer) { setFarmerProfile(farmer); setStep("booking"); }
      else setLookupError("No farmer found. Please check the ID and try again.");
    } catch {
      setLookupError("Lookup failed. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.centreId || !form.date || !form.slotId || !form.quantity) {
      setFormError("Please fill all fields and select a time slot."); return;
    }
    setBookingLoading(true);
    try {
      const result = await api.operatorCreateBooking({
        farmerId: farmerProfile.id || 1,
        cropId: form.cropId,
        centreId: form.centreId,
        slotId: form.slotId,
        quantity: Number(form.quantity) * 100,
        operatorNote: form.operatorNote,
      });
      setConfirmedToken(result?.token?.token_number || result?.booking_id || "A-NEW");
      setStep("confirmed");
    } catch (err) {
      setFormError(err.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const resetAll = () => {
    setStep("search");
    setFarmerQuery("");
    setFarmerProfile(null);
    setLookupError("");
    setFormError("");
    setConfirmedToken(null);
    setForm({ cropId: "1", centreId: "1", date: new Date().toISOString().split("T")[0], slotId: "", quantity: "", operatorNote: "" });
  };

  const selectedCrop = cropsList.find(c => String(c.id) === form.cropId);
  const selectedCentre = centresList.find(c => String(c.id) === form.centreId);
  const selectedSlot = slotsList.find(s => String(s.id) === form.slotId);

  return (
    <div className="operator-page">

      <header className="dashboard-header">
        <div>
          <div className="brand">🚜 FARMORA</div>
          <p>Operator Procurement Terminal</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span className="op-role-badge">🎯 OPERATOR</span>
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

      <main className="operator-container">

        {/* Step Progress */}
        <div className="op-steps">
          <div className={`op-step ${step === "search" ? "op-step-active" : step !== "search" ? "op-step-done" : ""}`}>
            <div className="op-step-circle">{step !== "search" ? "✓" : "1"}</div>
            <span>Find Farmer</span>
          </div>
          <div className="op-step-line" />
          <div className={`op-step ${step === "booking" ? "op-step-active" : step === "confirmed" ? "op-step-done" : ""}`}>
            <div className="op-step-circle">{step === "confirmed" ? "✓" : "2"}</div>
            <span>Book Slot</span>
          </div>
          <div className="op-step-line" />
          <div className={`op-step ${step === "confirmed" ? "op-step-active" : ""}`}>
            <div className="op-step-circle">3</div>
            <span>Token Issued</span>
          </div>
        </div>

        {/* STEP 1: Farmer Lookup & Registration */}
        {step === "search" && (
          <div className="op-card">
            
            {/* Mode Selector Header */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #f3f4f6", paddingBottom: "12px" }}>
              <button
                type="button"
                onClick={() => { setIsRegistering(false); setLookupError(""); setRegSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: !isRegistering ? "700" : "500",
                  color: !isRegistering ? "#d97706" : "#6b7280",
                  background: !isRegistering ? "#fef3c7" : "transparent",
                  border: !isRegistering ? "1.5px solid #fcd34d" : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                🔍 Existing Farmer Lookup
              </button>

              <button
                type="button"
                onClick={() => { setIsRegistering(true); setLookupError(""); setRegSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "14px",
                  fontWeight: isRegistering ? "700" : "500",
                  color: isRegistering ? "#d97706" : "#6b7280",
                  background: isRegistering ? "#fef3c7" : "transparent",
                  border: isRegistering ? "1.5px solid #fcd34d" : "1px solid #e5e7eb",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                ➕ Create & Register New Farmer ID
              </button>
            </div>

            {lookupError && <div className="error-banner">{lookupError}</div>}
            {regSuccess && (
              <div style={{ background: "#e7f6ec", color: "#1f7a3f", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontWeight: "600" }}>
                {regSuccess}
              </div>
            )}

            {!isRegistering ? (
              <>
                <div className="op-card-header">
                  <span className="op-card-icon">🔍</span>
                  <div>
                    <h2>Find Farmer Profile</h2>
                    <p>Enter the Farmer ID or registered phone number to locate the farmer's profile.</p>
                  </div>
                </div>

                <form onSubmit={handleLookup}>
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <label htmlFor="farmerQuery">Farmer ID / Phone Number</label>
                    <div className="op-search-row">
                      <input
                        id="farmerQuery"
                        type="text"
                        placeholder="e.g. FARM-1001 or 9876543210"
                        value={farmerQuery}
                        onChange={e => setFarmerQuery(e.target.value)}
                        disabled={lookupLoading}
                        autoFocus
                      />
                      <button type="submit" className="op-search-btn" disabled={lookupLoading}>
                        {lookupLoading ? "Searching..." : "🔍 Search"}
                      </button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="op-card-header">
                  <span className="op-card-icon">🪪</span>
                  <div>
                    <h2>Register New Farmer Profile</h2>
                    <p>Create a new Farmer ID for walk-in non-smartphone farmers.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateFarmer}>
                  <div className="op-form-grid" style={{ marginTop: "10px" }}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Gurpreet Singh"
                        value={newFarmer.name}
                        onChange={e => setNewFarmer({ ...newFarmer, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="text"
                        placeholder="e.g. 9876543210"
                        value={newFarmer.phone}
                        onChange={e => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Village *</label>
                      <input
                        type="text"
                        placeholder="e.g. Samrala"
                        value={newFarmer.village}
                        onChange={e => setNewFarmer({ ...newFarmer, village: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>District *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ludhiana"
                        value={newFarmer.district}
                        onChange={e => setNewFarmer({ ...newFarmer, district: e.target.value })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="confirm-booking"
                    style={{ background: "#d97706", marginTop: "16px" }}
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? "Creating Profile..." : "✨ Generate Farmer ID & Continue to Booking →"}
                  </button>
                </form>
              </>
            )}

            <div className="op-help-panel" style={{ marginTop: "20px" }}>
              <span>💡</span>
              <div>
                <strong>Operator Desk Guidance</strong>
                <p>Verify Government ID (Aadhaar / Pattadar Passbook) when registering new farmers at the procurement centre desk.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Booking Form */}
        {step === "booking" && farmerProfile && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Farmer profile card */}
            <div className="op-farmer-card">
              <div className="op-farmer-avatar">👤</div>
              <div className="op-farmer-info">
                <h3>{farmerProfile.name}</h3>
                <div className="op-farmer-meta">
                  <span>🪪 {farmerProfile.farmer_id}</span>
                  <span>📞 {farmerProfile.phone}</span>
                  <span>📍 {farmerProfile.village}, {farmerProfile.district}</span>
                </div>
              </div>
              <button className="op-change-btn" onClick={resetAll}>✕ Change</button>
            </div>

            {/* Booking form */}
            <div className="op-card">
              <div className="op-card-header">
                <span className="op-card-icon">📅</span>
                <div>
                  <h2>Book Procurement Slot</h2>
                  <p>Booking on behalf of <strong>{farmerProfile.name}</strong> ({farmerProfile.farmer_id})</p>
                </div>
              </div>

              {formError && <div className="error-banner">{formError}</div>}

              <form onSubmit={handleBook} style={{ marginTop: "10px" }}>
                <div className="op-form-grid">

                  <div className="form-group">
                    <label>Crop</label>
                    <select name="cropId" value={form.cropId} onChange={handleChange}>
                      {cropsList.map(c => <option key={c.id} value={c.id}>🌾 {c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Procurement Centre</label>
                    <select name="centreId" value={form.centreId} onChange={handleChange}>
                      {centresList.map(c => <option key={c.id} value={c.id}>📍 {c.name} ({c.district})</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="form-group">
                    <label>Available Time Slot</label>
                    <select name="slotId" value={form.slotId} onChange={handleChange}>
                      {slotsList.length === 0
                        ? <option value="">No slots available for this date</option>
                        : slotsList.map(s => (
                          <option key={s.id} value={s.id}>
                            🕒 {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)} (Capacity: {s.available_capacity ?? s.capacity} left)
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Expected Quantity (Quintals)</label>
                    <input
                      type="number"
                      name="quantity"
                      min="1"
                      placeholder="e.g. 25"
                      value={form.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Operator Note <span style={{ color: "#6b7280", fontWeight: 400 }}>(Optional)</span></label>
                    <input
                      type="text"
                      name="operatorNote"
                      placeholder="e.g. Farmer verified with Aadhaar card"
                      value={form.operatorNote}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <button type="submit" className="confirm-booking" disabled={bookingLoading}>
                  {bookingLoading ? "Confirming Booking..." : "✅ Confirm Slot Booking →"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmation */}
        {step === "confirmed" && (
          <div className="op-card op-confirmation">
            <div className="op-confirm-icon">✓</div>
            <h2>Booking Confirmed!</h2>
            <p className="op-confirm-sub">
              Slot booked successfully on behalf of <strong>{farmerProfile?.name}</strong>
            </p>

            <div className="op-token-display">
              <span className="op-token-label">TOKEN NUMBER</span>
              <div className="op-token-number">{confirmedToken}</div>
              <span className="op-token-status">✅ Active</span>
            </div>

            <div className="op-confirm-details">
              <div><span>Farmer ID</span><strong>{farmerProfile?.farmer_id}</strong></div>
              <div><span>Farmer</span><strong>{farmerProfile?.name}</strong></div>
              <div><span>Crop</span><strong>{selectedCrop?.name || "—"}</strong></div>
              <div><span>Centre</span><strong>{selectedCentre?.name?.split(" - ")[0] || "—"}</strong></div>
              <div><span>Date</span><strong>{form.date}</strong></div>
              <div>
                <span>Time Slot</span>
                <strong>{selectedSlot ? `${selectedSlot.start_time?.slice(0, 5)} – ${selectedSlot.end_time?.slice(0, 5)}` : "—"}</strong>
              </div>
              <div><span>Quantity</span><strong>{form.quantity} Quintals</strong></div>
              {form.operatorNote && <div style={{ gridColumn: "1/-1" }}><span>Operator Note</span><strong>{form.operatorNote}</strong></div>}
            </div>

            <div className="op-confirm-actions">
              <button className="op-print-btn" onClick={() => window.print()}>🖨️ Print Token Slip</button>
              <button className="confirm-booking" onClick={resetAll}>+ Book for Another Farmer</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default OperatorBooking;
