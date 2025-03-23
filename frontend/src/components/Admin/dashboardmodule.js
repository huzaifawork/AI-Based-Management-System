import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { FaBed, FaUtensils, FaComments, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboardmodule = () => {
  const [rooms, setRooms] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [revenues, setRevenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all rooms
        const roomsRes = await axios.get("/api/rooms");
        setRooms(roomsRes.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }

      try {
        // Fetch all orders
        const ordersRes = await axios.get("/api/orders");
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }

      try {
        // Fetch all feedbacks
        const feedbackRes = await axios.get("/api/feedbacks");
        setFeedbacks(feedbackRes.data);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }

      try {
        // Fetch all revenue records
        const revenueRes = await axios.get("/api/revenue");
        setRevenues(revenueRes.data);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      }
    };

    fetchData();
  }, []);

  // Process Data
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((room) => room.status === "occupied").length;
  const availableRooms = totalRooms - occupiedRooms;

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
  const pendingOrders = totalOrders - deliveredOrders;

  const positiveFeedbacks = feedbacks.filter((fb) => fb.rating >= 4).length;
  const neutralFeedbacks = feedbacks.filter((fb) => fb.rating === 3).length;
  const negativeFeedbacks = feedbacks.filter((fb) => fb.rating < 3).length;

  const lastMonthRevenue = revenues.length > 0 ? revenues[revenues.length - 1].amount : 0;

  // Chart Data
  const lineChartData = {
    labels: revenues.map((entry) => entry.month),
    datasets: [
      {
        label: "Revenue",
        data: revenues.map((entry) => entry.amount),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: ["Rooms Occupied", "Orders Processed", "Customer Feedback"],
    datasets: [
      {
        label: "Activity Summary",
        data: [occupiedRooms, totalOrders, feedbacks.length],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Customer Feedback",
        data: [positiveFeedbacks, neutralFeedbacks, negativeFeedbacks],
        backgroundColor: ["#4caf50", "#ffeb3b", "#f44336"],
      },
    ],
  };

  return (
    <div className="container mt-3">
      {/* Metrics Overview */}
      <div className="row mb-4 text-center">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <FaBed size={28} className="text-primary mb-2" />
              <h6>Total Rooms</h6>
              <p className="h5 text-primary">{totalRooms}</p>
              <small>Occupied: {occupiedRooms} | Available: {availableRooms}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <FaUtensils size={28} className="text-success mb-2" />
              <h6>Orders</h6>
              <p className="h5 text-success">{totalOrders}</p>
              <small>Delivered: {deliveredOrders} | Pending: {pendingOrders}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <FaComments size={28} className="text-warning mb-2" />
              <h6>Customer Feedback</h6>
              <p className="h5 text-warning">{feedbacks.length}</p>
              <small>Positive: {positiveFeedbacks}</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <FaDollarSign size={28} className="text-danger mb-2" />
              <h6>Monthly Revenue</h6>
              <p className="h5 text-danger">${lastMonthRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Monthly Revenue Trends</h6>
              <Line data={lineChartData} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Activity Summary</h6>
              <Bar data={barChartData} />
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Sentiment */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Feedback Sentiment Analysis</h6>
              <Pie data={pieChartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboardmodule;
