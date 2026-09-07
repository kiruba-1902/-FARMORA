export const farmer = {
  farmerId: "FARM001",
  name: "Ravi Kumar",
  phone: "9876543210",
  village: "Kovilpatti",
};

export const booking = {
  bookingId: "BK001",
  farmerId: "FARM001",
  centreId: "C001",
  centre: "Central Procurement Centre",
  date: "2026-09-10",
  time: "10:00 AM - 11:00 AM",
  crop: "Paddy",
  quantity: 25,
  token: "A-124",
  status: "Booked",
};

export const price = {
  crop: "Paddy",
  current: 2310,
  change: 30,
  percentage: 1.3,
};

export const crops = [
  {
    name: "Paddy",
    price: 2310,
    change: 30,
    percentage: 1.3,
  },
  {
    name: "Wheat",
    price: 2275,
    change: 15,
    percentage: 0.7,
  },
  {
    name: "Maize",
    price: 2180,
    change: -20,
    percentage: -0.9,
  },
];

export const priceHistory = [
  { day: "Mon", price: 2240 },
  { day: "Tue", price: 2260 },
  { day: "Wed", price: 2275 },
  { day: "Thu", price: 2290 },
  { day: "Fri", price: 2300 },
  { day: "Sat", price: 2310 },
  { day: "Today", price: 2310 },
];

export const queue = {
  currentToken: 117,
  farmerToken: 124,
  estimatedWait: 35,
};

export const procurement = {
  token: "TKN-1-001",
  bookingId: "BK-2026-0907-124",
  crop: "Wheat",
  quantity: 12,
  rate: 2275,
  totalAmount: 27300,
  centre: "Central Grain Mandi - Ludhiana",
  status: "Quality Check & Weighing",
  steps: [
    { id: 1, title: "Token Generated", time: "09:00 AM", status: "completed", details: "Token #A-124 issued successfully" },
    { id: 2, title: "Identity Verification", time: "09:30 AM", status: "completed", details: "Aadhaar & Land records verified at Gate #2" },
    { id: 3, title: "Quality Verification", time: "10:15 AM", status: "completed", details: "Grade A Grain approved (Moisture: 12%)" },
    { id: 4, title: "Weighing & Drop-off", time: "10:45 AM", status: "in_progress", details: "Net weight calculation at Weighbridge #1" },
    { id: 5, title: "DBT Payment Processing", time: "Pending", status: "pending", details: "Direct Benefit Transfer to Bank account ending in ****4821" },
  ],
};

export const payment = {
  paymentId: "PAY-2026-8891",
  farmerId: "FARM-1001",
  farmerName: "Ravi Kumar",
  bankAccount: "State Bank of India (****4821)",
  ifsc: "SBIN0001234",
  amount: 27300,
  mspRate: 2275,
  quantityQtl: 12,
  paymentStatus: "PROCESSING", // "PROCESSING" | "RELEASED" | "FAILED"
  transactionRef: "DBT-TXN-994810294",
  initiatedDate: "2026-09-07",
  estimatedPayoutDate: "2026-09-08 (Within 24 Hours)",
};