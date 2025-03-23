import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminDeleteMenu.css";

const AdminDeleteMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/menus", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenuItems(response.data);
    } catch (error) {
      toast.error("Failed to fetch menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/menus/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Menu item deleted successfully");
        fetchMenuItems();
      } catch (error) {
        toast.error("Failed to delete menu item");
      }
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="delete-menu-container">
      <div className="delete-menu-header">
        <h2>Delete Menu Items</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control category-select"
          >
            <option value="all">All Categories</option>
            <option value="appetizers">Appetizers</option>
            <option value="main-course">Main Course</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>
      </div>

      <div className="menu-items-grid">
        {filteredItems.map((item) => (
          <div key={item._id} className="menu-item-card">
            <div className="menu-item-image">
              <img
                src={item.image ? `http://localhost:8080${item.image}` : "https://via.placeholder.com/150"}
                alt={item.name}
              />
            </div>
            <div className="menu-item-content">
              <h3>{item.name}</h3>
              <p className="category">{item.category}</p>
              <p className="price">${item.price}</p>
              <div className="item-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="no-items-message">
          <p>No menu items found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDeleteMenu; 