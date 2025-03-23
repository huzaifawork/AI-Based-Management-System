import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminManageRooms.css";

const AdminDeleteRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

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
      const response = await axios.get("http://localhost:8080/api/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8080/api/rooms/${roomId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
        }
      );

      toast.success("Room deleted successfully!");
      // Update rooms list
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to delete room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-manage-rooms p-4">
      <h2 className="page-title mb-4">Delete Rooms</h2>

      <Card className="cosmic-card">
        <Card.Header className="cosmic-card-header">
          <h5 className="mb-0">Select Room to Delete</h5>
        </Card.Header>
        <Card.Body className="cosmic-card-body">
          <Table striped bordered hover responsive className="cosmic-table">
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Image</th>
                <th>Action</th>
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
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteRoom(room._id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Deleting...
                          </>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No rooms found.
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

export default AdminDeleteRoom; 