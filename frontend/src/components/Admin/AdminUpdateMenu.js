import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminUpdateMenu.css";

const AdminUpdateMenu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories] = useState([
    "appetizers",
    "main-course",
    "desserts",
    "beverages",
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }
    fetchMenuItems();
  }, [navigate]);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/menus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error(error.response?.data?.message || "Error fetching menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      availability: item.availability,
    });
    setImagePreview(item.image ? `http://localhost:8080${item.image}` : null);
  };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      toast.error("Please select a menu item to update");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (image) {
        formDataToSend.append("image", image);
      }

      await axios.put(`http://localhost:8080/api/menus/${selectedItem._id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Menu item updated successfully");
      fetchMenuItems(); // Refresh the menu items list
      setSelectedItem(null);
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
      console.error("Error updating menu item:", error);
      toast.error(error.response?.data?.message || "Error updating menu item");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="update-menu-container">
      <div className="update-menu-header">
        <h2>Update Menu Item</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      <div className="update-menu-content">
        <div className="menu-items-list">
          <h3>Select Menu Item to Update</h3>
          <div className="menu-items-grid">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className={`menu-item-card ${selectedItem?._id === item._id ? "selected" : ""}`}
                onClick={() => handleItemSelect(item)}
              >
                <img
                  src={item.image ? `http://localhost:8080${item.image}` : "https://via.placeholder.com/150"}
                  alt={item.name}
                  className="menu-item-image"
                />
                <div className="menu-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="update-form-section">
            <div className="image-section">
              <div className="image-preview-container">
                {imagePreview ? (
                  <img src={imagePreview} alt="Menu item preview" className="preview-image" />
                ) : (
                  <div className="no-image">No image available</div>
                )}
              </div>
              <div className="image-upload">
                <label htmlFor="image" className="upload-label">
                  Change Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="update-menu-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-control"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group availability-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    name="availability"
                    checked={formData.availability}
                    onChange={handleInputChange}
                    className="toggle-input"
                  />
                  <span className="toggle-text">
                    {formData.availability ? "Available" : "Unavailable"}
                  </span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update Menu Item"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedItem(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      availability: true,
                    });
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUpdateMenu; 