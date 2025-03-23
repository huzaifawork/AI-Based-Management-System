import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiEdit2, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
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
      const response = await axios.get("http://localhost:8080/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch users");
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
      await axios.put(
        `http://localhost:8080/api/admin/users/${editUser._id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setEditMode(false);
      setEditUser(null);
    } catch (error) {
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (error) {
        setError("Failed to delete user");
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

      {error && <div className="error-message">{error}</div>}

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
                className="delete-button"
                onClick={() => handleDeleteUser(user._id)}
              >
                <FiTrash2 className="me-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editMode && (
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
