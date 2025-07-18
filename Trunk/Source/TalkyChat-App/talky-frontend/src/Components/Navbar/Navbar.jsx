import { useState, useEffect } from "react";
import {
  FiMoon,
  FiSun,
  FiChevronDown,
  FiUser,
  FiKey,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import Profile from "../../Components/Profile/Profile.jsx";
import ChangePassword from "../../Components/ChangePassword/ChangePassword.jsx";
import ConfirmationModal from "../ConfirmationBox/ConfirmationBox.jsx";
import "./Navbar.scss";
import apiClient from "../../Config/ApiClient/ApiClient";

const authURL = import.meta.env.VITE_API_AUTH_URL;

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState({
    username: "User",
    profilePic: null,
    status: "offline",
  });

  const fetchUserDetails = async () => {
    try {
      const res = await apiClient.get(`${authURL}Get-Profile`);
      const { username, profilePic, status } = res.data.user;
      setUserData({ username, profilePic, status });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      if (formData.status) formDataToSend.append("status", formData.status);
      if (formData.profilePic)
        formDataToSend.append("profilePic", formData.profilePic);

      await apiClient.put("/update-profile", formDataToSend);
      fetchUserDetails(); // Refresh user data
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      await apiClient.put(`${authURL}Change-password`, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw new Error(
        error?.response?.data?.message || "Failed to change password"
      );
    }
  };

  const performLogout = async () => {
    try {
      await apiClient.post(`${authURL}Logout`);
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchUserDetails();

    // Date logic remains the same
    const updateDate = () => {
      setCurrentDate(
        new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className="navbar">
        <div className="Logo" style={{ marginLeft: "2rem" }}>
          TalkyChat
        </div>
        <div className="navbar-date">{currentDate}</div>

        <div className="navbar-controls" style={{ marginRight: "35px" }}>
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <div
            className="user-profile"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar-circle">
              {userData.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt="avatar"
                  className="avatar-img"
                />
              ) : (
                userData.username?.charAt(0).toUpperCase()
              )}
            </div>
            <div className={`status-dot ${userData.status || "offline"}`} />
            <span>{userData.username}</span>
            <FiChevronDown
              size={16}
              className={`dropdown-arrow ${showDropdown ? "rotate" : ""}`}
            />

            {showDropdown && (
              <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                <a
                  onClick={() => {
                    setShowProfileModal(true);
                    setShowDropdown(false);
                  }}
                >
                  <FiUser size={16} className="dropdown-icon" />
                  <span>Profile</span>
                </a>
                <a href="/settings">
                  <FiSettings size={16} className="dropdown-icon" />
                  <span>Settings</span>
                </a>
                <a
                  onClick={() => {
                    setShowChangePasswordModal(true);
                    setShowDropdown(false);
                  }}
                >
                  <FiKey size={16} className="dropdown-icon" />
                  <span>Change Password</span>
                </a>

                <div className="dropdown-divider"></div>
                <a
                  className="logout"
                  onClick={() => {
                    setShowLogoutModal(true);
                    setShowDropdown(false);
                  }}
                >
                  <FiLogOut size={16} className="dropdown-icon" />
                  <span>Logout</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showProfileModal && (
        <Profile
          user={userData}
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveProfile}
          setUserData={setUserData}
        />
      )}

      {showChangePasswordModal && (
        <ChangePassword
          onClose={() => setShowChangePasswordModal(false)}
          onChangePassword={handleChangePassword}
        />
      )}

      {showLogoutModal && (
        <ConfirmationModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={performLogout}
          title="Logout Confirmation"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          type="danger"
        />
      )}
    </>
  );
};

export default Navbar;
