import { useState, useEffect } from 'react';
import { FiMoon, FiSun, FiUser, FiChevronDown } from 'react-icons/fi';
import './Navbar.scss';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('User');

  // Decode JWT token manually to get username
  const getUsernameFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.username || 'User';
    } catch (error) {
      console.error('Error decoding token:', error);
      return 'User';
    }
  };

  useEffect(() => {
    setUsername(getUsernameFromToken());
  }, []);

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className='Logo' style={{ marginLeft: '2rem' }}>TalkyChat</div>
      <div className="navbar-date">{currentDate}</div>

      <div className="navbar-controls" style={{marginRight:'35px'}}>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div
          className="user-profile"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="avatar-circle">B</div> 
          <span>{username}</span>
          <FiChevronDown size={16} />

          {showDropdown && (
            <div className="dropdown-menu">
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#" className="logout">Logout</a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
