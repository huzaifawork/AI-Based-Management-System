import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, Badge, Button, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaImage } from "react-icons/fa";
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
    if (!imagePath) {
      console.log('No image path provided');
      return null;
    }
    
    try {
      // If it's already a full URL
      if (imagePath.startsWith('http')) {
        console.log('Using full URL:', imagePath);
        return imagePath;
      }
      
      // Remove any leading slashes
      const cleanPath = imagePath.replace(/^\/+/, '');
      console.log('Cleaned path:', cleanPath);
      
      // If the path includes 'uploads', make sure it's properly formatted
      if (cleanPath.includes('uploads')) {
        const url = `http://localhost:8080/${cleanPath}`;
        console.log('Generated URL with uploads:', url);
        return url;
      }
      
      // For all other cases, assume it's a relative path in the uploads directory
      const url = `http://localhost:8080/uploads/${cleanPath}`;
      console.log('Generated URL:', url);
      return url;
    } catch (error) {
      console.error('Error formatting image URL:', error);
      return null;
    }
  };

  // Add this function to handle image loading errors
  const handleImageError = (e, item) => {
    console.error('Image failed to load:', {
      itemId: item._id,
      itemName: item.name,
      imagePath: item.image,
      error: e
    });
    e.target.src = "https://via.placeholder.com/300";
    e.target.onerror = null;
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
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="menu-image"
                    onError={(e) => handleImageError(e, item)}
                  />
                ) : (
                  <div className="no-image">
                    <FaImage size={40} />
                    <span>No Image</span>
                  </div>
                )}
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
                    title={item.availability ? "Set Unavailable" : "Set Available"}
                  >
                    {item.availability ? <FaToggleOn /> : <FaToggleOff />}
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => window.location.href = `/admin/update-menu/${item._id}`}
                    title="Edit Item"
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
                    title="Delete Item"
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