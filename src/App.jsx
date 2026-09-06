import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import MyBooking from "./pages/MyBooking";
import Queue from "./pages/Queue";
import Prices from "./pages/Prices";
import Procurement from "./pages/Procurement";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/booking" element={<Booking />} />
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/prices" element={<Prices />} />
        <Route
  path="/procurement"
  element={<Procurement />}
/>


        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;