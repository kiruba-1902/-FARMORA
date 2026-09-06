# 🚜 FARMORA

### Smart Farmer Procurement & Queue Management Platform

**Smart India Hackathon 2026 — Software Solution**

**Problem Statement:** SIH26032  
**Theme:** Agriculture, FoodTech & Rural Development

---

## 📌 Problem Statement

Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.

FARMORA is designed to improve the farmer procurement experience by providing a digital platform for slot booking, token generation, live queue tracking, procurement status updates, crop price information, and payment tracking.

---

## 💡 Proposed Solution

FARMORA connects farmers, procurement-centre operators, and officers through a unified digital workflow.

The platform allows farmers to:

- Register and access the system using a Farmer ID
- View current crop procurement prices
- Compare price changes and historical price trends
- Select a procurement centre
- Book a suitable procurement slot
- Receive a digital token and QR code
- Track their live queue position
- View estimated waiting time
- Track procurement progress
- View payment status

For farmers without smartphones or reliable digital access, operators can provide **assisted booking** using the farmer's registered Farmer ID and issue a printed token.

---

## ✨ Key Features

### 👨‍🌾 Farmer Module

- Farmer ID based login
- Farmer profile
- Current crop procurement price
- Price increase/decrease indicators
- Historical price visualization
- Price trend insights
- Procurement centre selection
- Smart slot booking
- Digital procurement token
- QR code for booking verification
- Slot and booking details
- Live queue position
- Estimated waiting time
- Procurement status tracking
- Payment status tracking
- Notifications and reminders

### 🎟️ Smart Slot & Token Management

- Centre-wise slot availability
- Date and time slot selection
- Crop and quantity selection
- Slot capacity management
- Digital token generation
- QR-based token verification
- Printed token support through assisted booking

### 🕐 Live Queue Management

Farmers can monitor:

- Current token being served
- Their token number
- Number of farmers ahead
- Estimated waiting time
- Queue progress

This helps reduce unnecessary waiting and crowding at procurement centres.

### 💰 Crop Price Information

The platform provides:

- Current procurement price
- Price change
- Percentage change
- Historical price data
- Price trend visualization
- Price alerts

### 🤖 AI / ML Insights

FARMORA can use historical data to provide:

- Crop price trend predictions
- Crowd/queue predictions
- Procurement-centre demand insights

AI/ML outputs are intended to support planning and decision-making and can be enhanced as real procurement data becomes available.

### 🏢 Operator / Officer Module

Operators and officers can:

- Search farmers using Farmer ID
- Perform assisted slot booking
- Generate printed tokens
- Monitor bookings
- Monitor queue progress
- Update procurement stages
- Track completed procurement
- Monitor payment status
- View centre-level operational information

---

## 🔄 System Workflow

### Digital Farmer Journey

```text
Farmer
   ↓
Farmer ID Login
   ↓
View Today's Crop Price
   ↓
Select Procurement Centre
   ↓
Smart Slot Booking
   ↓
Digital Token + QR Code
   ↓
Slot Reminder
   ↓
Arrive at Procurement Centre
   ↓
Live Queue
   ↓
Verification
   ↓
Quality Check
   ↓
Weighing
   ↓
Procurement
   ↓
Payment
   ↓
Final Status
```

### Assisted Booking Journey

```text
Farmer
   ↓
Operator
   ↓
Farmer ID Search
   ↓
Assisted Slot Booking
   ↓
Printed Token
   ↓
Live Queue
   ↓
Procurement
   ↓
Payment
```

---

## 🏗️ Technical Architecture

```text
                    FARMORA PLATFORM
                           │
          ┌────────────────┴────────────────┐
          │                                 │
   Farmer Interface                  Operator / Officer
          │                                 │
          └────────────────┬────────────────┘
                           ↓
                    React Frontend
                           ↓
                     REST APIs
                           ↓
                    FastAPI Backend
                           ↓
                    PostgreSQL DB
                           ↓
                  AI / ML Processing
                           ↓
             Insights & Notifications
```

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- HTML5
- CSS
- Tailwind CSS
- React Router
- Recharts
- QR Code generation

### Backend

- Python
- FastAPI
- REST APIs
- Node.js where required for supporting services

### Database

- PostgreSQL
- MySQL / SQLite for development where appropriate

### AI / Machine Learning

- Python
- Pandas
- Scikit-learn
- XGBoost
- Time-series analysis

### Authentication & Security

- Farmer ID based identification
- Role-based access control
- JWT-based authentication
- Data encryption
- Role separation for Farmer, Operator, Officer and Admin

### Deployment

