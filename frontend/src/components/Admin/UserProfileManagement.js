import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiEdit2, FiTrash2, FiSearch, FiFilter, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { toast } from "react-toastify";
import "./UserProfileTable.css";

const UserProfileManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to access this page");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return;
      }
      const response = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Your session has expired. Please log in again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else if (error.response.status === 403) {
          toast.error("You don't have permission to access this page.");
        } else {
          toast.error(error.response.data.message || "Failed to fetch users");
          if (error.response.data.details) {
            toast.info(error.response.data.details);
          }
        }
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Error: " + error.message);
      }
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setEditMode(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/admin/users/${editUser._id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || "User updated successfully");
      fetchUsers();
      setEditMode(false);
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update user");
        if (error.response.data.details) {
          toast.info(error.response.data.details);
        }
      } else {
        toast.error("Error updating user. Please try again.");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(response.data.message || "User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        if (error.response) {
          toast.error(error.response.data.message || "Failed to delete user");
          if (error.response.data.details) {
            toast.info(error.response.data.details);
          }
        } else {
          toast.error("Error deleting user. Please try again.");
        }
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8080/api/admin/users/${userId}/toggle-status`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || `User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error("Error toggling user status:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update user status");
        if (error.response.data.details) {
          toast.info(error.response.data.details);
        }
      } else {
        toast.error("Error updating user status. Please try again.");
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">User Management</h2>
        <div className="admin-actions">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-box">
            <FiFilter className="filter-icon" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      <div className="users-grid">
        {filteredUsers.map((user) => (
          <div key={user._id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                <FiUser className="avatar-icon" />
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <FiMail className="detail-icon" />
                <span>{user.email}</span>
              </div>
              <div className="detail-item">
                <FiLock className="detail-icon" />
                <span>••••••••</span>
              </div>
            </div>

            <div className="user-actions">
              <button
                className="edit-button"
                onClick={() => handleEditUser(user)}
              >
                <FiEdit2 className="me-2" /> Edit
              </button>
              <button
                className="toggle-button"
                onClick={() => handleToggleStatus(user._id, user.isActive)}
              >
                {user.isActive ? (
                  <FiToggleLeft className="me-2" /> 
                ) : (
                  <FiToggleRight className="me-2" />
                )}
                {user.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteUser(user._id)}
              >
                <FiTrash2 className="me-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editMode && editUser && (
        <div className="edit-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <button className="close-button" onClick={() => setEditMode(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                  className="form-input"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editUser.isActive ? "active" : "inactive"}
                  onChange={(e) => setEditUser({ ...editUser, isActive: e.target.value === "active" })}
                  className="form-input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button className="save-button" onClick={handleUpdateUser}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileManagement;
