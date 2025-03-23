import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Form, Button, Card, Image } from "react-bootstrap";
import { FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import "./AdminAddMenu.css";

const AdminAddMenu = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append("image", image);
      }

      const response = await axios.post("http://localhost:8080/api/menus", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Menu item added successfully");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        availability: true,
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Error adding menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-menu">
      <Card className="form-card">
        <Card.Header>
          <h2>Add New Menu Item</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="image-upload-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <div className="image-preview-wrapper">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Upload Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="upload-label">
                      Choose File
                    </label>
                  </div>
                )}
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="appetizers">Appetizers</option>
                <option value="main-course">Main Course</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                name="availability"
                label="Available"
                checked={formData.availability}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="button-group">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="submit-btn"
              >
                {loading ? "Adding..." : "Add Menu Item"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.location.href = "/admin/view-menus"}
                className="cancel-btn"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminAddMenu; 