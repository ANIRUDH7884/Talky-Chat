import { useState, useEffect, useRef } from "react";
import {
  FiEdit,
  FiSave,
  FiX,
  FiCamera,
  FiCheck,
  FiUser,
  FiAward,
  FiClock,
} from "react-icons/fi";
import apiClient from "../../Config/ApiClient/ApiClient";
import "./Profile.scss";

const authURL = import.meta.env.VITE_API_AUTH_URL;

const Profile = ({ user, onClose, setUserData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    status: "online",
    profilePic: null,
    previewImage: null,
  });
  const [createdAt, setCreatedAt] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // ✅ Fetch profile details on mount
  const fetchUser = async () => {
    try {
      const res = await apiClient.get(`${authURL}Get-Profile`);
      const { username, status, profilePic, createdAt } = res.data.user;
      setFormData({
        username: username || "",
        status: status || "online",
        profilePic: profilePic || null,
        previewImage: null,
      });
      setCreatedAt(createdAt || null);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePic: file,
        previewImage: URL.createObjectURL(file),
      });
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username && !formData.status && !formData.profilePic) {
      alert("Please provide at least one field to update");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      if (formData.username) data.append("username", formData.username);
      if (formData.status) data.append("status", formData.status);
      if (formData.profilePic) data.append("profilePic", formData.profilePic);

      const res = await apiClient.put(`${authURL}Profile`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { username, status, profilePic, createdAt } = res.data.user;

      // ✅ Update internal state
      setFormData({
        username,
        status,
        profilePic,
        previewImage: null,
      });
      setCreatedAt(createdAt);

      // ✅ Immediately update navbar state
      setUserData({ username, status, profilePic });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
      }, 1500);
    } catch (err) {
      console.error("Profile update failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const statusOptions = [
    { value: "online", label: "Online" },
    { value: "away", label: "Away" },
    { value: "busy", label: "Busy" },
    { value: "offline", label: "Offline" },
  ];

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>

        <div className="modal-content">
          <div className="profile-header">
            <h2>{isEditing ? "Edit Profile" : "My Profile"}</h2>
            {!isEditing && !saveSuccess && (
              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
                aria-label="Edit profile"
              >
                <FiEdit size={18} /> Edit
              </button>
            )}
          </div>

          <div className="avatar-section">
            <div className="avatar-container">
              <img
                src={
                  formData.previewImage ||
                  formData.profilePic ||
                  "/default-avatar.png"
                }
                alt="Profile"
                className="profile-avatar"
              />
              {isEditing && (
                <div className="avatar-upload-container">
                  <button
                    type="button"
                    className="avatar-upload-btn"
                    onClick={triggerFileInput}
                  >
                    <FiCamera size={18} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </div>
              )}
              {!isEditing && (
                <div className={`status-indicator ${formData.status}`} />
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FiUser /> Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={20}
                />
              ) : (
                <div className="display-value">{formData.username}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <FiAward /> Status
              </label>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="status-select"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="display-value">
                  {
                    statusOptions.find((opt) => opt.value === formData.status)
                      ?.label
                  }
                </div>
              )}
            </div>

            {!isEditing && (
              <div className="form-group">
                <label>
                  <FiClock /> Member Since
                </label>
                <div className="display-value">
                  {createdAt ? formatDate(createdAt) : "N/A"}
                </div>
              </div>
            )}

            {isEditing && (
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setIsEditing(false);
                    fetchUser(); // reset to original
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`save-btn ${saveSuccess ? "success" : ""}`}
                  disabled={isSubmitting}
                >
                  {saveSuccess ? (
                    <>
                      <FiCheck /> Saved!
                    </>
                  ) : (
                    <>
                      <FiSave /> {isSubmitting ? "Saving..." : "Save Changes"}
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
