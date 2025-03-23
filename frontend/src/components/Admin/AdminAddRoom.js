import React, { useState, useEffect } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminManageRooms.css";

const AdminAddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
    status: "Available",
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
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      const response = await axios.post(
        "http://localhost:8080/api/rooms",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Room added successfully!");
      setFormData({
        roomNumber: "",
        roomType: "",
        price: "",
        status: "Available",
        description: "",
        image: null,
      });
      
      // Reset the file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Error adding room:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-manage-rooms p-4">
      <h2 className="page-title mb-4">Add New Room</h2>

      <Card className="cosmic-card">
        <Card.Header className="cosmic-card-header">
          <h5 className="mb-0">Room Details</h5>
        </Card.Header>
        <Card.Body className="cosmic-card-body">
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
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
              </Form.Text>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="mt-3"
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
                  Adding Room...
                </>
              ) : (
                "Add Room"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAddRoom;
