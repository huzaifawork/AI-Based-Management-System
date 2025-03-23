import React, { useState, useEffect } from "react";
import { Card, Form, Button, Spinner, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminManageRooms.css";

const AdminUpdateRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
    status: "",
    description: "",
    image: null,
  });

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
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      price: room.price,
      status: room.status,
      description: room.description,
      image: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file");
        return;
      }
      if (file.size > 5000000) {
        toast.error("Image size should not exceed 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      toast.error("Please select a room to update");
      return;
    }

    if (!formData.roomNumber || !formData.roomType || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = new FormData();
    submitData.append("roomNumber", formData.roomNumber);
    submitData.append("roomType", formData.roomType);
    submitData.append("price", formData.price);
    submitData.append("status", formData.status);
    submitData.append("description", formData.description);
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/rooms/${selectedRoom._id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Room updated successfully!");
      fetchRooms();
      setSelectedRoom(null);
      setFormData({
        roomNumber: "",
        roomType: "",
        price: "",
        status: "",
        description: "",
        image: null,
      });
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error updating room:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-manage-rooms p-4">
      <h2 className="page-title mb-4">Update Room</h2>

      <div className="row">
        <div className="col-md-6 mb-4">
          <Card className="cosmic-card">
            <Card.Header className="cosmic-card-header">
              <h5 className="mb-0">Select Room to Update</h5>
            </Card.Header>
            <Card.Body className="cosmic-card-body">
              <Table striped bordered hover responsive className="cosmic-table">
                <thead>
                  <tr>
                    <th>Room Number</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center p-5">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </td>
                    </tr>
                  ) : rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr key={room._id} className={selectedRoom?._id === room._id ? "table-primary" : ""}>
                        <td>{room.roomNumber}</td>
                        <td>{room.roomType}</td>
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
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectRoom(room)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <div className="empty-state">
                          <div className="empty-state-text">No rooms found</div>
                          <div className="empty-state-subtext">
                            Add some rooms to update them
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

        <div className="col-md-6">
          <Card className="cosmic-card">
            <Card.Header className="cosmic-card-header">
              <h5 className="mb-0">Update Room Details</h5>
            </Card.Header>
            <Card.Body className="cosmic-card-body">
              {selectedRoom ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Room Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      placeholder="Enter room number"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Room Type</Form.Label>
                    <Form.Select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select room type</option>
                      <option value="Single">Single Room</option>
                      <option value="Double">Double Room</option>
                      <option value="Suite">Suite</option>
                      <option value="Deluxe">Deluxe Room</option>
                      <option value="Family">Family Room</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price per Night ($)</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price per night"
                      min="0"
                      step="0.01"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Maintenance">Under Maintenance</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter room description"
                      rows={3}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Room Image</Form.Label>
                    {selectedRoom.image && (
                      <div className="mb-2">
                        <img
                          src={getImageUrl(selectedRoom.image)}
                          alt={selectedRoom.roomNumber}
                          className="cosmic-room-image"
                          onError={(e) => {
                            console.error("Error loading image:", selectedRoom.image);
                            e.target.src = "/images/placeholder-room.jpg";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted">
                      Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
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
                          Updating Room...
                        </>
                      ) : (
                        "Update Room"
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedRoom(null);
                        setFormData({
                          roomNumber: "",
                          roomType: "",
                          price: "",
                          status: "",
                          description: "",
                          image: null,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="text-center p-4">
                  <p className="mb-0">Select a room from the list to update its details</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateRoom;
