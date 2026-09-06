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
  verification: "completed",
  quality: "completed",
  weighing: "current",
  procurement: "pending",
  payment: "pending",
};

export const payment = {
  quantity: 25,
  rate: 2310,
  total: 57750,
  status: "Pending",
};