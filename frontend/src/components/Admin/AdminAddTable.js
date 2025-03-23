import React, { useState } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminManageTables.css";

const AdminAddTable = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    tableName: "",
    tableType: "",
    capacity: "",
    status: "Available",
  });

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("tableName", formData.tableName);
    data.append("tableType", formData.tableType);
    data.append("capacity", formData.capacity);
    data.append("status", formData.status);
    if (image) {
      data.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8080/api/tables/add", data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      
      toast.success("Table added successfully!");
      setFormData({
        tableName: "",
        tableType: "",
        capacity: "",
        status: "Available",
      });
      setImage(null);
      
      // Reset file input
      const fileInput = document.getElementById("table-image");
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("Error adding table:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to add table");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-manage-tables p-4">
      <h2 className="page-title mb-4">Add New Table</h2>

      <Card className="cosmic-card">
        <Card.Body className="cosmic-card-body">
          <Form onSubmit={handleAddTable} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Table Name</Form.Label>
              <Form.Control
                type="text"
                className="cosmic-input"
                value={formData.tableName}
                onChange={(e) =>
                  setFormData({ ...formData, tableName: e.target.value })
                }
                placeholder="Enter table name (e.g., Family Table)"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Table Type</Form.Label>
              <Form.Select
                className="cosmic-input"
                value={formData.tableType}
                onChange={(e) =>
                  setFormData({ ...formData, tableType: e.target.value })
                }
                required
              >
                <option value="">Choose...</option>
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="private">Private</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity (Number of Guests)</Form.Label>
              <Form.Control
                type="number"
                className="cosmic-input"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="Enter maximum number of guests"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                className="cosmic-input"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
                <option value="Reserved">Reserved</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Upload Table Image</Form.Label>
              <Form.Control
                type="file"
                className="cosmic-input"
                id="table-image"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button
                type="submit"
                className="cosmic-btn-add"
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
                    Adding Table...
                  </>
                ) : (
                  "Add Table"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAddTable; 