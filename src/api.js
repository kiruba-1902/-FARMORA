/**
 * Farmora API Client
 * Connects the React Frontend to the FastAPI Backend (http://127.0.0.1:8000).
 * Includes automatic bearer token injection and resilient fallbacks to mockData.
 */

import {
  farmer as mockFarmer,
  crops as mockCrops,
  price as mockPrice,
  booking as mockBooking,
  queue as mockQueue,
  procurement as mockProcurement,
  payment as mockPayment,
} from "./data/mockData";

export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  "http://127.0.0.1:8000";

/**
 * Helper to make authenticated fetch requests with automatic JSON parsing
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (error) {
    console.warn(`[Farmora API] Call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

export const api = {
  /**
   * 1. Authentication
   */
  async login(usernameOrFarmerId, password = "password123") {
    try {
      const res = await request("/login", {
        method: "POST",
        body: JSON.stringify({
          username_or_farmer_id: usernameOrFarmerId.trim(),
          password: password.trim() || "password123",
        }),
      });

      if (res.success && res.data) {
        const { access_token, user } = res.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("farmerId", user.farmer_code || user.username);
        if (user.farmer_id) {
          localStorage.setItem("farmerDbId", user.farmer_id);
        }
        return res.data;
      }
      throw new Error(res.message || "Login failed");
    } catch (err) {
      // Fallback: If backend is not reachable, allow mock session for UI demo
      console.warn("Backend offline or login error, falling back to local session");
      localStorage.setItem("farmerId", usernameOrFarmerId || mockFarmer.farmerId);
      localStorage.setItem("user", JSON.stringify({
        username: usernameOrFarmerId,
        farmer_code: usernameOrFarmerId,
        role: "FARMER",
        farmer_name: mockFarmer.name,
      }));
      return {
        access_token: "mock-token",
        user: {
          username: usernameOrFarmerId,
          farmer_code: usernameOrFarmerId,
          farmer_name: mockFarmer.name,
          role: "FARMER",
        },
      };
    }
  },

  async operatorLogin(operatorId, password = "operator123") {
    try {
      const res = await request("/operator/login", {
        method: "POST",
        body: JSON.stringify({
          username: operatorId.trim(),
          password: password.trim(),
        }),
      });

      if (res.success && res.data) {
        const { access_token, user } = res.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        return res.data;
      }
      throw new Error(res.message || "Operator login failed");
    } catch (err) {
      console.warn("Backend offline, falling back to local operator session");
      const opUser = {
        username: operatorId || "OP-501",
        role: "OPERATOR",
        name: "Desk Operator",
      };
      localStorage.setItem("access_token", "mock-op-token");
      localStorage.setItem("user", JSON.stringify(opUser));
      return { access_token: "mock-op-token", user: opUser };
    }
  },

  async officerLogin(officerId, password = "officer123") {
    try {
      const res = await request("/officer/login", {
        method: "POST",
        body: JSON.stringify({
          username: officerId.trim(),
          password: password.trim(),
        }),
      });

      if (res.success && res.data) {
        const { access_token, user } = res.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        return res.data;
      }
      throw new Error(res.message || "Officer login failed");
    } catch (err) {
      console.warn("Backend offline, falling back to local officer session");
      const offUser = {
        username: officerId || "OFF-901",
        role: "OFFICER",
        name: "District Procurement Officer",
      };
      localStorage.setItem("access_token", "mock-off-token");
      localStorage.setItem("user", JSON.stringify(offUser));
      return { access_token: "mock-off-token", user: offUser };
    }
  },



  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("farmerId");
    localStorage.removeItem("farmerDbId");
  },

  getCurrentUser() {
    const raw = localStorage.getItem("user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * 2. Farmer Profile
   */
  async getFarmer(farmerId) {
    try {
      const id = farmerId || localStorage.getItem("farmerDbId") || localStorage.getItem("farmerId") || "1";
      const res = await request(`/farmer/${id}`);
      return res.data;
    } catch {
      return {
        ...mockFarmer,
        farmer_id: localStorage.getItem("farmerId") || mockFarmer.farmerId,
      };
    }
  },

  /**
   * 3. Crops & Prices
   */
  async getCrops() {
    try {
      const res = await request("/crops");
      return res.data;
    } catch {
      return mockCrops.map((c, i) => ({ id: i + 1, name: c.name, description: `${c.name} grain` }));
    }
  },

  async getPrices(cropId = null) {
    try {
      const query = cropId ? `?crop_id=${cropId}` : "";
      const res = await request(`/prices${query}`);
      return res.data;
    } catch {
      return [
        { crop_id: 1, price_per_kg: 23.10, crop: { name: "Paddy" } },
        { crop_id: 2, price_per_kg: 22.75, crop: { name: "Wheat" } },
        { crop_id: 3, price_per_kg: 66.20, crop: { name: "Cotton" } },
        { crop_id: 4, price_per_kg: 21.80, crop: { name: "Maize" } },
      ];
    }
  },

  /**
   * 4. Procurement Centres & Slots
   */
  async getCentres() {
    try {
      const res = await request("/centres");
      return res.data;
    } catch {
      return [
        { id: 1, name: "Central Grain Mandi - Ludhiana", district: "Ludhiana" },
        { id: 2, name: "District Agricultural Hub - Patiala", district: "Patiala" },
      ];
    }
  },

  async getSlots(centreId, dateStr) {
    try {
      let query = "?available_only=true";
      if (centreId) query += `&centre_id=${centreId}`;
      if (dateStr) query += `&date=${dateStr}`;
      const res = await request(`/slots${query}`);
      return res.data;
    } catch {
      return [
        { id: 1, start_time: "09:00:00", end_time: "12:00:00", available_capacity: 18, capacity: 20 },
        { id: 2, start_time: "12:30:00", end_time: "15:30:00", available_capacity: 15, capacity: 20 },
        { id: 3, start_time: "16:00:00", end_time: "19:00:00", available_capacity: 12, capacity: 15 },
      ];
    }
  },

  /**
   * 5. Slot Booking
   */
  async createBooking({ farmerId, cropId, centreId, slotId, quantity }) {
    try {
      const dbFarmerId = farmerId || Number(localStorage.getItem("farmerDbId")) || 1;
      const res = await request("/booking", {
        method: "POST",
        body: JSON.stringify({
          farmer_id: Number(dbFarmerId),
          crop_id: Number(cropId),
          centre_id: Number(centreId),
          slot_id: Number(slotId),
          quantity: Number(quantity),
        }),
      });

      if (res.data) {
        localStorage.setItem("farmoraBooking", JSON.stringify(res.data));
      }
      return res.data;
    } catch (err) {
      console.warn("Booking API failed, fallback to local storage:", err.message);
      // Fallback local booking with unique token generation
      const randomNum = Math.floor(100 + Math.random() * 900);
      const fallbackBooking = {
        id: Date.now(),
        booking_id: `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomNum}`,
        token: { token_number: `A-${randomNum}` },
        token_number: `A-${randomNum}`,
        status: "CONFIRMED",
        quantity: quantity > 100 ? (quantity / 100).toFixed(1) : quantity,
        crop: { name: "Paddy" },
        centre: { name: "Central Grain Mandi - Ludhiana" },
        slot: {
          slot_date: new Date().toISOString().slice(0, 10),
          start_time: "09:00:00",
          end_time: "12:00:00",
        },
      };
      localStorage.setItem("farmoraBooking", JSON.stringify(fallbackBooking));
      return fallbackBooking;
    }
  },

  async getActiveBooking() {
    try {
      const res = await request("/bookings");
      if (res.data && res.data.length > 0) {
        return res.data[0];
      }
    } catch {
      // Fallback to local storage or mock
    }

    const saved = localStorage.getItem("farmoraBooking");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return mockBooking;
  },

  /**
   * 6. Live Queue Telemetry
   */
  async getQueue(centreId = 1) {
    try {
      const res = await request(`/queue/${centreId}`);
      return res.data;
    } catch {
      return {
        queue_summary: {
          total_tokens_issued: 25,
          waiting_count: 7,
          currently_serving: `A-${mockQueue.currentToken}`,
        },
        your_tokens: [
          {
            token_number: `A-${mockQueue.farmerToken}`,
            queue_position: mockQueue.farmerToken - mockQueue.currentToken,
            estimated_wait_minutes: mockQueue.estimatedWait,
          },
        ],
      };
    }
  },

  /**
   * 7. Procurement & Payments
   */
  async getProcurement(id = null) {
    try {
      const target = id || "1";
      const res = await request(`/procurement/${target}`);
      return res.data;
    } catch {
      return mockProcurement;
    }
  },

  async getPayment(id = null) {
    try {
      const target = id || "1";
      const res = await request(`/payment/${target}`);
      return res.data;
    } catch {
      return mockPayment;
    }
  },

  /**
   * 8. Operator — Farmer Lookup (for non-smartphone farmer assistance)
   */
  async lookupFarmer(farmerId) {
    try {
      const res = await request(`/farmer/search?q=${encodeURIComponent(farmerId)}`);
      return res.data;
    } catch {
      // Mock fallback: simulate a found farmer
      if (farmerId && farmerId.trim()) {
        return {
          id: 1,
          farmer_id: farmerId.toUpperCase(),
          name: "Ravi Kumar",
          phone: "9876543210",
          village: "Kovilpatti",
          district: "Ludhiana",
          crops: ["Paddy", "Wheat"],
        };
      }
      return null;
    }
  },

  /**
   * 9. Operator — Book slot on behalf of a farmer
   */
  async operatorCreateBooking({ farmerId, cropId, centreId, slotId, quantity, operatorNote }) {
    try {
      const res = await request("/operator/booking", {
        method: "POST",
        body: JSON.stringify({
          farmer_id: Number(farmerId),
          crop_id: Number(cropId),
          centre_id: Number(centreId),
          slot_id: Number(slotId),
          quantity: Number(quantity),
          booked_by: "OPERATOR",
          operator_note: operatorNote || "",
        }),
      });
      return res.data;
    } catch {
      // Fallback to regular booking path
      return this.createBooking({ farmerId, cropId, centreId, slotId, quantity });
    }
  },

  /**
   * 10. Officer — Centre Analytics
   */
  async getCentreAnalytics(centreId = 1) {
    try {
      const res = await request(`/officer/analytics/${centreId}`);
      return res.data;
    } catch {
      // Rich mock analytics
      return {
        centre_name: "Central Grain Mandi - Ludhiana",
        today_date: new Date().toISOString().split("T")[0],
        summary: {
          total_tokens: 42,
          currently_serving: 18,
          waiting: 12,
          completed: 18,
          cancelled: 3,
          avg_service_time_min: 22,
        },
        slot_occupancy: [
          { slot: "09:00–12:00", capacity: 20, booked: 20, label: "Full" },
          { slot: "12:30–15:30", capacity: 20, booked: 15, label: "High" },
          { slot: "16:00–19:00", capacity: 15, booked: 7, label: "Available" },
        ],
        crowd_forecast: [
          { hour: "9am", expected: 18 },
          { hour: "10am", expected: 22 },
          { hour: "11am", expected: 20 },
          { hour: "12pm", expected: 14 },
          { hour: "1pm", expected: 10 },
          { hour: "2pm", expected: 16 },
          { hour: "3pm", expected: 19 },
          { hour: "4pm", expected: 12 },
          { hour: "5pm", expected: 8 },
        ],
        recent_bookings: [
          { token: "A-018", farmer: "Ravi Kumar", crop: "Paddy", qty: "25 Qtl", status: "SERVING" },
          { token: "A-019", farmer: "Suresh Patel", crop: "Wheat", qty: "18 Qtl", status: "WAITING" },
          { token: "A-020", farmer: "Mohan Singh", crop: "Maize", qty: "30 Qtl", status: "WAITING" },
          { token: "A-021", farmer: "Deepak Yadav", crop: "Paddy", qty: "22 Qtl", status: "WAITING" },
          { token: "A-017", farmer: "Anil Sharma", crop: "Cotton", qty: "10 Qtl", status: "COMPLETED" },
          { token: "A-016", farmer: "Ramesh Gupta", crop: "Paddy", qty: "28 Qtl", status: "COMPLETED" },
        ],
        alerts: [
          { type: "warning", message: "Morning slot (09:00–12:00) is at full capacity." },
          { type: "info", message: "Afternoon slot has 5 spots remaining. Consider redirecting farmers." },
        ],
      };
    }
  },

  /**
   * 11. Officer — Mark token as served / skip
   */
  async updateTokenStatus(tokenId, status) {
    try {
      const res = await request(`/officer/token/${tokenId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      return res.data;
    } catch {
      return { success: true, token: tokenId, status };
    }
  },
};
