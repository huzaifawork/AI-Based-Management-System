import React, { useState, useEffect } from "react";
import { Card, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminManageRooms.css";

const AdminViewRooms = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "admin") {
      toast.error("Please login as admin to access this page");
      navigate("/login");
      return;
    }
    
    fetchRooms();
  }, [navigate]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/rooms");
      setRooms(response.data);
      toast.success("Rooms loaded successfully!");
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/placeholder-room.jpg';
    
    try {
      // If it's already a full URL
      if (imagePath.startsWith('http')) return imagePath;
      
      // Remove any leading slashes
      const cleanPath = imagePath.replace(/^\/+/, '');
      
      // If the path includes 'uploads', make sure it's properly formatted
      if (cleanPath.includes('uploads')) {
        return `http://localhost:8080/${cleanPath}`;
      }
      
      // For all other cases, assume it's a relative path in the uploads directory
      return `http://localhost:8080/uploads/${cleanPath}`;
    } catch (error) {
      console.error('Error formatting image URL:', error);
      return '/images/placeholder-room.jpg';
    }
  };

  return (
    <div className="admin-manage-rooms p-4">
      <h2 className="page-title mb-4">View Rooms</h2>

      <Card className="cosmic-card">
        <Card.Header className="cosmic-card-header">
          <h5 className="mb-0">All Rooms</h5>
        </Card.Header>
        <Card.Body className="cosmic-card-body">
          <Table striped bordered hover responsive className="cosmic-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Description</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-5">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </td>
                </tr>
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room._id}>
                    <td>{room.roomNumber}</td>
                    <td>{room.roomType}</td>
                    <td>${room.price}</td>
                    <td>
                      <span
                        className={`badge cosmic-badge ${
                          room.status === "Available" ? "available" : "unavailable"
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td>{room.description}</td>
                    <td>
                      {room.image && (
                        <img
                          src={getImageUrl(room.image)}
                          alt={room.roomNumber}
                          className="cosmic-room-image"
                          onError={(e) => {
                            console.error("Error loading image:", room.image);
                            e.target.src = "/images/placeholder-room.jpg";
                            e.target.onerror = null;
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="empty-state">
                      <div className="empty-state-text">No rooms found</div>
                      <div className="empty-state-subtext">
                        Add some rooms to see them listed here
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminViewRooms;
