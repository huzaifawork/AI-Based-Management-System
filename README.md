# Hotel Management System

A comprehensive hotel management system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- 🏨 Room Booking System
- 🍽️ Food Ordering System
- 📍 Real-time Delivery Tracking
- 🗓️ Table Reservations
- 👤 User Authentication (Local + Google OAuth)
- 💳 Payment Integration
- 📱 Responsive Design
- 🔄 Real-time Updates using Socket.io
- 🎨 Modern UI/UX

## Tech Stack

### Frontend

- React.js
- React Router DOM
- Bootstrap
- Socket.io Client
- Mapbox GL
- React Toastify
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication
- Google OAuth

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/hotel-management-system.git
cd hotel-management-system
```

2. Install dependencies for backend

```bash
cd backend
npm install
```

3. Install dependencies for frontend

```bash
cd ../frontend
npm install
```

4. Create a .env file in the backend directory with the following variables:

```env
PORT=8080
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. Start the backend server

```bash
cd backend
npm start
```

6. Start the frontend development server

```bash
cd frontend
npm start
```

The application should now be running on:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Features in Detail

### Room Booking

- View available rooms
- Book rooms with date selection
- View booking history
- Cancel bookings

### Food Ordering

- Browse menu items
- Add to cart
- Real-time order tracking
- Order history

### Table Reservations

- Reserve tables
- Select time slots
- Manage reservations

### Admin Dashboard

- Manage rooms
- Handle bookings
- Process orders
- Staff management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React.js Documentation
- Node.js Documentation
- MongoDB Documentation
- Socket.io Documentation
- Mapbox GL Documentation