- Docker
- Cloud deployment
- REST API integration
- SMS / Push notification services

---

## 📂 Project Structure

```text
farmora-frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── data/
│   │   └── mockData.js
│   │
│   ├── pages/
│   │   ├── Booking.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── MyBooking.jsx
│   │   ├── Prices.jsx
│   │   ├── Procurement.jsx
│   │   └── Queue.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

### Clone the repository

```bash
git clone https://github.com/kiruba-1902/FARMORA.git
```

### Navigate to the frontend

```bash
cd FARMORA/farmora-frontend
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The application will be available on the local development URL displayed by Vite, typically:

```text
http://localhost:5173/
```

---

## 🧪 Current Prototype

The current frontend prototype demonstrates the main farmer journey using sample/mock data.

### Example Demo Farmer

```text
Farmer: Ravi Kumar
Farmer ID: FARM001
Crop: Paddy
Quantity: 25 Quintals
```

### Example Procurement Information

```text
Current Paddy Price: ₹2,310 / Quintal
Queue Position: 7
Estimated Waiting Time: 35 minutes
Token: A-124
```

### Example Procurement Flow

```text
Booked
   ↓
Verification
   ↓
Quality Check
   ↓
Weighing
   ↓
Procurement
   ↓
Payment
```

The current prototype uses mock data for demonstration. Backend APIs, database integration, live queue data, and production AI models can be integrated progressively.

---

## 👥 Team Module Structure

The system can be developed as six coordinated modules:

### Member 1 — Farmer App / Frontend

- Farmer ID login
- Farmer dashboard
- Crop price dashboard
- Booking interface
- My Booking
- Digital token and QR
- Queue display
- Procurement status

### Member 2 — Backend & Authentication

- FastAPI backend
- REST APIs
- PostgreSQL database
- Authentication
- Role-based access control
- Farmer, booking, slot and procurement APIs

### Member 3 — Smart Slot Booking & Token

- Slot availability
- Smart slot allocation
- Booking management
- Digital token generation
- QR generation
- Booking reminders

### Member 4 — Live Queue & AI/ML

- Live queue management
- Queue position
- Estimated waiting time
- Crowd prediction
- Price trend prediction
- AI-based insights

### Member 5 — Procurement & Payment

- Verification
- Quality check
- Weighing
- Procurement completion
- Payment calculation
- Payment status

### Member 6 — Officer Dashboard & Assisted Booking

- Operator-assisted booking
- Farmer ID search
- Printed token generation
- Officer dashboard
- Queue monitoring
- Procurement monitoring
- Reports

---

## 📊 Database Design

The planned database can contain entities such as:

```text
Farmers
Crops
Prices
Centres
Slots
Bookings
Tokens
Procurement
Payments
Notifications
Users
```

Example relationship:

```text
Farmer
   │
   └── Booking
          │
          ├── Centre
          ├── Slot
          ├── Token
          └── Procurement
                   │
                   └── Payment
```

---

## 🌾 Expected Impact

FARMORA aims to improve procurement-centre operations and the farmer experience by:

- Reducing unnecessary waiting time
- Reducing crowding at procurement centres
- Providing procurement schedules in advance
- Improving transparency of queue status
- Providing current crop price information
- Providing procurement and payment status
- Supporting farmers without smartphones
- Reducing manual workload for centre staff
- Improving resource utilization
- Supporting data-driven procurement management
- Promoting digital inclusion in rural communities

---

## 🔮 Future Scope

Potential future enhancements include:

- Integration with government procurement systems
- Real-time procurement-centre data
- SMS and voice-call notifications
- Multilingual and regional-language support
- Voice-assisted farmer interaction
- Offline / low-connectivity support
- Advanced demand and crowd forecasting
- Real-time payment integration
- More detailed officer analytics
- Integration with additional agricultural market data sources

---

## 📚 References & Existing Ecosystem

FARMORA is intended to enhance and integrate with existing digital procurement and agricultural information workflows rather than replace established government systems.

Relevant systems and references considered during the solution design include:

- e-Samriddhi / e-Samyukti
- Kapas Kisan App
- e-NAM
- PM-AASHA
- Digital procurement-centre systems
- State-level procurement portals and applications

---

## ⚠️ Prototype Disclaimer

This project is an SIH 2026 prototype.

Demonstration data such as farmer details, prices, queue positions, tokens, procurement stages and payment information may be simulated for development and presentation purposes.

Production deployment would require appropriate government/system integration, verified procurement data, security controls, authentication, privacy safeguards and operational validation.

---

## 📄 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

## 🚜 FARMORA

**Making farmer procurement more transparent, predictable and accessible.**