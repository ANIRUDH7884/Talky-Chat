import { useState, useEffect } from "react";
import { 
  FiMoon, 
  FiSun, 
  FiChevronDown,
  FiUser,
  FiKey,
  FiLogOut,
  FiSettings
} from "react-icons/fi";
import "./Navbar.scss";
import apiClient from "../../Config/ApiClient/ApiClient";

const authURL = import.meta.env.VITE_API_AUTH_URL;

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("User");
  const [profilePic, setProfilePic] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const res = await apiClient.get(`${authURL}Get-Profile`);
      const { username, profilePic } = res.data.user;
      setUsername(username);
      setProfilePic(profilePic);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }));
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
    <nav className="navbar">
      <div className="Logo" style={{ marginLeft: "2rem" }}>TalkyChat</div>
      <div className="navbar-date">{currentDate}</div>

      <div className="navbar-controls" style={{ marginRight: "35px" }}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="avatar-circle">
            {profilePic ? (
              <img src={profilePic} alt="avatar" className="avatar-img" />
            ) : (
              username?.charAt(0).toUpperCase()
            )}
          </div>
          <span>{username}</span>
          <FiChevronDown size={16} className={`dropdown-arrow ${showDropdown ? 'rotate' : ''}`} />

          {showDropdown && (
            <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <a href="/profile">
                <FiUser size={16} className="dropdown-icon" />
                <span>Profile</span>
              </a>
              <a href="/settings">
                <FiSettings size={16} className="dropdown-icon" />
                <span>Settings</span>
              </a>
              <a href="/change-password">
                <FiKey size={16} className="dropdown-icon" />
                <span>Change Password</span>
              </a>
              <div className="dropdown-divider"></div>
              <a className="logout" onClick={handleLogout}>
                <FiLogOut size={16} className="dropdown-icon" />
                <span>Logout</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;