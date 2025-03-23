import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, Badge, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import "./AdminViewMenus.css";

const AdminViewMenus = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory]);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const url = selectedCategory === "all"
        ? "http://localhost:8080/api/menus"
        : `http://localhost:8080/api/menus/category/${selectedCategory}`;
      
      const response = await axios.get(url);
      setMenuItems(response.data);
    } catch (error) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/menus/${id}`);
      setMenuItems(menuItems.filter(item => item._id !== id));
      toast.success("Menu item deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting menu item");
    }
  };

  const handleAvailabilityToggle = async (id, currentStatus) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/menus/${id}/toggle-availability`);
      setMenuItems(menuItems.map(item => item._id === id ? response.data : item));
      toast.success("Availability updated successfully");
    } catch (error) {
      toast.error("Error updating availability");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8080${imagePath}`;
  };

  return (
    <div className="admin-view-menus">
      <div className="header-section">
        <h2>Menu Items</h2>
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
          >
            <option value="all">All Categories</option>
            <option value="appetizers">Appetizers</option>
            <option value="main-course">Main Course</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <Card key={item._id} className="menu-card">
              <div className="image-container">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="menu-image"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300";
                  }}
                />
                <Badge 
                  bg={item.availability ? "success" : "danger"}
                  className="availability-badge"
                >
                  {item.availability ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <div className="price-tag">${parseFloat(item.price).toFixed(2)}</div>
                <div className="category-tag">{item.category}</div>
                <div className="action-buttons">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleAvailabilityToggle(item._id, item.availability)}
                  >
                    {item.availability ? <FaToggleOn /> : <FaToggleOff />}
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => window.location.href = `/admin/update-menu/${item._id}`}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setItemToDelete(item);
                      setShowDeleteModal(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {itemToDelete?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteItem(itemToDelete?._id)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminViewMenus; 