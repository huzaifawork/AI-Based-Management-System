import React, { useState, useEffect } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminManageTables.css";

const AdminAddTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tableName: "",
    tableType: "",
    capacity: "",
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
    
    if (!formData.tableName || !formData.tableType || !formData.capacity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const submitData = new FormData();
    submitData.append("tableName", formData.tableName);
    submitData.append("tableType", formData.tableType);
    submitData.append("capacity", formData.capacity);
    submitData.append("status", formData.status);
    submitData.append("description", formData.description);
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting table data:", {
        tableName: formData.tableName,
        tableType: formData.tableType,
        capacity: formData.capacity,
        status: formData.status,
        description: formData.description,
        hasImage: !!formData.image
      });

      const response = await axios.post(
        "http://localhost:8080/api/tables",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
      toast.success("Table added successfully!");
      setFormData({
        tableName: "",
        tableType: "",
        capacity: "",
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
      console.error("Error adding table:", error);
      console.error("Error response:", error.response?.data);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Failed to add table";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-manage-tables p-4">
      <h2 className="page-title mb-4">Add New Table</h2>

      <Card className="cosmic-card">
        <Card.Header className="cosmic-card-header">
          <h5 className="mb-0">Table Details</h5>
        </Card.Header>
        <Card.Body className="cosmic-card-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Table Name</Form.Label>
              <Form.Control
                type="text"
                name="tableName"
                value={formData.tableName}
                onChange={handleInputChange}
                placeholder="Enter table name (e.g., Family Table)"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Table Type</Form.Label>
              <Form.Select
                name="tableType"
                value={formData.tableType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select table type</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="private">Private</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity (Number of Guests)</Form.Label>
              <Form.Control
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                placeholder="Enter maximum number of guests"
                min="1"
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
                <option value="Booked">Booked</option>
                <option value="Reserved">Reserved</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter table description (optional)"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Table Image</Form.Label>
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
                  Adding Table...
                </>
              ) : (
                "Add Table"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAddTable; 